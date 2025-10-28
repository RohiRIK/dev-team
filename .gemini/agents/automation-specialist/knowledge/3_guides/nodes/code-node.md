# Code Node Guide: Custom Logic with JavaScript and Python

**Author**: Manus AI
**Date**: October 20, 2025
**Keywords**: n8n, Code node, JavaScript, Python, custom code, data manipulation, workflow logic, AI-assisted code, Pyodide, native Python, external libraries, built-in methods

This document provides a comprehensive guide to utilizing the **Code node** in n8n, a powerful and versatile feature that enables the execution of custom JavaScript and Python code directly within a workflow. This capability is crucial for implementing advanced data manipulation, custom business logic, and integrating with services that may not have dedicated n8n nodes, thereby extending n8n's core functionalities.

## 1. Overview and Core Functionality

The Code node serves as a unified environment for custom code execution, having replaced the legacy `Function` and `Function Item` nodes from n8n version 0.198.0 onwards [1]. It is an indispensable tool for developers seeking to extend workflow capabilities beyond standard node offerings.

### 1.1. Execution Modes

The Code node offers two distinct execution modes, which dictate how it processes incoming data items:

*   **Run Once for All Items**: This is the default mode. The code within the node executes a single time, irrespective of the number of items received from the preceding node. This mode is ideal for tasks such as aggregating data, performing initial setup operations, or executing logic that does not require item-by-item application.
*   **Run Once for Each Item**: In this mode, the code executes individually for every incoming data item. This approach is best suited for item-wise transformations, applying conditional logic based on specific item data, or any operation that must be performed uniquely on each element within a collection.

### 1.2. Supported Programming Languages

The Code node supports two primary programming languages, offering flexibility to developers:

*   **JavaScript (Node.js)**: The Code node provides a robust Node.js environment, fully supporting modern JavaScript features, including Promises for asynchronous operations. Developers can use `console.log` for debugging, with output directed to the browser's console.
*   **Python**: n8n facilitates Python code execution through two methods:
    *   **Pyodide (Legacy)**: This method leverages Pyodide, a WebAssembly port of CPython, allowing Python code to run in a web environment. While functional, its performance is generally slower compared to native Python or JavaScript due to additional compilation steps. The range of available Python packages is limited to those bundled with Pyodide [1].
    *   **Native Python (Beta)**: Introduced in version 1.111.0, this feature utilizes task runners for native Python execution. It offers superior performance and supports a broader spectrum of standard and third-party Python modules. However, it presents some differences in syntax and available built-in methods compared to the Pyodide environment [1].

## 2. Advanced Features and Capabilities

### 2.1. Integration with External Libraries

The ability to incorporate external libraries significantly enhances the Code node's power:

*   **Self-Hosted n8n Instances**: Users hosting their own n8n instances benefit from the flexibility to import and utilize both built-in Node.js modules and external npm packages within the Code node. This expands integration possibilities to a vast ecosystem of libraries.
*   **n8n Cloud Environment**: For n8n Cloud users, the direct import of external npm modules is restricted due to security considerations. Nevertheless, n8n provides access to essential modules, including the `crypto` Node.js module and the `moment` npm package for comprehensive date and time manipulation [1].

### 2.2. Built-in Methods and Variables

n8n provides a rich set of built-in methods and variables designed to streamline common tasks and provide access to workflow data. These are typically accessed using the `$` prefix in JavaScript (e.g., `$items`, `$execution.id`) or the `_` prefix in Python (e.g., `_items`). These utilities are invaluable for:

*   Accessing data from preceding nodes in the workflow.
*   Retrieving contextual information about the current workflow and its execution.
*   Facilitating operations involving dates and times.

For a comprehensive list and detailed documentation, refer to the official n8n guide on [Built-in methods and variables](https://docs.n8n.io/code/built-in-methods-and-variables/) [1].

### 2.3. AI-Assisted Code Generation

For n8n Cloud users, the Code node integrates an AI assistant powered by ChatGPT. This feature can generate JavaScript code based on natural language prompts, offering a powerful starting point for custom logic development. It is important to note that using this feature will overwrite any existing code in the editor, making it most suitable for initial code creation or generating new snippets [1].

## 3. Common Use Cases and Best Practices

The Code node is a versatile tool with numerous applications:

*   **Custom Data Transformation**: It excels at complex data manipulation tasks that are challenging with standard nodes, such as parsing deeply nested JSON structures, dynamically restructuring data, or performing bespoke calculations.
*   **Simulating Node Outputs**: During the development and testing phases, the Code node can generate mock data that mimics the output of other nodes, enabling isolated testing of specific workflow components without requiring the full workflow to run.
*   **Advanced API Interactions**: While the [HTTP Request node](Node%20Reference/http-request-node-guide.md) is the primary tool for API interactions, the Code node can be used to construct highly complex API requests, manage custom authentication flows, or process API responses in a more sophisticated manner.
*   **Enhanced Error Handling and Debugging**: Developers can use `console.log` statements within the Code node to inspect data and debug logic effectively. Its ability to incorporate custom error handling logic also makes it a valuable asset for building resilient workflows.

## References

[1] n8n Documentation: Code Node. Available at: [https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)

