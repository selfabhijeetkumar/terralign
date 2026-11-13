---
prompt_id: "PRM-006"
phase: "Phase 0"
title: "TERRALIGN — Prompt Archive Initialization"
version: "1.0"
date: "2026-11-11T22:51:14+05:30"
ai_model: "Gemini 3.8 Flash (High)"
purpose: "Establish permanent, auditable Prompt Archive structure, index, and changelog, and archive exact historical prompts."
status: "Approved / In Execution"
file_path: "TERRALIGN-PROMPT-ARCHIVE/Phase-0/006-Prompt-Archive-Initialization.md"
---

# TERRALIGN — Prompt Archive Initialization

Act as a Senior Technical Documentation Engineer and Project Historian.

Before TERRALIGN Phase 1 begins, establish a permanent, organized and auditable Prompt Archive inside the existing project workspace.

Project root:
`C:\NASA SPACE HACKATHON`

## 1. Create the Prompt Archive

Create this directory structure:

TERRALIGN-PROMPT-ARCHIVE/
- Phase-0/
- Phase-1/
- Phase-2/
- Phase-3/
- Phase-4/
- PROMPT-INDEX.md
- PROMPT-CHANGELOG.md

Do not create unnecessary files or duplicate existing documentation.

## 2. Preserve Exact Prompts

The archive must preserve the exact prompts used throughout TERRALIGN development.

Important requirements:

- Save prompts in Markdown (.md) format.
- Preserve the original wording, instructions, sequence and technical details.
- Do not summarize or silently rewrite original prompts.
- Give each prompt a meaningful filename.
- Record the phase, prompt version, creation date, purpose, intended AI model and execution status.
- Maintain the original prompt separately from any revised version.
- Record changes between prompt versions in the changelog.

## 3. Phase 0 — Historical Prompts

Inspect the currently accessible project files and conversation context.

Identify existing Phase 0 prompts and setup instructions.

Save only prompts whose exact contents are available.

Do not fabricate missing prompts or reconstruct them from assumptions.

If a prompt is missing, create an entry in PROMPT-INDEX.md indicating that its original content needs to be recovered.

## 4. Phase 1 — Current Master Prompt

Save the complete TERRALIGN Phase 1 Master Prompt currently supplied by the user into:

`TERRALIGN-PROMPT-ARCHIVE/Phase-1/Phase-1-Master-Prompt.md`

Preserve it verbatim.

Do not replace it with a summary or shorter version.

If the exact prompt is unavailable in the accessible context, ask the user to provide it instead of creating an approximate version.

Future Phase 1 research, validation and refinement prompts must also be archived separately.

## 5. Future Phases

Prepare folders for:

- Phase 2 — Product Design and Architecture.
- Phase 3 — Application Development.
- Phase 4 — Testing, Optimization and Final Validation.

Do not invent future prompts.

Save them only when they are actually created and approved.

## 6. Prompt Index

Create PROMPT-INDEX.md containing:

| Field | Description |
|---|---|
| Prompt ID | Unique identifier |
| Phase | Phase 0, 1, 2, 3 or 4 |
| Prompt Name | Original prompt name |
| Version | Version number |
| Date | Creation date |
| AI Model | Model used |
| Purpose | Why the prompt was created |
| Status | Draft, Approved, Executed or Superseded |
| File Path | Exact archive location |

The index must provide a chronological, phase-wise history.

## 7. Prompt Changelog

Create PROMPT-CHANGELOG.md.

Record:
- New prompts.
- Revised prompts.
- Version changes.
- Reasons for changes.
- Approval status.
- Execution status.

Never overwrite historical versions.

## 8. Auditability and Security

This archive is intended to demonstrate TERRALIGN's development methodology and prompt-engineering journey to NASA Space Hackathon judges.

Therefore:

- Preserve original prompt text.
- Maintain chronological ordering.
- Maintain phase-wise organization.
- Preserve model and execution metadata.
- Never include API keys, passwords, access tokens or private credentials.
- Never fabricate execution history.
- Distinguish between a prompt being created, approved and actually executed.

## 9. Git and Project Safety

- Preserve all existing project files.
- Do not modify GSD configurations.
- Do not delete or move existing files.
- Do not stage files.
- Do not create a Git commit.
- Do not configure a GitHub remote.
- Do not modify the existing `.gitignore` unless necessary and approved.

## 10. Verification and Final Report

After creating the archive:

1. Show the complete folder tree.
2. List every prompt successfully archived.
3. Identify missing historical prompts.
4. Confirm the Phase 1 Master Prompt is preserved exactly.
5. Verify the index and changelog.
6. Report any unresolved issues.

Stop after completing and verifying the Prompt Archive.

**IMPORTANT: Do not execute TERRALIGN Phase 1, Phase 2 or any application development task during this operation. Wait for the user's confirmation before proceeding.**
