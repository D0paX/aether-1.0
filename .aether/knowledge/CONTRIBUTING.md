# Aether Knowledge System — Contributing

This document explains how to add, update, or remove references from the
Aether knowledge system.

## Before You Contribute

1. Read [INDEX.md](INDEX.md) to understand the existing structure.
2. Verify the reference does not already exist in any category.
3. Determine the correct category for the reference.
4. Determine the priority level (primary, secondary, or supplementary).

## Adding a New Reference

### Step 1: Choose the Category

References must belong to exactly one category:

| Category | Directory | Use For |
|---|---|---|
| Design | `references/design/` | Visual design systems, guidelines, and resources |
| UI Libraries | `references/ui-libraries/` | Component frameworks and UI toolkits |
| Animation | `references/animation/` | Motion, transition, and animation systems |
| Browser | `references/browser/` | Browser engines, forks, and browser-specific source code |
| Product Design | `references/product-design/` | Products with exemplary UX and interaction design |
| Engineering | `references/engineering/` | Curated lists, developer tools, and engineering resources |

If no existing category fits, propose a new category in a pull request or prompt.

### Step 2: Create the Reference File

Create a new markdown file in the appropriate category directory.

File naming convention:
- Use lowercase with hyphens: `reference-name.md`
- Use the project's common name, not the legal name
- Examples: `shadcn-ui.md`, `framer-motion.md`, `chromium-source.md`

### Step 3: Use the Standard Template

Every reference file must follow this template:

```markdown
# Reference Name

- URL: https://example.com
- Category: category-name
- Relevance: One sentence explaining why this matters to Aether.
- Priority: primary | secondary | supplementary

## Description

Two to four sentences describing what this resource is and what it provides.

## Key Sections

A bulleted list of the most important sections, pages, or documents within
the resource that are relevant to Aether development.

## Usage Guidelines for Aether

Specific, actionable guidance on how this reference should inform Aether's
design or engineering decisions. Include what to adopt, what to adapt, and
what to explicitly avoid.
```

### Step 4: Update the Category Index

Add the new reference to the category's `INDEX.md` file. Maintain alphabetical
order within the reference list.

### Step 5: Update the Master Index

Update the reference count in the master [INDEX.md](INDEX.md) for the affected
category and the total count.

## Updating an Existing Reference

1. Update the reference file directly.
2. If the URL changed, verify the new URL is valid.
3. If the category changed, move the file and update both category indexes.
4. Update the master index if counts changed.

## Removing a Reference

1. Delete the reference file.
2. Remove the entry from the category index.
3. Update the master index count.
4. Document the reason for removal in the commit message.

## Adding a New Category

1. Create the directory under `references/`.
2. Create an `INDEX.md` inside the new directory following the existing format.
3. Add the category to the master index table.
4. Update this document's category table.

## Quality Checklist

Before submitting any reference change, verify:

- [ ] The URL is valid and loads correctly.
- [ ] The reference file follows the standard template exactly.
- [ ] The category index is updated.
- [ ] The master index counts are correct.
- [ ] The priority level is justified.
- [ ] The relevance statement is specific to Aether (not generic).
- [ ] No duplicate references exist in any other category.
