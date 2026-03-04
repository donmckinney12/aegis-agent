"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn, getStatusColor, getTrustLevelBg, getAgentTypeIcon } from "@/lib/utils";
import type { TrustGraphNode } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type AgentNodeData = TrustGraphNode & { selected?: boolean };

function AgentNodeComponent({ data }: NodeProps) {
    const nodeData = data as unknown as AgentNodeData;
    const isActive = nodeData.status === "active";
    const isRevoked = nodeData.trustLevel === "revoked";

    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                className="!w-2 !h-2 !bg-primary !border-background !border-2"
            />
            <div
                className={cn(
                    "px-4 py-3 rounded-xl border bg-card/90 backdrop-blur-sm min-w-[180px] transition-all duration-200",
                    isRevoked
                        ? "border-red-500/40 shadow-[0_0_15px_rgba(248,113,113,0.15)]"
                        : isActive
                            ? "border-border/60 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                            : "border-border/40 opacity-70"
                )}
            >
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="text-lg">{getAgentTypeIcon(nodeData.type)}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{nodeData.agentName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                            {nodeData.spiffeId.split("/").pop()}
                        </p>
                    </div>
                    <div
                        className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            isActive ? "bg-emerald-400 animate-pulse" : isRevoked ? "bg-red-400" : "bg-zinc-500"
                        )}
                    />
                </div>
                <div className="flex items-center gap-1.5">
                    <Badge
                        variant="outline"
                        className={cn("text-[9px] px-1.5 py-0 capitalize", getStatusColor(nodeData.status))}
                    >
                        {nodeData.status}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={cn("text-[9px] px-1.5 py-0 capitalize", getTrustLevelBg(nodeData.trustLevel))}
                    >
                        {nodeData.trustLevel}
                    </Badge>
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-2 !h-2 !bg-primary !border-background !border-2"
            />
        </>
    );
}

export const AgentNode = memo(AgentNodeComponent);
