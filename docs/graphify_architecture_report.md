# Graphify Architecture & Evolution Report

## Overview
**Graphify** is a powerful, multimodal open-source AI coding assistant skill backed by a Python library. It parses codebases, documentation, research papers, images, and video/audio into a rich, queryable knowledge graph. Instead of just "grepping" through files, it helps developers and AI agents navigate code structurally by identifying components, "god nodes", community structures, and the rationale behind architectural decisions.

Instead of relying on embeddings and vector databases for semantic grouping, Graphify clusters data purely by graph topology using Leiden community detection.

## 1. Core Architecture
Graphify operates on a stateless, single-function pipeline structure. Each stage communicates via plain Python dictionaries and `NetworkX` graphs, with zero shared state and no side effects outside the `graphify-out/` artifact directory.

The pipeline stages:
`detect() → extract() → build_graph() → cluster() → analyze() → report() → export()`

### Module Breakdown
*   **`detect.py`**: Identifies and filters directories for supported file extensions, respecting `.graphifyignore`.
*   **`extract.py`**: Extracts nodes and edges from individual files. Code files are deterministically parsed using `tree-sitter` (AST). Semantic documents (docs, images, audio transcripts) leverage parallel AI subagents for concept/relationship extraction.
*   **`build.py`**: Assembles the individual file extraction dictionaries into a unified `NetworkX` computational graph.
*   **`cluster.py`**: Runs Leiden community detection (via `graspologic`) to identify related clusters of code/concepts based strictly on edge density (topology), without needing LLM embeddings.
*   **`analyze.py`**: Interrogates the graph to find "god nodes" (highly connected central concepts), calculate network centralities, trace cross-file rationale, and score "surprising connections."
*   **`report.py`**: Renders `GRAPH_REPORT.md` summarising the findings (god nodes, questions, graph metrics).
*   **`export.py`**: Exports the graph to various formats: interactive HTML (`vis.js`), `graph.json` state, `graph.svg`, or an Obsidian Vault.
*   **`serve.py`**: Mounts an MCP (Model Context Protocol) server over `graph.json` so agents can interact programmatically with the graph (e.g. `get_neighbors`, `shortest_path`).

## 2. Technology Stack Evolution

### Foundation (AST & Graph Base)
*   **Language**: Python 3.10+
*   **Parsing**: `tree-sitter` bindings for 25+ programming languages. Deterministic AST parsing extracts function definitions, classes, calls, imports, and inheritance without costing AI tokens.
*   **Graph Engine**: `NetworkX` to manipulate node/edge structures.
*   **Clustering**: `graspologic` for Leiden topological clustering.

### LLM Agent Abstraction (Cross-platform)
Graphify started as a *Claude Code* skill but was re-architected to be a universal utility. It implements platform-specific hook mechanisms (`PreToolUse`, `Always-on` config, `plugin` middleware) to forcefully remind AI models (Aider, OpenCode, Codex, Trae, Gemini CLI, Cursor, Antigravity) to read the `graphify-out/GRAPH_REPORT.md` before answering queries.
*   **Prompting Strategy**: Extracts `.md/.pdf/.png` by prompting models directly (via Anthropic/OpenAI/Gemini/etc. depending on the assistant) to trace relationships (`semantically_similar_to`, `rationale_for`).

### Multimedia & Async Tooling
*   **Video/Audio**: Added local transcription pipelines using `faster-whisper` and `yt-dlp`. Features a novel extraction pipeline: it first feeds the main text graph into a cheap LLM call to build a "domain-specific prompt" that primes Whisper's transcription, maximizing technical accuracy on local audio before graph conversion.
*   **Visualization**: Interactive HTML using `vis.js`, dynamically serving a canvas to explore components. `matplotlib` handles static SVGs.

## 3. Planning & Evolution Mechanics

Analyzing the changelog and codebase reveals the project's phased roadmap:

*   **Phase 1 - Parsing & Graphing (v0.1.0):** Establishing the deterministic AST pass. Introduced `tree-sitter`, basic clustering, and an MCP server.
*   **Phase 2 - Platform Omnipresence (v0.2.x - v0.3.0):** Shifting from merely a "Claude CLI tool" to a universally hooked plugin. Developed injection mechanisms for `Codex`, `OpenCode`, and `Aider`. Established the "extract generic" routing to handle 15+ languages via custom `LanguageConfig` dataclasses.
*   **Phase 3 - Multimodal Extensibility (v0.3.x):** Adding non-text corpus capability. Hooking into PDFs (via `pypdf`/`html2text`), Office documents (`python-docx`, `openpyxl`), and Vision models.
*   **Phase 4 - Advanced Tooling (v0.4.0+):** Full video/audio integration (`yt-dlp`), real-time file-system watching (`watchdog`) to rebuild local AST segments incrementally (via deep SHA256 caching), and advanced `git hook` integration to ensure graph parity at the commit level.

## 4. Key Architectural Decisions (The "Why")
1.  **Topology over Embeddings**: By mapping code deterministically and clustering by direct linkages, Graphify guarantees predictable groupings. Semantics are captured by LLM-injected `INFERRED` edges, which then naturally cluster using the standard topological algorithm.
2.  **Confidence Tagging**: Every edge is explicitly tagged `EXTRACTED` (literal AST call), `INFERRED` (deduced logic with a float confidence), or `AMBIGUOUS`. This keeps the agent from hallucinating structure.
3.  **Token Budgeting**: A key selling point of Graphify is reducing agent context-window usage. Once built, an agent queries the `graph.json` map (often 70x smaller) instead of globbing through a whole raw folder.
