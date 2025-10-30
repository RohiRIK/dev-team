# Terraform Tools

This document defines tools for interacting with Terraform.

## terraform_plan

Generates a Terraform execution plan.

**Parameters:**
- `directory`: The path to the directory containing the Terraform configuration files.
- `out`: (optional) The path to save the plan file.

**Example:**
`terraform_plan(directory: './infra', out: 'tfplan')`

## terraform_apply

Applies a Terraform execution plan.

**Parameters:**
- `directory`: The path to the directory containing the Terraform configuration files.
- `plan`: (optional) The path to a plan file to apply.

**Example:**
`terraform_apply(directory: './infra', plan: 'tfplan')`

## terraform_validate

Validates the Terraform configuration files.

**Parameters:**
- `directory`: The path to the directory containing the Terraform configuration files.

**Example:**
`terraform_validate(directory: './infra')`
