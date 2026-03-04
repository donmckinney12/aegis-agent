"use client";

import { useCallback, useMemo, useState } from "react";
import {
    ReactFlow,
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AgentNode } from "@/components/trust-graph/agent-node";
import { TrustEdge } from "@/components/trust-graph/trust-edge";
import { trustGraphNodes, trustGraphEdges } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getTrustLevelBg, getStatusColor, getAgentTypeIcon } from "@/lib/utils";
import { Network, Info, X } from "lucide-react";
import type { TrustGraphNode as TrustGraphNodeType } from "@/lib/types";

const nodeTypes = { agentNode: AgentNode };
const edgeTypes = { trustEdge: TrustEdge };

// Position nodes in a circular layout
function getNodePositions(count: number, centerX: number, centerY: number, radius: number) {
    return Array.from({ length: count }, (_, i) => {
        const angle = (2 * Math.PI * i) / count - Math.PI / 2;
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        };
    });
}

export default function TrustGraphPage() {
    const [selectedNode, setSelectedNode] = useState<TrustGraphNodeType | null>(null);

    const positions = useMemo(
        () => getNodePositions(trustGraphNodes.length, 400, 300, 280),
        []
    );

    const initialNodes: Node[] = useMemo(
        () =>
            trustGraphNodes.map((node, i) => ({
                id: node.id,
                type: "agentNode",
                position: positions[i],
                data: { ...node },
            })),
        [positions]
    );

    const initialEdges: Edge[] = useMemo(
        () =>
            trustGraphEdges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: "trustEdge",
                animated: edge.trustLevel !== "revoked",
                data: {
                    trustLevel: edge.trustLevel,
                    protocol: edge.protocol,
                    requestsPerMin: edge.requestsPerMin,
                },
            })),
        []
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            const graphNode = trustGraphNodes.find((n) => n.id === node.id);
            if (graphNode) setSelectedNode(graphNode);
        },
        []
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Network className="w-6 h-6 text-primary" />
                        Trust Graph
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Interactive visualization of agent-to-agent communication topology and trust relationships
                    </p>
                </div>
                {/* Legend */}
                <div className="hidden lg:flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-emerald-400 rounded" />
                        <span className="text-xs text-muted-foreground">Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-amber-400 rounded" />
                        <span className="text-xs text-muted-foreground">Conditional</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-red-400 rounded border-dashed" style={{ borderTop: '1px dashed #f87171', height: 0 }} />
                        <span className="text-xs text-muted-foreground">Revoked</span>
                    </div>
                </div>
            </div>

            {/* Graph Canvas */}
            <div className="relative">
                <Card className="border-border/50 bg-card/30 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="h-[calc(100vh-220px)] min-h-[500px]">
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onNodeClick={onNodeClick}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                fitView
                                fitViewOptions={{ padding: 0.2 }}
                                minZoom={0.3}
                                maxZoom={1.5}
                                defaultEdgeOptions={{ animated: true }}
                            >
                                <Controls
                                    showInteractive={false}
                                    className="!bottom-4 !left-4"
                                />
                                <MiniMap
                                    nodeColor={(node) => {
                                        const d = node.data as unknown as TrustGraphNodeType;
                                        if (d.trustLevel === "revoked") return "#f87171";
                                        if (d.trustLevel === "conditional") return "#fbbf24";
                                        if (d.status === "active") return "#34d399";
                                        return "#71717a";
                                    }}
                                    maskColor="rgba(0,0,0,0.7)"
                                    className="!bottom-4 !right-4"
                                    style={{ backgroundColor: "oklch(0.12 0.01 260)" }}
                                />
                                <Background
                                    variant={BackgroundVariant.Dots}
                                    gap={20}
                                    size={1}
                                    color="rgba(255,255,255,0.03)"
                                />
                                {/* Stats Overlay */}
                                <Panel position="top-left">
                                    <div className="flex gap-2">
                                        <div className="px-3 py-1.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 text-xs">
                                            <span className="text-muted-foreground">Nodes:</span>{" "}
                                            <span className="font-semibold text-foreground">{trustGraphNodes.length}</span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 text-xs">
                                            <span className="text-muted-foreground">Edges:</span>{" "}
                                            <span className="font-semibold text-foreground">{trustGraphEdges.length}</span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 text-xs">
                                            <span className="text-muted-foreground">Active:</span>{" "}
                                            <span className="font-semibold text-emerald-400">
                                                {trustGraphNodes.filter((n) => n.status === "active").length}
                                            </span>
                                        </div>
                                    </div>
                                </Panel>
                            </ReactFlow>
                        </div>
                    </CardContent>
                </Card>

                {/* Detail Panel */}
                {selectedNode && (
                    <div className="absolute top-4 right-4 z-10 w-80">
                        <Card className="border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl aegis-glow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Info className="w-4 h-4 text-primary" />
                                        Agent Details
                                    </CardTitle>
                                    <button
                                        onClick={() => setSelectedNode(null)}
                                        className="p-1 rounded hover:bg-muted transition-colors"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getAgentTypeIcon(selectedNode.type)}</span>
                                    <div>
                                        <p className="text-sm font-semibold">{selectedNode.agentName}</p>
                                        <p className="text-[11px] text-muted-foreground font-mono">{selectedNode.spiffeId}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className={cn("text-xs capitalize", getStatusColor(selectedNode.status))}>
                                        {selectedNode.status}
                                    </Badge>
                                    <Badge variant="outline" className={cn("text-xs capitalize", getTrustLevelBg(selectedNode.trustLevel))}>
                                        {selectedNode.trustLevel}
                                    </Badge>
                                </div>
                                <div className="space-y-2 pt-2 border-t border-border/50">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Type</span>
                                        <span className="font-medium capitalize">{selectedNode.type}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Connections</span>
                                        <span className="font-medium">
                                            {trustGraphEdges.filter(
                                                (e) => e.source === selectedNode.id || e.target === selectedNode.id
                                            ).length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Total Traffic</span>
                                        <span className="font-medium">
                                            {trustGraphEdges
                                                .filter((e) => e.source === selectedNode.id)
                                                .reduce((sum, e) => sum + e.requestsPerMin, 0)}{" "}
                                            req/min
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
