import { create } from "zustand";

export interface SchemaData {
  projectName: string;
  meta: {
    key: string;
    data: Record<string, any>;
  };
  environments: { name: string; key: string }[];
}

interface StudioState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  projectInfo: { name: string; version: string } | null;
  setProjectInfo: (info: { name: string; version: string }) => void;
  schemaData: SchemaData | null;
  setSchemaData: (data: SchemaData | null) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  selectedKey: string | null;
  setSelectedKey: (key: string | null) => void;
  isSessionExpired: boolean;
  setIsSessionExpired: (expired: boolean) => void;
  sendWebSocketMessage: (msg: any) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  activeTab: "data",
  setActiveTab: (tab) => set({ activeTab: tab }),
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  sidebarWidth: 250,
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  schemaData: null,
  setSchemaData: (data) => set({ schemaData: data }),
  projectInfo: null,
  setProjectInfo: (info) => set({ projectInfo: info }),
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  selectedKey: null,
  setSelectedKey: (key) => set({ selectedKey: key }),
  isSessionExpired: false,
  setIsSessionExpired: (expired) => set({ isSessionExpired: expired }),
  sendWebSocketMessage: () => console.warn("WebSocket not connected"),
}));
