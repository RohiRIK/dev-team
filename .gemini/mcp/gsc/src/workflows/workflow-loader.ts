/**
 * Layer 7: Workflows - Workflow Loader
 * 
 * Load workflow definitions from templates
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import type { WorkflowDefinition } from '../types.js';
import { globalLogger } from '../logging/index.js';
import { workflowEngine } from './workflow-engine.js';

export class WorkflowLoader {
  private workflowsPath: string;

  constructor(workflowsPath: string = 'workflows/templates') {
    this.workflowsPath = workflowsPath;
  }

  /**
   * Load a workflow from file
   */
  async loadWorkflow(filename: string): Promise<WorkflowDefinition> {
    try {
      const filePath = join(this.workflowsPath, filename);
      const content = await readFile(filePath, 'utf-8');
      const workflow: WorkflowDefinition = JSON.parse(content);

      globalLogger.info('Workflow loaded from file', {
        filename,
        workflowId: workflow.id,
        name: workflow.name
      });

      return workflow;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      globalLogger.error('Failed to load workflow', {
        filename,
        error: errorMessage
      });

      throw new Error(`Failed to load workflow ${filename}: ${errorMessage}`);
    }
  }

  /**
   * Load all workflows from directory
   */
  async loadAllWorkflows(): Promise<WorkflowDefinition[]> {
    try {
      const files = await readdir(this.workflowsPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      globalLogger.info('Loading all workflows', {
        directory: this.workflowsPath,
        count: jsonFiles.length
      });

      const workflows: WorkflowDefinition[] = [];

      for (const file of jsonFiles) {
        try {
          const workflow = await this.loadWorkflow(file);
          workflows.push(workflow);
        } catch (error) {
          globalLogger.warn('Skipped invalid workflow file', {
            filename: file,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      return workflows;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      globalLogger.error('Failed to load workflows', {
        directory: this.workflowsPath,
        error: errorMessage
      });

      return [];
    }
  }

  /**
   * Register workflow with the engine
   */
  async registerWorkflow(filename: string): Promise<void> {
    const workflow = await this.loadWorkflow(filename);
    workflowEngine.registerWorkflow(workflow);
  }

  /**
   * Register all workflows
   */
  async registerAllWorkflows(): Promise<number> {
    const workflows = await this.loadAllWorkflows();
    
    for (const workflow of workflows) {
      workflowEngine.registerWorkflow(workflow);
    }

    globalLogger.info('All workflows registered', {
      count: workflows.length
    });

    return workflows.length;
  }

  /**
   * List available workflow files
   */
  async listWorkflowFiles(): Promise<string[]> {
    try {
      const files = await readdir(this.workflowsPath);
      return files.filter(f => f.endsWith('.json'));
    } catch (error) {
      globalLogger.error('Failed to list workflow files', {
        directory: this.workflowsPath,
        error: error instanceof Error ? error.message : String(error)
      });
      return [];
    }
  }

  /**
   * Validate workflow definition
   */
  validateWorkflow(workflow: WorkflowDefinition): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!workflow.id) {
      errors.push('Workflow ID is required');
    }

    if (!workflow.name) {
      errors.push('Workflow name is required');
    }

    if (!workflow.actions || workflow.actions.length === 0) {
      errors.push('Workflow must have at least one action');
    }

    // Check for duplicate action IDs
    const actionIds = new Set<string>();
    for (const action of workflow.actions) {
      if (actionIds.has(action.id)) {
        errors.push(`Duplicate action ID: ${action.id}`);
      }
      actionIds.add(action.id);
    }

    // Check for invalid dependencies
    for (const action of workflow.actions) {
      if (action.dependencies) {
        for (const depId of action.dependencies) {
          if (!actionIds.has(depId)) {
            errors.push(`Action ${action.id} depends on non-existent action: ${depId}`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a workflow template
   */
  createWorkflowTemplate(
    id: string,
    name: string,
    description: string,
    actions: Array<{
      id: string;
      type: WorkflowDefinition['actions'][0]['type'];
      params: Record<string, any>;
      dependencies?: string[];
    }>
  ): WorkflowDefinition {
    return {
      id,
      name,
      description,
      trigger: `manual/${id}`,
      actions,
      executionMode: 'sequential'
    };
  }
}

// Export singleton instance
export const workflowLoader = new WorkflowLoader();
