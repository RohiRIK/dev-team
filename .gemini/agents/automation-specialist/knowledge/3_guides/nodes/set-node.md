# Edit Fields (Set) Node Guide: Data Manipulation in n8n

**Author**: Manus AI
**Date**: October 20, 2025
**Keywords**: n8n, Edit Fields node, Set node, data manipulation, data transformation, workflow data, JSON, manual mapping, data normalization, AI optimization

This document provides a comprehensive guide to the **Edit Fields (Set) node** in n8n, a fundamental tool for manipulating workflow data. This node allows you to set new data, overwrite existing data, and restructure information, making it crucial for preparing data for subsequent nodes, external services, or API integrations.

## 1. Overview and Purpose

The Edit Fields node, often referred to as the Set node, is designed to modify the data items flowing through an n8n workflow. It is particularly useful for tasks such as data normalization, enrichment, and restructuring. This node is critical in workflows that expect incoming data from previous nodes, such as when inserting values into Google Sheets or databases, or when preparing payloads for APIs [1].

## 2. Node Parameters

These are the primary settings and options available in the Edit Fields (Set) node:

### 2.1. Mode

You can configure the node using one of two primary modes:

*   **Manual Mapping**: This mode allows you to edit fields using a graphical user interface (GUI). You can drag and drop values from previous nodes, define new field names, and set their values directly.
*   **JSON Output**: This mode allows you to define the output data structure by writing a JSON object. n8n will then merge this JSON object with the incoming data. This provides greater flexibility for complex data structures and dynamic content generation [1].

### 2.2. Fields to Set

If you select **Mode** > **Manual Mapping**, you can configure the fields by dragging and dropping values from the **INPUT** panel. The default behavior when you drag a value is:

*   n8n sets the value's name as the field name.
*   The field value contains an expression which accesses the value.

If you prefer not to use expressions, you can hover over a field, and n8n will display a **Fixed | Expressions** toggle. Selecting **Fixed** allows you to input a static value. This can be done for both the name and value of the field [1].

### 2.3. Keep Only Set Fields

Enabling this option instructs the node to discard any input data that is not explicitly used or defined in the **Fields to Set**. This is highly useful for data cleansing, reducing payload size, and optimizing the data passed between nodes, which can improve workflow performance [1].

### 2.4. Include in Output

This parameter controls which input data is included in the node's output. Options typically include:

*   **All Input Fields**: Includes all original input fields along with the newly set or modified fields.
*   **Only Set Fields**: Only outputs the fields that were explicitly set or modified by the node, discarding all other input fields. This is particularly useful for creating clean, specific output structures [1].

## 3. Node Options

Additional options provide further customization for the Edit Fields (Set) node:

*   **Include Binary Data**: Determines whether binary data from the input should be included in the output. This is important when dealing with files or images [1].
*   **Ignore Type Conversion Errors**: (Manual Mapping only) When enabled, n8n will ignore certain data type errors during field mapping, allowing for more flexible data handling. Use with caution, as it can lead to unexpected data types [1].
*   **Support Dot Notation**: By default, n8n supports dot notation (e.g., `parent.child`) for defining nested fields. This option can be toggled off if this behavior is not desired, in which case `number.one` would be treated as a single field name rather than a nested structure [1].

## 4. Common Use Cases

The Edit Fields (Set) node is highly versatile and used in numerous scenarios:

*   **Data Normalization**: Standardizing field names or values across disparate data sources to ensure consistency.
*   **Data Enrichment**: Adding new calculated fields, static values, or data from other sources to incoming data items.
*   **Preparing Data for APIs**: Restructuring data to precisely match the payload requirements of an external API, ensuring successful integration.
*   **Creating API Endpoints**: When used with a [Webhook node](Node%20Reference/webhook-node-guide.md), the JSON Output mode can define the exact response structure for a custom API endpoint within n8n.
*   **Filtering and Selecting Data**: In conjunction with the `Keep Only Set Fields` option, it can act as a data filter, passing only relevant information to subsequent nodes.

## 5. Error Handling and Performance Considerations

*   **Type Conversion Errors**: If `Ignore Type Conversion Errors` is not enabled, mismatches in data types during manual mapping can lead to workflow failures. Ensure data types are compatible or use expressions for explicit conversion.
*   **Incorrect JSON Structure**: In JSON Output mode, malformed JSON or incorrect expressions will cause the node to fail. Always validate JSON syntax and expression logic carefully.
*   **Complexity of JSON Output**: Highly complex JSON structures or extensive use of expressions in JSON Output mode can impact workflow performance. Optimize expressions and simplify structures where possible to maintain efficiency.
*   **Keeping Only Set Fields**: Utilizing this option can significantly improve performance by reducing the amount of data processed by subsequent nodes, especially when dealing with large datasets.

## 6. Integration Examples

*   **Google Sheets**: Formatting data before writing to Google Sheets, ensuring column names and data types match the sheet's structure.
*   **Database Operations**: Preparing records for insertion or update in a database, mapping workflow data to specific table columns.
*   **Email Personalization**: Adding personalized fields (e.g., `firstName`, `lastName`) to email templates before sending via an email node to enhance recipient engagement.

## References

[1] n8n Documentation: Edit Fields (Set) Node. Available at: [https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/)

