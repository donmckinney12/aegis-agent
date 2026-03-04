"use client";

import { memo } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    type EdgeProps,
} from "@xyflow/react";
import type { TrustLevel } from "@/lib/types";

const trustColors: Record<TrustLevel, string> = {
    verified: "#34d399",
    conditional: "#fbbf24",
    untrusted: "#fb923c",
    revoked: "#f87171",
};

function TrustEdgeComponent({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
}: EdgeProps) {
    const edgeData = data as { trustLevel: TrustLevel; protocol: string; requestsPerMin: number };
    const color = trustColors[edgeData?.trustLevel || "verified"];
    const isBlocked = edgeData?.trustLevel === "revoked";

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: color,
                    strokeWidth: isBlocked ? 1.5 : 2,
                    strokeDasharray: isBlocked ? "5,5" : undefined,
                    opacity: isBlocked ? 0.5 : 0.7,
                    filter: isBlocked ? undefined : `drop-shadow(0 0 3px ${color}40)`,
                }}
            />
            {!isBlocked && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: "all",
                        }}
                        className="nodrag nopan"
                    >
                        <div
                            className="px-2 py-0.5 rounded-full text-[9px] font-medium border backdrop-blur-sm"
                            style={{
                                backgroundColor: `${color}15`,
                                borderColor: `${color}30`,
                                color: color,
                            }}
                        >
                            {edgeData?.requestsPerMin || 0} req/min
                        </div>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}

export const TrustEdge = memo(TrustEdgeComponent);
