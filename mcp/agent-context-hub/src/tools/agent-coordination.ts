import { AgentTask, SharedContext } from '../types';
import { getSessionContext, storeContext } from '../resources/context-store';

export async function createAgentTask(sessionId: string, agentName: string, task: string, input: any, dependencies: string[]): Promise<AgentTask> {
    const context = await getSessionContext(sessionId);
    if (!context) {
        throw new Error(`Session ${sessionId} not found`);
    }

    const taskId = `task_${context.tasks.size + 1}`;
    const newTask: AgentTask = {
        id: taskId,
        agentName,
        task,
        status: 'pending',
        input,
        dependencies,
        createdAt: new Date(),
        progress: 0,
    };

    context.tasks.set(taskId, newTask);
    await storeContext(sessionId, { tasks: context.tasks });

    return newTask;
}

export async function updateTaskStatus(sessionId: string, taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'failed', output?: any, progress?: number, error?: string): Promise<AgentTask> {
    const context = await getSessionContext(sessionId);
    if (!context) {
        throw new Error(`Session ${sessionId} not found`);
    }

    const task = context.tasks.get(taskId);
    if (!task) {
        throw new Error(`Task ${taskId} not found in session ${sessionId}`);
    }

    task.status = status;
    if (output) task.output = output;
    if (progress) task.progress = progress;
    if (error) task.error = error;
    if (status === 'completed' || status === 'failed') {
        task.completedAt = new Date();
    }

    context.tasks.set(taskId, task);
    await storeContext(sessionId, { tasks: context.tasks });

    return task;
}

export async function getReadyTasks(sessionId: string): Promise<AgentTask[]> {
    const context = await getSessionContext(sessionId);
    if (!context) {
        throw new Error(`Session ${sessionId} not found`);
    }

    const readyTasks: AgentTask[] = [];
    for (const task of context.tasks.values()) {
        if (task.status === 'pending') {
            const depsCompleted = task.dependencies.every((depId: string) => {
                const depTask = context.tasks.get(depId);
                return depTask && depTask.status === 'completed';
            });
            if (depsCompleted) {
                readyTasks.push(task);
            }
        }
    }

    return readyTasks;
}
