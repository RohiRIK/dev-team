import type { AgentConfig } from './types.js';
import { LoadedAgent } from './types.js'; // Import LoadedAgent from types.ts

export interface AgentLoader {
    getAllAgents(): LoadedAgent[];
    getAgent(name: string): LoadedAgent | undefined;
}

export const mockAgentLoader: AgentLoader = {
    getAllAgents: () => [
        {
            name: 'coder_agent',
            description: 'An agent that writes code.',
            config: { name: 'coder_agent', description: 'An agent that writes code.', version: '1.0', capabilities: [], requiredInputs: [], outputFormat: 'code' },
            systemPrompt: 'You are a helpful coding assistant.',
            knowledge: new Map([['coding_best_practices.md', 'Content...']]),
            tools: [],
            mcpConfig: { servers: ['mcp://localhost:8080'] },
            path: '/agents/coder_agent', // Add path property
        },
        {
            name: 'architect_agent',
            description: 'An agent that designs systems.',
            config: { name: 'architect_agent', description: 'An agent that designs systems.', version: '1.0', capabilities: [], requiredInputs: [], outputFormat: 'design' },
            systemPrompt: 'You are a helpful system architect.',
            knowledge: new Map([['architecture_patterns.md', 'Content...']]),
            tools: [],
            mcpConfig: { servers: ['mcp://localhost:8080'] },
            path: '/agents/architect_agent', // Add path property
        },
        {
            name: 'tester_agent',
            description: 'An agent that tests software.',
            config: { name: 'tester_agent', description: 'An agent that tests software.', version: '1.0', capabilities: [], requiredInputs: [], outputFormat: 'test_report' },
            systemPrompt: 'You are a helpful testing assistant.',
            knowledge: new Map([['testing_strategies.md', 'Content...']]),
            tools: [],
            mcpConfig: { servers: ['mcp://localhost:8080'] },
            path: '/agents/tester_agent', // Add path property
        },
    ],
    getAgent: (name: string) => {
        const agents = mockAgentLoader.getAllAgents();
        return agents.find(agent => agent.name === name);
    },
};
