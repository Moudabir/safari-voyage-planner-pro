
import { useState, useEffect } from "react";

const TAB_STORAGE_KEY = "safari-active-tab";

export const useTabPersistence = (defaultTab: string = "summary") => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      return saved || defaultTab;
    }
    return defaultTab;
  });

  const updateActiveTab = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem(TAB_STORAGE_KEY, tab);
  };

  // Handle browser visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Page became visible again, restore saved tab
        const saved = localStorage.getItem(TAB_STORAGE_KEY);
        if (saved && saved !== activeTab) {
          setActiveTab(saved);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [activeTab]);

  return { activeTab, updateActiveTab };
};
