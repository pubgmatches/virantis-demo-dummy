// Virantis Demo Constants

export const APP_NAME = 'Virantis';
export const APP_TAGLINE = 'Agentic AI Threat Modeling Platform';

export const PIPELINE_STAGES = [
    {
        id: 1,
        name: 'Intake & Detection',
        description: 'Processing uploaded diagram',
        statusText: 'Vision-Language Model Scanning...',
    },
    {
        id: 2,
        name: 'AI Decision Engine',
        description: 'Analyzing architecture patterns',
        statusText: 'Constructing Logic Attack Graph...',
    },
    {
        id: 3,
        name: 'STRIDE/PASTA Execution',
        description: 'Executing threat methodologies',
        statusText: 'Mapping OWASP Agentic Risks...',
    },
    {
        id: 4,
        name: 'Interactive Clarification',
        description: 'Identifying components',
        statusText: 'Identifying Trust Boundaries...',
    },
    {
        id: 5,
        name: 'Actionable Threat Report',
        description: 'Generating report',
        statusText: 'Generating Threat Report...',
    },
] as const;

export const SEVERITY_LEVELS = {
    critical: {
        label: 'Critical',
        color: '#ef4444',
        bgClass: 'bg-red-500/15',
        textClass: 'text-red-500',
    },
    high: {
        label: 'High',
        color: '#f97316',
        bgClass: 'bg-orange-500/15',
        textClass: 'text-orange-500',
    },
    medium: {
        label: 'Medium',
        color: '#f59e0b',
        bgClass: 'bg-yellow-500/15',
        textClass: 'text-yellow-500',
    },
    low: {
        label: 'Low',
        color: '#22c55e',
        bgClass: 'bg-green-500/15',
        textClass: 'text-green-500',
    },
} as const;

export const COMPONENT_TYPES = {
    external_entity: {
        label: 'External Entity',
        borderColor: 'border-electric-blue',
        icon: 'user',
    },
    process: {
        label: 'Process',
        borderColor: 'border-purple',
        icon: 'cpu',
    },
    data_store: {
        label: 'Data Store',
        borderColor: 'border-emerald',
        icon: 'database',
    },
} as const;

export const NAVIGATION = [
    { label: 'Home', href: '/' },
    { label: 'Analyze', href: '/analyze' },
];

export const DEMO_CONFIG = {
    pipelineStageDelayMs: 600,
    totalPipelineTimeMs: 3000,
    toastDurationMs: 4000,
};

// ASCII art for console
export const CONSOLE_BANNER = `
██╗   ██╗██╗██████╗  █████╗ ███╗   ██╗████████╗██╗███████╗
██║   ██║██║██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██║██╔════╝
██║   ██║██║██████╔╝███████║██╔██╗ ██║   ██║   ██║███████╗
╚██╗ ██╔╝██║██╔══██╗██╔══██║██║╚██╗██║   ██║   ██║╚════██║
 ╚████╔╝ ██║██║  ██║██║  ██║██║ ╚████║   ██║   ██║███████║
  ╚═══╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚══════╝
          Agentic AI Threat Modeling Platform
`;
