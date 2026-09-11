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

interface PresenceContextType {
  onlineUserIds: Set<string>;
  isUserOnline: (userId?: string | null) => boolean;
  formatLastSeen: (timestamp?: string | null, isOnline?: boolean) => string;
  updateMyLastSeen: () => Promise<void>;
}

const PresenceContext = createContext<PresenceContextType>({
  onlineUserIds: new Set(),
  isUserOnline: () => false,
  formatLastSeen: () => "Offline",
  updateMyLastSeen: async () => {},
});

export const usePresence = () => useContext(PresenceContext);

interface PresenceProviderProps {
  children: ReactNode;
}

export const PresenceProvider: React.FC<PresenceProviderProps> = ({ children }) => {
  const user = useSelector(selectUser) as any;
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const channelRef = useRef<any>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateMyLastSeen = useCallback(async () => {
    if (!user?.id) return;
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update({ last_seen_at: now, updated_at: now } as any)
        .eq("id", user.id);

      if (error) {
        // Fallback gracefully if last_seen_at column migration is pending
        await supabase
          .from("profiles")
          .update({ updated_at: now })
          .eq("id", user.id);
      }
    } catch {
      // Fail silently to never block UI
    }
  }, [user?.id]);

  // Sync presence state into our local Set
  const syncPresenceState = useCallback((channel: any) => {
    if (!channel) return;
    const state = channel.presenceState();
    const activeIds = new Set<string>();

    Object.entries(state).forEach(([key, presences]: [string, any]) => {
      if (key && key !== "undefined" && key !== "null") {
        activeIds.add(String(key).toLowerCase());
      }
      if (Array.isArray(presences)) {
        presences.forEach((p: any) => {
          if (p?.user_id) {
            activeIds.add(String(p.user_id).toLowerCase());
          }
        });
      }
    });

    setOnlineUserIds(activeIds);
  }, []);

  // Initialize global presence channel when user is authenticated
  useEffect(() => {
    if (!user?.id) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setOnlineUserIds(new Set());
      return;
    }

    const userIdStr = String(user.id);
    const channel = supabase.channel("global_presence", {
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
          if (key) next.add(String(key).toLowerCase());
          if (Array.isArray(newPresences)) {
            newPresences.forEach((p: any) => {
              if (p?.user_id) next.add(String(p.user_id).toLowerCase());
            });
          }
          return next;
        });
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        // Run full sync on leave to ensure proper reconciliation
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

    // Periodic heartbeat every 2 minutes while app is active
    heartbeatRef.current = setInterval(() => {
      if (AppState.currentState === "active") {
        updateMyLastSeen();
      }
    }, 120000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (channelRef.current) {
        channelRef.current.untrack?.().catch?.(() => {});
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, syncPresenceState, updateMyLastSeen]);

  // Handle AppState (active = track & mark online, background/inactive = untrack & mark last seen)
  useEffect(() => {
    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (!user?.id || !channelRef.current) return;

      if (nextState === "active") {
        try {
          await channelRef.current.track({
            user_id: String(user.id),
            online_at: new Date().toISOString(),
          });
        } catch {}
        updateMyLastSeen();
      } else if (nextState.match(/inactive|background/)) {
        try {
          await channelRef.current.untrack();
        } catch {}
        updateMyLastSeen();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [user?.id, updateMyLastSeen]);

  const isUserOnline = useCallback(
    (userId?: string | null): boolean => {
      if (!userId) return false;
      return onlineUserIds.has(String(userId).toLowerCase());
    },
    [onlineUserIds]
  );

  const formatLastSeen = useCallback(
    (timestamp?: string | null, isOnline?: boolean): string => {
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
    []
  );

  return (
    <PresenceContext.Provider
      value={{
        onlineUserIds,
        isUserOnline,
        formatLastSeen,
        updateMyLastSeen,
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};

export default PresenceProvider;
