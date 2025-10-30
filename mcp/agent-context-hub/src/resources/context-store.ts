import { SharedContext, LoadedAgent } from '../types.js';
import type { AgentLoader } from '../agent-loader.js';

// In-memory store for contexts
const contexts = new Map<string, SharedContext>();

export async function getSessionContext(sessionId: string): Promise<SharedContext | undefined> {
    return contexts.get(sessionId);
}

export async function storeContext(sessionId: string, data: any): Promise<void> {
    let context = contexts.get(sessionId);
    if (!context) {
        context = {
            sessionId,
            tasks: new Map(),
            results: new Map(),
            meta: {},
            subscriptions: new Map(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    context.meta = { ...context.meta, ...data };
    context.updatedAt = new Date();
    contexts.set(sessionId, context);
}

export function getTaskQueue(sessionId: string): Map<string, any> | undefined {
    const context = contexts.get(sessionId);
    return context?.tasks;
}

export async function getAgentRegistry(agentLoader: AgentLoader): Promise<LoadedAgent[]> {
    // For now, return a mock registry. In a real scenario, this would come from agentLoader.
    return await agentLoader.getAllAgents();
}