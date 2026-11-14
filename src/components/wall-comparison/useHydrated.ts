import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

// False during server rendering and the hydration pass, true afterwards. Anything
// that differs between server and browser (reduced-motion preference, an active
// switch) must wait for this so hydration matches the server HTML.
export function useHydrated() {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}
