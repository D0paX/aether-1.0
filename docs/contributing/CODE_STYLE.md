# Code Style Guide

## General Rules (apply to all languages)

- No emojis anywhere: not in code, not in comments, not in strings, not in documentation.
- No placeholder code. Never write `// TODO: implement` in production code. Either implement it or do not merge it.
- File header comment required on every new file: one line describing the file's purpose and its location in the architecture.
- Maximum line length: 100 characters for TypeScript and Rust. 80 characters for C++ (Chromium standard).
- Every function longer than 30 lines must have a comment explaining what it does, its parameters, and its return value.

## TypeScript and React

Follows the Chromium WebUI TypeScript style plus React best practices.

**Naming:**
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities and hooks
- Components: PascalCase (`TabBar`, `AddressBar`)
- Hooks: camelCase starting with `use` (`useTabs`, `useNavigation`)
- Store slices: camelCase ending with `Store` (`tabsStore`, `settingsStore`)
- Constants: UPPER_SNAKE_CASE for module-level constants
- Types and interfaces: PascalCase, prefix interfaces with `I` only when needed to disambiguate from a class

**TypeScript:**
- Strict mode required. `tsconfig.json` must have `"strict": true`.
- No `any` type. If you must escape the type system, use `unknown` and cast with a comment explaining why.
- Prefer `type` over `interface` for object shapes. Use `interface` only for things intended to be extended.
- Explicit return types on all exported functions.
- All React component props must be typed with a dedicated type at the top of the file.

**React:**
- Functional components only. No class components.
- All state via hooks (useState, useReducer) or Zustand.
- No prop drilling past two levels — use Zustand store or React context.
- No inline styles. All design values come from CSS custom properties defined in `src/webui/src/styles/tokens.css`.
- Components must be single-purpose. If a component exceeds 150 lines, split it.
- Event handler naming: `handle` prefix (`handleClick`, `handleKeyDown`).

**Imports:**
Order imports in this exact sequence, separated by blank lines:
1. React and React ecosystem (react, react-dom)
2. Third-party libraries (framer-motion, zustand, lucide-react)
3. Internal absolute imports (`@aether/...`)
4. Relative imports (`./`, `../`)
5. Type-only imports last (`import type { ... }`)

## C++ (Chromium Modifications)

Follows the Chromium C++ style guide exactly.

**Style:**
- 2-space indentation (not 4, not tabs).
- Opening brace on same line for functions and classes.
- Google C++ Style Guide: https://google.github.io/styleguide/cppguide.html
- Chromium-specific additions: https://chromium.googlesource.com/chromium/src/+/main/styleguide/c++/c++.md

**Naming:**
- Classes: PascalCase (`AetherTabManager`)
- Methods: PascalCase (`CreateNewTab`, `CloseTab`)
- Variables: snake_case (`tab_id`, `navigation_controller`)
- Constants: kPascalCase (`kMaxTabCount`)
- Enums: PascalCase members (`TabState::kActive`)

**Important Chromium C++ rules:**
- Never use raw `new` or `delete`. Use smart pointers: `std::unique_ptr`, `std::shared_ptr`, `base::WeakPtr`.
- Never use `std::string` for UTF-8 text in Chromium. Use `std::u16string` or `base::string16`.
- All IPC message handlers must validate every parameter before using it.
- Never access UI from a non-UI thread.
- Prefer `DCHECK` over `assert`. Use `CHECK` for conditions that must hold in production.

## Rust

Follows standard Rust idioms with Aether-specific additions.

**Style:**
- `rustfmt` is required. All Rust files must be formatted with `rustfmt` before commit.
- `clippy` is required. Zero clippy warnings allowed.
- 4-space indentation (Rust standard).

**Naming:**
- Structs and enums: PascalCase
- Functions, methods, variables: snake_case
- Constants: UPPER_SNAKE_CASE
- Modules: snake_case
- Traits: PascalCase

**Error handling:**
- Never use `unwrap()` in production code. Use `?` operator or explicit match.
- Custom error types must implement `std::error::Error`.
- Use `thiserror` for defining error types.
- Use `anyhow` for error propagation in binary crates (ai-service, sync-service).

**Async:**
- All async code uses Tokio runtime.
- All async functions must be named clearly to indicate they are async (or it must be obvious from context).
- Never block the Tokio thread pool with synchronous I/O. Use `tokio::task::spawn_blocking` for blocking operations.
