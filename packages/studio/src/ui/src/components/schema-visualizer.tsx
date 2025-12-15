import { useEffect, useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type ReactFlowProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Spinner } from "@heroui/react";
import { getBackendUrl } from "../utils/url";
import { CustomNode } from "./schema/CustomNode";

import "@xyflow/react/dist/style.css";
import { useStudioStore, type SchemaData } from "../store/useStudioStore";

const nodeTypes = {
  custom: CustomNode,
};

export default function SchemaVisualizer() {
  const { setSchemaData } = useStudioStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    fetch(getBackendUrl("/api/schema"))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch schema");
        return res.json();
      })
      .then((data: SchemaData) => {
        setSchemaData(data);
        const newNodes: ReactFlowProps["nodes"] = [];
        const newEdges: ReactFlowProps["edges"] = [];

        // Project Node (Top Center)
        newNodes.push({
          id: "project",
          type: "custom",
          position: { x: 0, y: 0 },
          data: {
            label: "Project",
            title: data.projectName,
            type: "project",
          },
        });

        // Meta Node (Bottom Left)
        if (data.meta) {
          newNodes.push({
            id: "meta",
            type: "custom",
            position: { x: -150, y: 150 },
            data: {
              label: "Metadata",
              subtitle: data.meta.key,
              type: "meta",
            },
          });

          newEdges.push({
            id: "e-project-meta",
            source: "project",
            target: "meta",
            animated: true,
            style: { stroke: "var(--color-brand)" },
            type: "smoothstep",
          });
        }

        // Environment Nodes (Bottom Right)
        data.environments.forEach((env, index) => {
          const envId = `env-${index}`;
          // Stack vertically starting from the same Y level as Meta
          const yOffset = 200 + index * 120;

          newNodes.push({
            id: envId,
            type: "custom",
            position: { x: 250, y: yOffset },
            data: {
              label: "Environment",
              title: env.name,
              subtitle: env.key,
              type: "env",
            },
          });

          // Connect Meta -> Env
          if (data.meta) {
            newEdges.push({
              id: `e-meta-${envId}`,
              source: "meta",
              target: envId,
              animated: true,
              style: { stroke: "var(--color-brand)" },
              type: "smoothstep",
            });
          } else {
            // Fallback if no meta (shouldn't happen in valid project)
            newEdges.push({
              id: `e-project-${envId}`,
              source: "project",
              target: envId,
              animated: true,
              style: { stroke: "var(--color-brand)" },
              type: "smoothstep",
            });
          }
        });

        setNodes(newNodes as any);
        setEdges(newEdges as any);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [setNodes, setEdges]);

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" className="[&_i]:border-b-red-500!" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls
          className="gap-1 [&_button]:bg-muted! [&_button]:w-9! [&_button]:h-9! [&_button]:border-0! [&_button]:hover:bg-muted/50! [&_button]:transition-all! [&_button]:duration-300!"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
