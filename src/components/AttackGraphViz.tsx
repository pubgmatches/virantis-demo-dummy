'use client';

import { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    Node,
    Edge,
    NodeProps,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { User, Cpu, Database, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import threatModelData from '@/data/dummy_threat_model.json';

// Custom Node Component
function CustomNode({ data, type }: NodeProps) {
    const getIcon = () => {
        switch (type) {
            case 'externalEntity':
                return <User className="w-5 h-5" />;
            case 'process':
                return <Cpu className="w-5 h-5" />;
            case 'dataStore':
                return <Database className="w-5 h-5" />;
            default:
                return <Cpu className="w-5 h-5" />;
        }
    };

    const getStyles = () => {
        const base = 'px-4 py-3 rounded-lg border-2 min-w-[160px] text-center transition-all duration-300';
        switch (type) {
            case 'externalEntity':
                return `${base} bg-dark-blue-gray border-electric-blue/50 hover:border-electric-blue`;
            case 'process':
                return `${base} bg-dark-blue-gray border-purple/50 hover:border-purple rounded-xl`;
            case 'dataStore':
                return `${base} bg-dark-blue-gray border-emerald/50 hover:border-emerald`;
            default:
                return `${base} bg-dark-blue-gray border-zinc-700`;
        }
    };

    const isCompromised = data.isCompromised as boolean;

    return (
        <div className={`${getStyles()} ${isCompromised ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-deep-navy animate-pulse' : ''}`}>
            <Handle type="target" position={Position.Left} className="!bg-zinc-600 !w-2 !h-2" />
            <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-lg ${isCompromised ? 'bg-red-500/20 text-red-500' : 'bg-white/5'}`}>
                    {isCompromised ? <AlertTriangle className="w-5 h-5" /> : getIcon()}
                </div>
                <div className="text-sm font-medium text-white">{data.label as string}</div>
                <div className="text-xs text-zinc-500">{data.type as string}</div>
            </div>
            <Handle type="source" position={Position.Right} className="!bg-zinc-600 !w-2 !h-2" />
        </div>
    );
}

// Node types registration
const nodeTypes = {
    externalEntity: CustomNode,
    process: CustomNode,
    dataStore: CustomNode,
};

interface AttackGraphVizProps {
    onBack: () => void;
}

export function AttackGraphViz({ onBack }: AttackGraphVizProps) {
    const { components, dataFlows, attackPath } = threatModelData;

    // Map component types to node types
    const getNodeType = (componentType: string) => {
        switch (componentType) {
            case 'external_entity':
                return 'externalEntity';
            case 'process':
                return 'process';
            case 'data_store':
                return 'dataStore';
            default:
                return 'process';
        }
    };

    // Check if component is in attack path
    const isInAttackPath = useCallback((componentId: string) => {
        return attackPath.stages.some(
            (stage) => stage.source === componentId || stage.target === componentId
        );
    }, [attackPath.stages]);

    // Generate nodes from components
    const initialNodes: Node[] = useMemo(() => {
        const positions = [
            { x: 50, y: 200 },    // User Interface
            { x: 350, y: 200 },   // Orchestrator Agent
            { x: 350, y: 50 },    // Email Fetcher Agent
            { x: 650, y: 200 },   // Payment API
            { x: 650, y: 350 },   // Booking Database
            { x: 350, y: 350 },   // Memory Store
        ];

        return components.map((component, index) => ({
            id: component.id,
            type: getNodeType(component.type),
            position: positions[index] || { x: 100 * index, y: 100 },
            data: {
                label: component.name,
                type: component.type.replace('_', ' '),
                isCompromised: isInAttackPath(component.id),
            },
        }));
    }, [components, isInAttackPath]);

    // Generate edges from data flows
    const initialEdges: Edge[] = useMemo(() => {
        // Check if edge is part of attack path
        const isAttackEdge = (sourceId: string, targetId: string) => {
            return attackPath.stages.some(
                (stage) => stage.source === sourceId && stage.target === targetId
            );
        };

        return dataFlows
            .filter((flow) => flow.source !== 'external' && flow.target !== 'external')
            .map((flow) => {
                const isAttack = isAttackEdge(flow.source, flow.target);
                return {
                    id: flow.id,
                    source: flow.source,
                    target: flow.target,
                    label: flow.dataType,
                    type: 'smoothstep',
                    animated: isAttack,
                    style: {
                        stroke: isAttack ? '#ef4444' : '#71717a',
                        strokeWidth: isAttack ? 3 : 1,
                        strokeDasharray: isAttack ? undefined : '5 5',
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: isAttack ? '#ef4444' : '#71717a',
                    },
                    labelStyle: {
                        fill: '#a1a1aa',
                        fontSize: 10,
                    },
                    labelBgStyle: {
                        fill: '#12121e',
                        fillOpacity: 0.9,
                    },
                };
            });
    }, [dataFlows, attackPath.stages]);

    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-4"
            >
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">Attack Graph Visualization</h2>
                    <p className="text-zinc-400 text-sm">Interactive view of system components and attack paths</p>
                </div>
                <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />} onClick={onBack}>
                    Back to Dashboard
                </Button>
            </motion.div>

            {/* Graph Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 rounded-xl border border-zinc-800 overflow-hidden bg-deep-navy"
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    minZoom={0.5}
                    maxZoom={1.5}
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                    }}
                >
                    <Background color="#1a1a2e" gap={20} />
                    <Controls
                        className="!bg-dark-blue-gray !border-zinc-800 !rounded-lg !shadow-none"
                        showInteractive={false}
                    />
                </ReactFlow>
            </motion.div>

            {/* Legend */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-electric-blue bg-dark-blue-gray" />
                        <span className="text-zinc-400 text-sm">External Entity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-lg border-2 border-purple bg-dark-blue-gray" />
                        <span className="text-zinc-400 text-sm">Process</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-emerald bg-dark-blue-gray" />
                        <span className="text-zinc-400 text-sm">Data Store</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-red-500" />
                        <span className="text-zinc-400 text-sm">Attack Path</span>
                    </div>
                </div>

                {/* Attack Path Info */}
                <div className="card p-3 bg-red-500/10 border-red-500/20">
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">Active Attack Path:</span>
                        <span className="text-red-400">{attackPath.name}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
