# Merge Node Guide: Combining Data Streams in n8n

**Author**: Manus AI
**Date**: October 20, 2025
**Keywords**: n8n, Merge node, data combination, workflow branching, data aggregation, Append mode, Combine mode, SQL Query mode, Clash Handling, data synchronization

This document provides a comprehensive guide to the **Merge node** in n8n, a crucial tool for combining data from multiple input streams into a single, cohesive output. The Merge node ensures that all data from connected streams is available before proceeding, making it essential for workflows with branching logic or data aggregation requirements.

## 1. Overview and Purpose

The Merge node is designed to consolidate data from various paths within an n8n workflow. It functions as a synchronization point, waiting for data from all connected inputs to become available before processing. This is particularly useful after conditional branches (e.g., using an [If node](Node%20Reference/if-node-guide.md)) or when gathering data from parallel operations [1].

### 1.1. Version Changes and Enhancements

*   **n8n 0.194.0**: This version introduced a significant overhaul of the Merge node, and this guide reflects its latest functionality.
*   **n8n 1.49.0**: This update enhanced the Merge node by allowing more than two inputs, significantly increasing its flexibility. In older versions, combining multiple inputs beyond two typically required using the [Code node](Node%20Reference/code-node-guide.md) [1]. Additionally, the `Mode > SQL Query` feature was introduced in this version, offering advanced data manipulation capabilities.

## 2. Configuration Parameters: Merge Modes

The Merge node offers several distinct modes to specify how data from different streams should be combined:

### 2.1. Append Mode

In **Append** mode, data from all inputs is concatenated and outputted one after another. This mode simply streams the data sequentially, maintaining the order of the inputs. You can specify the `Number of Inputs` to ensure all expected streams are accounted for [1].

### 2.2. Combine Mode

The **Combine** mode is used to merge data from two inputs based on a specified criterion. It offers several `Combine By` options:

*   **Matching Fields**: This option compares items based on specified field values, similar to a database join operation. You define the `Fields to Match` in both inputs. The `Output Type` setting determines how matching and non-matching items are handled:
    *   `Keep Matches`: Functions like an inner join, outputting only items that match in both inputs.
    *   `Keep Non-Matches`: Merges items that do not match.
    *   `Keep Everything`: Acts like an outer join, merging matching items and including all non-matching items.
    *   `Enrich Input 1`: Similar to a left join, keeping all data from Input 1 and adding matching data from Input 2.
    *   `Enrich Input 2`: Similar to a right join, keeping all data from Input 2 and adding matching data from Input 1 [1].

*   **Position**: This combines items based on their sequential order (index). For example, the item at index 0 from Input 1 merges with the item at index 0 from Input 2, and so on [1].

*   **All Possible Combinations**: This mode generates every possible combination of items from the connected inputs, merging fields with the same name. This can lead to a significant increase in the number of output items and should be used judiciously [1].

#### 2.2.1. Combine Mode Options

When using Combine mode, additional options provide further control over the merging process:

*   **Clash Handling**: Determines how to resolve conflicts when fields with identical names exist in both input streams. By default, n8n prioritizes Input 2. Options include prioritizing a specific input or appending input numbers to field names to preserve all values [1].
    *   **Merging Nested Fields**: For complex data structures, you can choose between `Deep Merge` (merges properties at all levels) and `Shallow Merge` (merges only top-level properties) [1].
*   **Fuzzy Compare**: Allows n8n to tolerate type differences during field comparisons (e.g., treating "3" and 3 as equivalent) [1].
*   **Disable Dot Notation**: Prevents accessing child fields using `parent.child` in the field name [1].
*   **Multiple Matches**: Controls how n8n handles scenarios with multiple matches when comparing data streams. Options are `Include All Matches` or `Include First Match Only` [1].
*   **Include Any Unpaired Items**: Determines whether to keep or discard unpaired items when merging by position. By default, unpaired items are discarded [1].

### 2.3. SQL Query Mode

Introduced in n8n version 1.49.0, this advanced mode allows you to write a custom SQL query to merge data. Data from previous nodes are made available as virtual tables (e.g., `input1`, `input2`) within the SQL query environment. This provides unparalleled flexibility for complex data manipulation and joins [1].

### 2.4. Choose Branch Mode

This mode allows you to select which input stream to preserve (`The Input 1 Data` or `The Input 2 Data`) or to output `A Single, Empty Item`. This option always waits until data from both inputs is available before making a choice, ensuring data integrity [1].

## 3. Merging Data Streams with Uneven Item Counts

When merging data streams with an uneven number of items, the Merge node typically processes items based on the input with fewer items. For example, if Input 1 has five items and Input 2 has ten, only five items will be processed, with the remaining five from Input 2 being discarded, unless `Include Any Unpaired Items` is enabled in Combine mode [1].

## 4. Legacy Behavior: Branch Execution with If and Merge Nodes

In n8n versions 0.236.0 and below (legacy workflow execution order), adding a Merge node after an If node could inadvertently cause both output data streams of the If node to execute. This behavior was a side effect of how the Merge node previously handled input synchronization. This behavior was addressed and removed in n8n version 1.0. Consequently, modern workflows (n8n v1.0 and above) will execute branches as intended, with the Merge node only combining the data that explicitly flows into it [1].

## 5. Examples and Templates

The n8n documentation provides various templates and step-by-step examples demonstrating different Merge node configurations, including:

*   Merging data streams with uneven numbers of items.
*   Combining data by matching fields or position.
*   Utilizing the `Keep unpaired items` option for comprehensive data retention [1].

## References

[1] n8n Documentation: Merge Node. Available at: [https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/)

