import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardBody } from "@heroui/react";
import { Folder, Key, Server, Database, Eye } from "lucide-react";
import { useStudioStore } from "../../store/useStudioStore";

const ICONS = {
  project: Folder,
  meta: Key,
  env: Server,
  database: Database,
};

const COLORS = {
  project: "text-brand bg-brand/10",
  meta: "text-amber-500 bg-amber-500/10",
  env: "text-blue-500 bg-blue-500/10",
  database: "text-purple-500 bg-purple-500/10",
};

export function CustomNode({ data }: NodeProps) {
  const Icon = ICONS[data.type as keyof typeof ICONS] || Folder;
  const colorClass = COLORS[data.type as keyof typeof COLORS] || COLORS.project;
  const { setActiveTab, setSelectedKey, schemaData } = useStudioStore();

  const handleNavigate = () => {
    setActiveTab("data");
    if (data.type === "project")
      setSelectedKey(
        `${schemaData?.environments[0].key}`
      );
    if (data.subtitle) {
      setSelectedKey(data.subtitle as string);
    }
  };

  return (
    <div className="relative group">
      {/* Input Handle (Left) */}
      {data.type !== "project" && (
        <Handle
          type="target"
          position={data.type === "meta" ? Position.Top : Position.Left}
          className="bg-brand! w-3! h-3! border-2! border-background!"
        />
      )}

      <Card className="border-2 border-transparent group-hover:border-brand/50 transition-colors shadow-lg min-w-[200px] bg-muted/50 backdrop-blur">
        <CardBody className="flex flex-row items-center gap-3 p-3 relative">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              {data.label as string}
            </p>
            <h3 className="text-sm font-bold truncate max-w-[150px]">
              {data.title as string}
            </h3>
            {(data as any)?.subtitle && (
              <p className="text-[10px] text-muted-foreground font-mono mt-1 truncate max-w-[150px]">
                {data.subtitle as string}
              </p>
            )}
          </div>

          <button
            className="opacity-0 group-hover:opacity-100"
            onClick={handleNavigate}
          >
            <Eye
              size={16}
              className="text-muted-foreground hover:text-foreground transition-all duration-200"
            />
          </button>
        </CardBody>
      </Card>

      {/* Output Handle (Bottom) - For Project */}
      {data.type === "project" && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="bg-brand! !w-3! !h-3! !border-2! !border-background!"
        />
      )}

      {/* Output Handle (Right) - For Meta */}
      {data.type === "meta" && (
        <Handle
          type="source"
          position={Position.Right}
          className="bg-brand! !w-3! !h-3! !border-2! !border-background!"
        />
      )}
    </div>
  );
}
