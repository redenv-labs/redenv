import NavigationBar from "./components/navigation-bar";
import Sidebar from "./components/sidebar";
import { useStudioStore } from "./store/useStudioStore";
import SchemaVisualizer from "./components/schema-visualizer";

import DataBrowser from "./components/data-browser";
import { useUrlSync } from "./hooks/useUrlSync";
import SessionExpiredModal from "./components/session-expired-modal";

function App() {
  useUrlSync();
  const { activeTab } = useStudioStore();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <NavigationBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative overflow-hidden">
          {activeTab === "data" && <DataBrowser />}
          {activeTab === "schema" && <SchemaVisualizer />}
          {activeTab === "query" && (
            <div className="p-8 text-center text-muted-foreground">
              Query Console (Coming Soon)
            </div>
          )}
        </main>
      </div>
      <SessionExpiredModal />
    </div>
  );
}

export default App;
