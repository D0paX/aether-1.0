# Awesome React Components

- URL: https://github.com/brillout/awesome-react-components
- Category: engineering
- Relevance: Categorized directory of React components for discovering solutions to specific UI implementation challenges.
- Priority: supplementary

## Description

Awesome React Components is a curated list of React components organized by category.
Unlike Awesome React (which covers the full ecosystem), this list focuses specifically
on UI components: tables, forms, charts, editors, drag-and-drop, modals, tooltips,
notifications, and dozens of other categories.

## Key Sections

- UI components: Buttons, inputs, selects, sliders, toggles, date pickers
- Layout: Grids, split panes, resizable panels, sticky elements
- Data display: Tables, trees, timelines, calendars, charts
- Navigation: Menus, breadcrumbs, tabs, pagination, scrollbars
- Overlay: Modals, dialogs, tooltips, popovers, notifications
- Media: Image viewers, video players, audio players, carousels
- Form: Form libraries, validation, rich text editors, code editors
- Developer tools: Debugging, profiling, storybook integrations

## Usage Guidelines for Aether

**Use as reference for:**
- Implementation research: When building a specific component type (e.g., a resizable
  panel, a virtualized list, a rich text editor), check this list for existing
  implementations to study their APIs and approaches
- API design: Study how popular components in each category structure their props,
  events, and composition patterns
- Accessibility patterns: Review how well-regarded components handle keyboard
  navigation, ARIA attributes, and screen reader support

**Do not adopt:**
- Components as direct dependencies without explicit architectural review
- Components that conflict with Aether's styling approach (vanilla CSS + custom properties)
- Components with large dependency trees that would bloat the build
- Components that have not been updated in over 12 months (maintenance risk)
