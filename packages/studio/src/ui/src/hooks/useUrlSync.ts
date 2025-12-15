import { useEffect } from "react";
import { useStudioStore } from "../store/useStudioStore";

export function useUrlSync() {
  const { activeTab, setActiveTab, selectedKey, setSelectedKey } =
    useStudioStore();

  // Sync URL -> Store (On Mount/PopState)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("activeTab");
      const key = params.get("key");

      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      }
      if (key && key !== selectedKey) {
        setSelectedKey(key);
      }
    };

    // Initial check
    handleUrlChange();

    // Listen for back/forward navigation
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, [setActiveTab, setSelectedKey]); // Intentionally omitting activeTab/selectedKey to avoid loops

  // Sync Store -> URL (On State Change)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentTab = params.get("activeTab");
    const currentKey = params.get("key");

    let needsUpdate = false;

    if (activeTab !== currentTab) {
      params.set("activeTab", activeTab);
      needsUpdate = true;
    }

    if (selectedKey) {
      if (selectedKey !== currentKey) {
        params.set("key", selectedKey);
        needsUpdate = true;
      }
    } else if (currentKey) {
      params.delete("key");
      needsUpdate = true;
    }

    if (needsUpdate) {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", newUrl);
    }
  }, [activeTab, selectedKey]);
}
