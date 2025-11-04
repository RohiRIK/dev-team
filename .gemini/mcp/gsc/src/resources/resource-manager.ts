/**
 * Layer 1: Resources - Resource Manager
 * 
 * Unified access point for all resources (repos, configs, APIs, etc.)
 */

import { readFile } from 'fs/promises';
import type { ResourceManifest } from '../types.js';

export class ResourceManager {
  private resources: Map<string, ResourceManifest> = new Map();

  /**
   * Register a resource
   */
  registerResource(resource: ResourceManifest): void {
    this.resources.set(resource.id, resource);
  }

  /**
   * Get a resource by ID
   */
  getResource(id: string): ResourceManifest | undefined {
    return this.resources.get(id);
  }

  /**
   * Get all resources by type
   */
  getResourcesByType(type: ResourceManifest['type']): ResourceManifest[] {
    return Array.from(this.resources.values()).filter(r => r.type === type);
  }

  /**
   * Load a configuration file
   */
  async loadConfig(path: string): Promise<any> {
    try {
      const content = await readFile(path, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load config from ${path}: ${error}`);
    }
  }

  /**
   * Load a text resource
   */
  async loadText(path: string): Promise<string> {
    try {
      return await readFile(path, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to load text from ${path}: ${error}`);
    }
  }

  /**
   * Check if resource exists
   */
  hasResource(id: string): boolean {
    return this.resources.has(id);
  }

  /**
   * Get all resource IDs
   */
  getAllResourceIds(): string[] {
    return Array.from(this.resources.keys());
  }

  /**
   * Register default GEMINI resources
   */
  registerDefaultResources(): void {
    // Register default resources from config
    const defaultResources: ResourceManifest[] = [
      {
        id: 'repos:oncloud-best-practice',
        type: 'repository',
        path: 'repos/oncloud-best-practice/',
        metadata: { description: 'OnCloud best practices repository' }
      },
      {
        id: 'config:device-profiles',
        type: 'config',
        path: 'config/device_profiles.json',
        metadata: { description: 'Device profiles configuration' }
      },
      {
        id: 'api:intune-graph',
        type: 'api',
        path: 'api/intune/graph/v1.0/',
        metadata: { description: 'Microsoft Intune Graph API' }
      },
      {
        id: 'docs:security-policies',
        type: 'dataset',
        path: 'docs/security_policies/',
        metadata: { description: 'Security policies documentation' }
      }
    ];

    defaultResources.forEach(resource => this.registerResource(resource));
  }
}

// Export singleton instance
export const resourceManager = new ResourceManager();
resourceManager.registerDefaultResources();
