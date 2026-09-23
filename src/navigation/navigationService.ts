import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<any>();

let pendingNavigation: { name: string; params?: any } | null = null;
let retryInterval: any = null;

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    pendingNavigation = { name, params };
    if (!retryInterval) {
      retryInterval = setInterval(() => {
        if (navigationRef.isReady()) {
          clearInterval(retryInterval);
          retryInterval = null;
          if (pendingNavigation) {
            navigationRef.navigate(pendingNavigation.name, pendingNavigation.params);
            pendingNavigation = null;
          }
        }
      }, 150);

      setTimeout(() => {
        if (retryInterval) {
          clearInterval(retryInterval);
          retryInterval = null;
          pendingNavigation = null;
        }
      }, 5000);
    }
  }
}

