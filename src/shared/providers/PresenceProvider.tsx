import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/authSlice";
import { supabase } from "@shared/config/supabase";

import NetInfo from "@react-native-community/netinfo";

interface PresenceContextType {
  onlineUserIds: Set<string>;
  isUserOnline: (userId?: string | null) => boolean;
  formatLastSeen: (timestamp?: string | null, isOnline?: boolean) => string;
  updateMyLastSeen: () => Promise<void>;
  isNetworkConnected: boolean;
}

const PresenceContext = createContext<PresenceContextType>({
  onlineUserIds: new Set(),
  isUserOnline: () => false,
  formatLastSeen: () => "Offline",
  updateMyLastSeen: async () => {},
  isNetworkConnected: true,
});

export const usePresence = () => useContext(PresenceContext);

interface PresenceProviderProps {
  children: ReactNode;
}

export const PresenceProvider: React.FC<PresenceProviderProps> = ({
  children,
}) => {
  const user = useSelector(selectUser) as any;
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [isNetworkConnected, setIsNetworkConnected] = useState<boolean>(true);
  const channelRef = useRef<any>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Monitor network connectivity in real time
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );
      setIsNetworkConnected(connected);

      if (!connected) {
        // Immediate disconnect reaction: local user cannot reach any online presence
        setOnlineUserIds(new Set());
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateMyLastSeen = useCallback(async () => {
    if (!user?.id || !isNetworkConnected) return;
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update({ last_seen_at: now, updated_at: now } as any)
        .eq("id", user.id);

      if (error) {
        await supabase
          .from("profiles")
          .update({ updated_at: now })
          .eq("id", user.id);
      }
    } catch {
      // Fail silently
    }
  }, [user?.id, isNetworkConnected]);

  // Sync presence state into our local Set
  const syncPresenceState = useCallback((channel: any) => {
    if (!channel) return;
    const state = channel.presenceState();
    const activeIds = new Set<string>();

    Object.entries(state).forEach(([key, presences]: [string, any]) => {
      if (key && key !== "undefined" && key !== "null") {
        activeIds.add(String(key).trim().toLowerCase());
      }
      if (Array.isArray(presences)) {
        presences.forEach((p: any) => {
          if (p?.user_id) {
            activeIds.add(String(p.user_id).trim().toLowerCase());
          }
        });
      }
    });

    setOnlineUserIds(activeIds);
  }, []);

  const setupChannel = useCallback(() => {
    if (!user?.id || !isNetworkConnected) {
      if (channelRef.current) {
        try {
          channelRef.current.untrack?.().catch?.(() => {});
          supabase.removeChannel(channelRef.current);
        } catch {}
        channelRef.current = null;
      }
      setOnlineUserIds(new Set());
      return;
    }

    const userIdStr = String(user.id).trim().toLowerCase();

    // Clean up existing channel if any
    if (channelRef.current) {
      try {
        channelRef.current.untrack?.().catch?.(() => {});
        supabase.removeChannel(channelRef.current);
      } catch {}
      channelRef.current = null;
    }

    const channel = supabase.channel(`global_presence_${Date.now()}`, {
      config: {
        presence: { key: userIdStr },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        syncPresenceState(channel);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          if (key) next.add(String(key).trim().toLowerCase());
          if (Array.isArray(newPresences)) {
            newPresences.forEach((p: any) => {
              if (p?.user_id) next.add(String(p.user_id).trim().toLowerCase());
            });
          }
          return next;
        });
      })
      .on("presence", { event: "leave" }, () => {
        syncPresenceState(channel);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          try {
            await channel.track({
              user_id: userIdStr,
              online_at: new Date().toISOString(),
            });
          } catch {}
          updateMyLastSeen();
        }
      });

    channelRef.current = channel;
  }, [user?.id, isNetworkConnected, syncPresenceState, updateMyLastSeen]);

  // Setup presence channel on auth or network connection change
  useEffect(() => {
    setupChannel();

    // Periodic heartbeat every 30s while app is active
    heartbeatRef.current = setInterval(() => {
      if (
        AppState.currentState === "active" &&
        isNetworkConnected &&
        channelRef.current
      ) {
        try {
          channelRef.current.track({
            user_id: String(user?.id).trim().toLowerCase(),
            online_at: new Date().toISOString(),
          });
        } catch {}
        updateMyLastSeen();
      }
    }, 30000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (channelRef.current) {
        try {
          channelRef.current.untrack?.().catch?.(() => {});
          supabase.removeChannel(channelRef.current);
        } catch {}
        channelRef.current = null;
      }
    };
  }, [setupChannel, isNetworkConnected, user?.id, updateMyLastSeen]);

  // Handle AppState (active = re-establish & mark online, background = untrack & mark last seen)
  useEffect(() => {
    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (!user?.id) return;

      if (nextState === "active") {
        if (isNetworkConnected) {
          setupChannel();
          updateMyLastSeen();
        }
      } else if (nextState.match(/inactive|background/)) {
        if (channelRef.current) {
          try {
            await channelRef.current.untrack();
          } catch {}
        }
        updateMyLastSeen();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [user?.id, isNetworkConnected, setupChannel, updateMyLastSeen]);

  const isUserOnline = useCallback(
    (userId?: string | null): boolean => {
      if (!isNetworkConnected || !userId) return false;
      return onlineUserIds.has(String(userId).trim().toLowerCase());
    },
    [isNetworkConnected, onlineUserIds],
  );

  const formatLastSeen = useCallback(
    (timestamp?: string | null, isOnline?: boolean): string => {
      if (!isNetworkConnected) return "Waiting for network...";
      if (isOnline) return "Online";
      if (!timestamp) return "Offline";

      try {
        const date = new Date(timestamp);
        const diffMs = Date.now() - date.getTime();
        if (isNaN(diffMs) || diffMs < 0) return "Offline";

        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffMin < 1) return "Just now";
        if (diffMin < 60) return `Last seen ${diffMin}m ago`;
        if (diffHour < 24) return `Last seen ${diffHour}h ago`;
        if (diffDay === 1) return "Last seen yesterday";
        if (diffDay < 7) return `Last seen ${diffDay}d ago`;
        return `Last seen ${date.toLocaleDateString()}`;
      } catch {
        return "Offline";
      }
    },
    [isNetworkConnected],
  );

  return (
    <PresenceContext.Provider
      value={{
        onlineUserIds,
        isUserOnline,
        formatLastSeen,
        updateMyLastSeen,
        isNetworkConnected,
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};

export default PresenceProvider;
