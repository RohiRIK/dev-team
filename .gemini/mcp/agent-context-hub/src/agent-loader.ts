import type { AgentConfig } from './types.js';
import { LoadedAgent } from './types.js'; // Import LoadedAgent from types.ts

export interface AgentLoader {
    getAllAgents(): Promise<LoadedAgent[]>;
    getAgent(name: string): Promise<LoadedAgent | undefined>;
}

export const mockAgentLoader: AgentLoader = {
    getAllAgents: async () => {
        return [
            {
                name: 'coder_agent',
                description: 'An agent that writes code.',
                config: { name: 'coder_agent', description: 'An agent that writes code.', version: '1.0', capabilities: [], requiredInputs: [], outputFormat: 'code' },
                systemPrompt: 'You are a helpful coding assistant.',
                knowledge: new Map([['coding_best_practices.md', 'Content...']]),
                tools: [],
                mcpConfig: { servers: ['mcp://localhost:8080'] },
                path: '/agents/coder_agent',
            },
            {
                name: 'architect_agent',
                description: 'An agent that designs systems.',
                config: { name: 'architect_agent', description: 'An agent that designs systems.', version: '1.0', capabilities: [], requiredInputs: [], outputFormat: 'design' },
                systemPrompt: 'You are a helpful system architect.',
                knowledge: new Map([['architecture_patterns.md', 'Content...']]),
                tools: [],
                mcpConfig: { servers: ['mcp://localhost:8080'] },
                path: '/agents/architect_agent',
            },
            {
                name: 'tester_agent',
                description: 'An agent that tests software.',
                config: { name: 'tester_agent', description: 'An agent that tests software.', version: '1.0', capabilities: [], requiredInputs: [], outputFormat: 'test_report' },
                systemPrompt: 'You are a helpful testing assistant.',
                knowledge: new Map([['testing_strategies.md', 'Content...']]),
                tools: [],
                mcpConfig: { servers: ['mcp://localhost:8080'] },
                path: '/agents/tester_agent',
            },
        ];
    },
    getAgent: async (name: string) => {
        const agents = await mockAgentLoader.getAllAgents();
        return agents.find((agent: LoadedAgent) => agent.name === name);
    },
};
