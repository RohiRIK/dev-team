# Split Out Node Guide: Decomposing Data Items in n8n

**Author**: Manus AI
**Date**: October 20, 2025
**Keywords**: n8n, Split Out node, data decomposition, data transformation, array processing, list processing, workflow data, individual items

This document provides a comprehensive guide to the **Split Out node** in n8n, a powerful tool for transforming a single data item containing a list or array into multiple individual data items. This functionality is particularly useful when you need to process each element of a collection independently within your workflow, enabling granular control over data processing.

## 1. Overview and Purpose

The Split Out node is designed to take an array or list nested within a single data item and expand it into separate data items, one for each element in the list. For instance, if you receive a single item representing a customer order that contains a list of purchased products, the Split Out node can convert this into individual items, each representing a single product from that order. This allows subsequent nodes to operate on each product independently [1].

## 2. Configuration Parameters

Configure the Split Out node using the following key parameters:

### 2.1. Field to Split Out

Enter the name of the field that contains the list or array you wish to separate into individual items. This field typically holds a JSON array. If you are working with binary data inputs, you can use an expression like `$binary` to specify the field to split out [1].

### 2.2. Include

This parameter controls which other fields from the original input data are included with each newly created individual item. This is crucial for maintaining context for each split-out item. You can choose from the following options:

*   **No Other Fields**: Only the split-out items will be included in the output, without any other fields from the original input. This creates a very lean output, ideal when only the array elements are needed.
*   **All Other Fields**: All other fields from the original input item will be duplicated and included with each new individual item. This preserves all contextual information from the parent item for every child item.
*   **Selected Other Fields**: Only specific, chosen fields from the original input will be included with each new individual item. If you select this option, you will need to specify the `Fields to Include` as a comma-separated list, allowing for precise control over the data passed on [1].

## 3. Node Options

Additional options provide further customization for the Split Out node, allowing for fine-tuning of its behavior:

*   **Disable Dot Notation**: By default, n8n enables dot notation (e.g., `parent.child`) to reference child fields within JSON structures. You can disable this option if you prefer to treat field names containing dots as literal strings rather than nested structures [1].
*   **Destination Field Name**: Enter the name of the field in the output where the content of the split-out field should be placed. This allows you to rename the field containing the individual array elements in the output [1].
*   **Include Binary**: Determines whether binary data from the input should be included in the new output items. This is important if your workflow processes files or other binary assets that need to be associated with each split-out item [1].

## 4. Common Use Cases

The Split Out node is invaluable in various scenarios where granular processing of data collections is required:

*   **Processing List Items Individually**: When an API returns a list of records within a single response, and each record needs to be processed independently (e.g., sending individual emails, updating separate database entries, or performing specific actions per record).
*   **Iterating Over Collections**: Breaking down a collection of data (e.g., line items in an invoice, users in a group, tasks in a project list) to perform actions on each member, often followed by a loop or further conditional processing.
*   **Data Transformation**: Restructuring data from a consolidated format (e.g., a single JSON object with an array of sub-objects) into a granular, item-by-item format suitable for downstream nodes that expect individual items.
*   **Batch Processing Preparation**: Preparing data for batch processing by breaking down large datasets into smaller, manageable chunks that can be processed sequentially or in parallel.

## 5. Related Resources

To understand more about how data flows and is structured within n8n workflows, which is crucial for effectively using the Split Out node, refer to the official documentation on [data structure and data flow](https://docs.n8n.io/using-n8n/data-structure/) [1]. This will provide context on how arrays and objects are handled in n8n.

## References

[1] n8n Documentation: Split Out Node. Available at: [https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitout/](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitout/)

