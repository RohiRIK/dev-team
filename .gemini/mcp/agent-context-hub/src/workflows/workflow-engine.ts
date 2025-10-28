import fs from 'fs/promises';
import path from 'path';

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  tool: string;
  server: string;
  params: Record<string, any>;
  dependsOn?: string[];
  required?: boolean;
  retryable?: boolean;
  timeout?: number;
}

export interface Workflow {
  name: string;
  description: string;
  version: string;
  metadata?: {
    author?: string;
    category?: string;
    tags?: string[];
  };
  steps: WorkflowStep[];
  errorHandling?: {
    onInitFailure?: string;
    onExecutionFailure?: string;
    onStatusUpdateFailure?: string;
  };
}

export interface WorkflowResult {
  workflow: string;
  success: boolean;
  steps: Array<{
    id: string;
    name: string;
    success: boolean;
    result?: any;
    error?: any;
    duration?: number;
  }>;
  totalDuration: number;
}

export class WorkflowEngine {
  private workflowsDir: string;
  private stepResults: Map<string, any> = new Map();

  constructor(workflowsDir: string) {
    this.workflowsDir = workflowsDir;
  }

  async loadWorkflow(templateName: string): Promise<Workflow> {
    const templatePath = path.join(
      this.workflowsDir,
      'templates',
      `${templateName}.json`
    );
    const content = await fs.readFile(templatePath, 'utf-8');
    return JSON.parse(content);
  }

  async listWorkflows(): Promise<string[]> {
    const templatesDir = path.join(this.workflowsDir, 'templates');
    const files = await fs.readdir(templatesDir);
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));
  }

  async executeWorkflow(
    templateName: string,
    variables: Record<string, any>,
    toolExecutor: (
      server: string,
      tool: string,
      params: any
    ) => Promise<any>
  ): Promise<WorkflowResult> {
    const startTime = Date.now();
    const workflow = await loadWorkflow(templateName);
    this.stepResults.clear();

    console.log(`🚀 Starting workflow: ${workflow.name}`);

    const results: WorkflowResult['steps'] = [];

    // Topologically sort steps based on dependencies
    const sortedSteps = this.topologicalSort(workflow.steps);

    for (const step of sortedSteps) {
      const stepStartTime = Date.now();
      console.log(`  ⚡ Executing step: ${step.name}`);

      // Replace variables in params
      const params = this.replaceVariables(
        step.params,
        variables,
        this.stepResults
      );

      try {
        const result = await toolExecutor(step.server, step.tool, params);
        const duration = Date.now() - stepStartTime;

        this.stepResults.set(step.id, { result, success: true });
        
        results.push({
          id: step.id,
          name: step.name,
          success: true,
          result,
          duration,
        });

        console.log(`  ✅ Step completed: ${step.name} (${duration}ms)`);
      } catch (error: any) {
        const duration = Date.now() - stepStartTime;
        console.error(`  ❌ Step failed: ${step.name}`, error);

        this.stepResults.set(step.id, { error, success: false });
        
        results.push({
          id: step.id,
          name: step.name,
          success: false,
          error: error.message || String(error),
          duration,
        });

        if (step.required) {
          const totalDuration = Date.now() - startTime;
          return {
            workflow: workflow.name,
            success: false,
            steps: results,
            totalDuration,
          };
        }
      }
    }

    const totalDuration = Date.now() - startTime;
    const allSuccessful = results.every((r) => r.success);

    console.log(
      `${allSuccessful ? '✅' : '⚠️'} Workflow completed: ${workflow.name} (${totalDuration}ms)`
    );

    return {
      workflow: workflow.name,
      success: allSuccessful,
      steps: results,
      totalDuration,
    };
  }

  private replaceVariables(
    obj: any,
    variables: Record<string, any>,
    stepResults: Map<string, any>
  ): any {
    if (typeof obj === 'string') {
      // Replace ${variable} or ${steps.stepId.result.field}
      return obj.replace(/\${([^}]+)}/g, (match, key) => {
        if (key.startsWith('steps.')) {
          // Access step results: ${steps.init.result.agentContext}
          const parts = key.split('.');
          let value: any = Object.fromEntries(stepResults);
          for (const part of parts) {
            value = value?.[part];
          }
          return value !== undefined ? value : match;
        }
        return variables[key] !== undefined ? variables[key] : match;
      });
    }

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        this.replaceVariables(item, variables, stepResults)
      );
    }

    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceVariables(value, variables, stepResults);
      }
      return result;
    }

    return obj;
  }

  private topologicalSort(steps: WorkflowStep[]): WorkflowStep[] {
    const sorted: WorkflowStep[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (step: WorkflowStep) => {
      if (visited.has(step.id)) return;
      if (visiting.has(step.id)) {
        throw new Error(
          `Circular dependency detected involving step: ${step.id}`
        );
      }

      visiting.add(step.id);

      if (step.dependsOn) {
        for (const depId of step.dependsOn) {
          const depStep = steps.find((s) => s.id === depId);
          if (depStep) visit(depStep);
        }
      }

      visiting.delete(step.id);
      visited.add(step.id);
      sorted.push(step);
    };

    for (const step of steps) {
      visit(step);
    }

    return sorted;
  }
}

export async function loadWorkflow(templateName: string): Promise<Workflow> {
  const workflowsDir = path.join(process.cwd(), 'workflows');
  const engine = new WorkflowEngine(workflowsDir);
  return engine.loadWorkflow(templateName);
}
