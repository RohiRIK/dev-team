# If Node Guide: Conditional Workflow Branching in n8n

**Author**: Manus AI
**Date**: October 20, 2025
**Keywords**: n8n, If node, conditional logic, workflow branching, data filtering, comparison operations, logical operators, data types

This document provides a comprehensive guide to the **If node** in n8n, a fundamental component for introducing conditional logic into your workflows. The If node enables the creation of branching paths, directing data down different routes based on whether specific conditions are met. This is crucial for building dynamic and intelligent automation sequences.

## 1. Overview and Purpose of the If Node

The If node is designed to split a workflow into two distinct output branches: a `true` branch and a `false` branch. Data items that satisfy the defined conditions proceed down the `true` branch, while those that do not meet the conditions proceed down the `false` branch. This mechanism facilitates dynamic decision-making within a workflow, allowing for different actions to be performed based on the characteristics of the incoming data [1].

## 2. Configuring Conditions in the If Node

To configure an If node, you define one or more comparison conditions. Each condition is composed of three main parts:

*   **Data Type**: Specifies the type of data being evaluated (e.g., String, Number, Date & Time, Boolean, Array, Object).
*   **Comparison Operation**: Selects the specific comparison to perform (e.g., `is equal to`, `is greater than`, `contains`, `is after`). The available operations are context-sensitive and vary depending on the chosen data type [1].
*   **Value**: The value against which the incoming data will be compared.

For instance, to filter for dates after a particular date, you would configure the condition as `Date & Time > is after > [specific date]`.

### 2.1. Combining Multiple Conditions with Logical Operators

When multiple conditions are added to an If node, they can be combined using logical operators to create more complex decision criteria:

*   **AND**: Data must satisfy *all* specified conditions to pass to the `true` branch. If even one condition is false, the data item will go to the `false` branch.
*   **OR**: Data must meet *any* of the specified conditions to pass to the `true` branch. If at least one condition is true, the data item will go to the `true` branch.

## 3. Comprehensive List of Data Type Comparisons

n8n's If node supports a wide array of comparison operations tailored to different data types, ensuring precise conditional logic:

### 3.1. String Comparisons

For string data types, available comparisons include: `exists`, `does not exist`, `is empty`, `is not empty`, `is equal to`, `is not equal to`, `contains`, `does not contain`, `starts with`, `does not start with`, `ends with`, `does not end with`, `matches regex`, and `does not match regex` [1].

### 3.2. Number Comparisons

Number data types can be compared using: `exists`, `does not exist`, `is empty`, `is not empty`, `is equal to`, `is not equal to`, `is greater than`, `is less than`, `is greater than or equal to`, and `is less than or equal to` [1].

### 3.3. Date & Time Comparisons

For Date & Time data types, the available comparisons are: `exists`, `does not exist`, `is empty`, `is not empty`, `is equal to`, `is not equal to`, `is after`, `is before`, `is after or equal to`, and `is before or equal to` [1].

### 3.4. Boolean Comparisons

Boolean data types support: `exists`, `does not exist`, `is empty`, `is not empty`, `is true`, `is false`, `is equal to`, and `is not equal to` [1].

### 3.5. Array Comparisons

Array data types can be compared using: `exists`, `does not exist`, `is empty`, `is not empty`, `contains`, `does not contain`, `length equal to`, `length not equal to`, `length greater than`, `length less than`, `length greater than or equal to`, and `length less than or equal to` [1].

### 3.6. Object Comparisons

Object data types support: `exists`, `does not exist`, `is empty`, and `is not empty` [1].

## 4. Understanding Branch Execution with If and Merge Nodes

Prior to n8n version 1.0, a specific behavior existed where adding a [Merge node](Node%20Reference/merge-node-guide.md) immediately after an If node could inadvertently cause both output data streams of the If node to execute, even if only one condition was met. This was because the Merge node would trigger the execution of the other data stream to gather all potential inputs. This behavior was addressed and removed in version 1.0. Consequently, modern workflows (n8n v1.0 and above) will execute branches as expected, with data flowing only down the path corresponding to the met conditions [1].

## 5. Related Resources and Advanced Conditional Logic

For scenarios requiring more advanced conditional logic, particularly when more than two conditional outputs are necessary, the [Switch node](Node%20Reference/switch-node-guide.md) is recommended as a more suitable alternative [1]. Further information on creating complex logic with conditionals can be found in the official n8n documentation on [Splitting with conditionals](https://docs.n8n.io/flow-logic/#splitting-with-conditionals) [1].

## References

[1] n8n Documentation: If Node. Available at: [https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/)

