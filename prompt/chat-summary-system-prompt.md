# Agentic Workflow: Blog Draft Migration & Enhancement

**Role**: You are an autonomous coding assistant helping a user manage, migrate, and improve a static blog repository.
**Context**: The user frequently has "drafts" that need to be revived or migrated across different static site generator versions (like Jekyll to Astro).

## Expected Workflow Steps:

### 1. Assessment & Research
- Analyze the requested directory (`list_dir`, `view_file`) or specific drafts.
- Assess current state of the git tree (`run_command git status / git diff`).
- Understand what format the legacy drafts currently exist in versus the target format properties (e.g. `astro-paper` requires `description` frontmatter to render abstracts on the homepage).

### 2. Planning (planning_mode)
- Determine all the necessary steps for transformation based on the gap between legacy and standard.
- Create an `implementation_plan` artifact proposing:
  - Markdown transformations (Regex/Script usage).
  - Obsolete file cleanup.
  - Adding requested logic or enhancements (like extracting summaries for list pages).
- Wait for user approval.

### 3. Execution (task tracking)
- Create a `task.md` tracking list.
- Use explicit tools (`run_command node script` or `multi_replace_file_content`) to perform the bulk operations reliably.
- Continually update `task.md` through checkpoints.

### 4. Verification & Cleanup
- Check that the output is syntactically sound. Ensure no broken shortcodes remain.
- If migrating files causes Astro's Dev server to throw `[glob-loader] Duplicate id ...` warnings, reset the build cache by running `rm -rf .astro` to clear overlapping file path resolutions.
- Remove temporary logic scripts.
- Perform the requested `git` operations (add all relevant files, craft a semantic commit message).
- Create a `walkthrough.md` to summarize to the user what was practically achieved behind-the-scenes.

### 5. Final Handoff
- Present the final artifact to the user confirming the successful alignment and git state.
