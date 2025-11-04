/**
 * Layer 6: Tools - Shell Executor
 * 
 * Execute shell commands and manage mini-shell instances
 */

import { spawn, type ChildProcess } from 'child_process';
import type { ShellCommand, ToolExecutionResult } from '../types.js';
import { globalLogger } from '../logging/index.js';

export class ShellExecutor {
  private activeProcesses: Map<string, ChildProcess> = new Map();

  /**
   * Execute a shell command
   */
  async execute(command: ShellCommand): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    globalLogger.info('Executing shell command', {
      command: command.command,
      args: command.args,
      cwd: command.cwd
    });

    try {
      const result = await this.runCommand(command);
      const duration = Date.now() - startTime;

      globalLogger.info('Shell command completed', {
        command: command.command,
        duration,
        success: result.success
      });

      return {
        success: result.success,
        output: result.output,
        error: result.error,
        duration,
        metadata: {
          exitCode: result.exitCode,
          signal: result.signal
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      globalLogger.error('Shell command failed', {
        command: command.command,
        error: errorMessage,
        duration
      });

      return {
        success: false,
        error: errorMessage,
        duration,
        metadata: { error }
      };
    }
  }

  /**
   * Run command and capture output
   */
  private runCommand(command: ShellCommand): Promise<{
    success: boolean;
    output?: string;
    error?: string;
    exitCode?: number;
    signal?: string;
  }> {
    return new Promise((resolve) => {
      const proc = spawn(command.command, command.args, {
        cwd: command.cwd,
        env: { ...process.env, ...command.env },
        shell: true
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code, signal) => {
        resolve({
          success: code === 0,
          output: stdout,
          error: stderr || undefined,
          exitCode: code || undefined,
          signal: signal || undefined
        });
      });

      proc.on('error', (error) => {
        resolve({
          success: false,
          error: error.message
        });
      });

      // Handle timeout
      if (command.timeout) {
        setTimeout(() => {
          proc.kill();
          resolve({
            success: false,
            error: `Command timed out after ${command.timeout}ms`
          });
        }, command.timeout);
      }
    });
  }

  /**
   * Start a background shell process
   */
  startBackgroundProcess(
    id: string,
    command: ShellCommand
  ): { processId: string; success: boolean; error?: string } {
    try {
      const proc = spawn(command.command, command.args, {
        cwd: command.cwd,
        env: { ...process.env, ...command.env },
        shell: true,
        detached: true,
        stdio: 'ignore'
      });

      this.activeProcesses.set(id, proc);

      globalLogger.info('Background process started', {
        processId: id,
        command: command.command,
        pid: proc.pid
      });

      return {
        processId: id,
        success: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      globalLogger.error('Failed to start background process', {
        processId: id,
        error: errorMessage
      });

      return {
        processId: id,
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Stop a background process
   */
  stopBackgroundProcess(id: string): { success: boolean; error?: string } {
    const proc = this.activeProcesses.get(id);
    
    if (!proc) {
      return {
        success: false,
        error: `Process ${id} not found`
      };
    }

    try {
      proc.kill();
      this.activeProcesses.delete(id);

      globalLogger.info('Background process stopped', {
        processId: id
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      globalLogger.error('Failed to stop background process', {
        processId: id,
        error: errorMessage
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get active background processes
   */
  getActiveProcesses(): string[] {
    return Array.from(this.activeProcesses.keys());
  }

  /**
   * Load context from file using shell
   */
  async loadContext(contextPath: string): Promise<ToolExecutionResult> {
    return this.execute({
      command: 'cat',
      args: [contextPath],
      timeout: 5000
    });
  }

  /**
   * Load agent knowledge base
   */
  async loadKnowledgeBase(knowledgeBasePath: string): Promise<ToolExecutionResult> {
    return this.execute({
      command: 'find',
      args: [knowledgeBasePath, '-type', 'f', '-name', '*.md'],
      timeout: 10000
    });
  }

  /**
   * Validate execution environment
   */
  async validateEnvironment(): Promise<ToolExecutionResult> {
    const checks = [
      { name: 'node', command: 'node', args: ['--version'] },
      { name: 'bun', command: 'bun', args: ['--version'] },
      { name: 'git', command: 'git', args: ['--version'] }
    ];

    const results: Record<string, any> = {};

    for (const check of checks) {
      const result = await this.execute({
        command: check.command,
        args: check.args,
        timeout: 3000
      });
      
      results[check.name] = {
        available: result.success,
        version: result.output?.trim()
      };
    }

    return {
      success: true,
      output: results,
      duration: 0
    };
  }

  /**
   * Clean up all processes
   */
  cleanup(): void {
    for (const [id, proc] of this.activeProcesses.entries()) {
      try {
        proc.kill();
        globalLogger.info('Cleaned up background process', { processId: id });
      } catch (error) {
        globalLogger.warn('Failed to cleanup process', { processId: id, error });
      }
    }
    this.activeProcesses.clear();
  }
}

// Export singleton instance
export const shellExecutor = new ShellExecutor();

// Cleanup on process exit
process.on('exit', () => shellExecutor.cleanup());
process.on('SIGINT', () => {
  shellExecutor.cleanup();
  process.exit();
});
