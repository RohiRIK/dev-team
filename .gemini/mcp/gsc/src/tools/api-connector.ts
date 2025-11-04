/**
 * Layer 6: Tools - API Connector
 * 
 * Connect to external APIs and services
 */

import type { ToolExecutionResult } from '../types.js';
import { globalLogger } from '../logging/index.js';

interface APIRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class APIConnector {
  private defaultTimeout: number = 30000;
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'GSC/1.0'
  };

  /**
   * Make an API request
   */
  async request(config: APIRequest): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    globalLogger.info('API request initiated', {
      url: config.url,
      method: config.method
    });

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
      }, config.timeout || this.defaultTimeout);

      const response = await fetch(config.url, {
        method: config.method,
        headers: { ...this.defaultHeaders, ...config.headers },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeout);

      const duration = Date.now() - startTime;
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const success = response.ok;

      globalLogger.info('API request completed', {
        url: config.url,
        method: config.method,
        status: response.status,
        duration,
        success
      });

      return {
        success,
        output: data,
        error: success ? undefined : `HTTP ${response.status}: ${response.statusText}`,
        duration,
        metadata: {
          status: response.status,
          statusText: response.statusText,
          contentType
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      globalLogger.error('API request failed', {
        url: config.url,
        method: config.method,
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
   * GET request
   */
  async get(url: string, headers?: Record<string, string>): Promise<ToolExecutionResult> {
    return this.request({ url, method: 'GET', headers });
  }

  /**
   * POST request
   */
  async post(url: string, body: any, headers?: Record<string, string>): Promise<ToolExecutionResult> {
    return this.request({ url, method: 'POST', body, headers });
  }

  /**
   * PUT request
   */
  async put(url: string, body: any, headers?: Record<string, string>): Promise<ToolExecutionResult> {
    return this.request({ url, method: 'PUT', body, headers });
  }

  /**
   * DELETE request
   */
  async delete(url: string, headers?: Record<string, string>): Promise<ToolExecutionResult> {
    return this.request({ url, method: 'DELETE', headers });
  }

  /**
   * PATCH request
   */
  async patch(url: string, body: any, headers?: Record<string, string>): Promise<ToolExecutionResult> {
    return this.request({ url, method: 'PATCH', body, headers });
  }

  /**
   * Call Microsoft Graph API (Intune)
   */
  async callGraphAPI(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    accessToken: string,
    body?: any
  ): Promise<ToolExecutionResult> {
    const url = `https://graph.microsoft.com/v1.0${endpoint}`;
    
    return this.request({
      url,
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body
    });
  }

  /**
   * Batch API requests
   */
  async batchRequest(requests: APIRequest[]): Promise<ToolExecutionResult[]> {
    globalLogger.info('Batch API request initiated', {
      count: requests.length
    });

    const results = await Promise.all(
      requests.map(req => this.request(req))
    );

    const successCount = results.filter(r => r.success).length;

    globalLogger.info('Batch API request completed', {
      total: requests.length,
      successful: successCount,
      failed: requests.length - successCount
    });

    return results;
  }

  /**
   * Set default timeout
   */
  setDefaultTimeout(timeoutMs: number): void {
    this.defaultTimeout = timeoutMs;
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }
}

// Export singleton instance
export const apiConnector = new APIConnector();
