# Multi-Agent System Architecture

## Overview
This system consists of 24 specialized agents coordinated by Buddy, with 2 MCP servers for enhanced capabilities.

## Components

### 1. Agents (24)
- Each agent has specialized expertise
- Located in `agents/[agent-name]/`
- Loaded dynamically to save context

### 2. MCP Servers (2)
- `agent-loader`: Dynamic agent loading
- `fabric-integration`: AI pattern execution

### 3. Orchestration Layer
- Buddy (main orchestrator)
- Custom slash commands
- Settings configuration

## Data Flow
User → Buddy → Route to specialist OR handle directly → Execute with tools/MCP → Return result

## Context Management
- Only loads needed agents
- Uses MCP for dynamic content loading
- Prevents context overflow with 24 agents
