# Commit Message Convention

Aether uses Conventional Commits (https://www.conventionalcommits.org).

## Format

<type>(<scope>): <short description>
[optional body]
[optional footer]

## Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes only
- `style`: Code style changes (formatting, missing semicolons, etc.) — no logic changes
- `refactor`: Code change that is neither a bug fix nor a new feature
- `perf`: Performance improvement
- `test`: Adding or correcting tests
- `build`: Changes to build system or external dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

## Scopes (use these exactly)

- `browser`: C++ browser layer changes
- `webui`: React/TypeScript UI changes
- `tabs`: Tab management
- `addressbar`: Address bar
- `sidebar`: Sidebar
- `newtab`: New tab page
- `settings`: Settings
- `ai`: AI service or AI panel
- `sync`: Sync infrastructure
- `extensions`: Extension system
- `android`: Android-specific changes
- `build`: Build system
- `docs`: Documentation
- `tools`: Developer tooling and scripts
- `deps`: Dependency updates

## Examples

feat(tabs): add tab sleeping after 30 minutes of inactivity
fix(addressbar): prevent duplicate history entries on redirect
docs(architecture): update browser core documentation for batch 09
build(webui): upgrade vite to 6.2.0
chore(deps): update pnpm to 9.4.0

## Rules

- Short description is imperative mood, lowercase, no period at the end.
- Body wraps at 72 characters.
- Footer references issues: `Closes #123` or `Refs #456`.
- Breaking changes include `BREAKING CHANGE:` in the footer.
