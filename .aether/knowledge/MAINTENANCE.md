# Aether Knowledge System — Maintenance Strategy

This document defines the long-term maintenance plan for the Aether knowledge system.

## Maintenance Responsibilities

The knowledge system is maintained by:
- The project lead (final authority on additions and removals)
- AI agents (may propose changes but must not self-modify without instruction)
- Contributing developers (may submit changes following `CONTRIBUTING.md`)

## Periodic Review Schedule

| Frequency | Task |
|---|---|
| Monthly | Validate all URLs are reachable. Remove or update dead links. |
| Quarterly | Review relevance of each reference. Remove references that are no longer applicable. |
| Per batch | Before starting a new implementation batch, review which references are relevant. |
| Annually | Audit the full knowledge system for structural improvements. |

## Link Validation

All URLs in reference files must be validated periodically. A link is considered
dead if it returns a 404, 410, or connection timeout after three retries.

Validation process:
1. Extract all URLs from `references/**/*.md` files.
2. Test each URL with a HEAD request (fall back to GET if HEAD fails).
3. Report dead links with the file path and URL.
4. Fix or remove dead links within one week of detection.

## Adding New Categories

New categories should be added when:
- Three or more references would belong to the proposed category.
- The references do not fit naturally into any existing category.
- The category represents a distinct area of concern for Aether development.

New categories must not be added for:
- A single reference (file it under the closest existing category).
- Temporary or experimental references.
- References that overlap significantly with an existing category.

## Deprecating References

A reference should be deprecated when:
- The project or resource has been abandoned by its maintainers.
- The resource has been superseded by a better alternative.
- The reference is no longer relevant to Aether's current direction.

Deprecation process:
1. Add a deprecation notice at the top of the reference file.
2. Remove the reference from the category index.
3. Keep the file for 90 days to allow for reconsideration.
4. Delete the file after 90 days if no objection is raised.

## Scaling Strategy

This system is designed to scale over years of development. Key scaling mechanisms:

### Category Growth
- Categories can be added as the project evolves.
- Subcategories are not currently supported. If a category exceeds 15 references,
  consider splitting it into two categories with clear boundaries.

### Reference Growth
- There is no hard limit on the number of references.
- Quality over quantity: every reference must have a clear reason to exist.
- Aim for 5-15 references per category as a healthy range.

### Structural Changes
- The master index must always be the entry point.
- The reference file format must remain stable. Changes to the format require
  updating all existing reference files.
- New top-level documentation files (alongside INDEX.md, ONBOARDING.md, etc.)
  should be rare and must serve a distinct, non-overlapping purpose.

## Version History

| Date | Change |
|---|---|
| 2025-05-31 | Initial knowledge system created with 17 references across 6 categories. |
