---
applyTo: "**/*.ts,app/**/*.vue"
---
# Rules for TypeScript

This rule provides standards for TypeScript.
Apply these rules when writing TypeScript files or Vue component setup functions.

## TypeScript

- Prefer function declarations over function expressions. However, when passing a function to a parameter, prefer using a function expression.
- Define function return types for better readability and type safety.
- Prefer `interface` over `type` when defining object types.
- Use literal union types over enums.
- Use `unknown` over `any`.
- Prefer `undefined` over `null` unless `null` has to be used.
- Prefer `for...of` statement over `forEach`. However, allow use of `forEach` when chaining.
- Avoid non-null assertion operator (`!`) unless absolutely sure the value cannot be `null` or `undefined`.
- Put `as const` on constant objects.
- Prefer the guard clause (early return) when the rest of the function can be skipped after the return.
- If you need to keep the original array unchanged, prefer using the new immutable Array APIs such as `toSorted`, `toReversed`, and `toSpliced`.
- Do not rely on Nuxt auto-import system. Import files explicitly.
- Put .ts extension when importing TypeScript file.
- Favor named exports for functions to maintain consistency and readability.
- When using Vue Apollo Client composables, use aliases by combining the original variable name with the query name. For example:

```ts
const { load: loadEvents, loading: loadingEvents, result: resultEvents } = useListEventsQuery()
```

## Code Style and Structure

- Write clean, maintainable, and technically accurate TypeScript code.
- Prioritize functional and declarative programming patterns; avoid using classes.
- Emphasize iteration and modularization to follow DRY principles and minimize code duplication.
- Use tabs for indentation.
- **Use guard clauses (early returns) to improve code readability and reduce nesting.**
  - Return early when specific conditions are not met, avoiding deep nesting.
  - Use guard clauses when processing after a certain point is only executed if specific conditions are met.
  - This pattern helps flatten code structure and makes it easier to read and maintain.

## Documents

- Write JSDoc comments for all exported functions, variables, and types for better readability and understanding.
- In JSDoc, `@return` annotation can be omitted since it's self-explanatory in most cases.
- Document complex functions with clear examples.
- Use Japanese for JSDoc comments.
- Don't use 丁寧語 (です, ます) in JSDoc comments.

## Naming Conventions

- Use UPPER_CASE for constants.
- Use upper case for acronyms. For example, name `getURL` instead of `getUrl`.
- Use **PascalCase** for component file names (e.g., `components/MyComponent.vue`).
- Use 'Map' as a suffix for all variables, parameters, and properties whose value is a Map instance. For example, `const userMap = new Map<string, User>()`. This rule must be applied to ref objects too.
- Use 'Set' as a suffix for all variables, parameters, and properties whose value is a Set instance. For example, `const userIdSet = new Set<string>()`. This rule must be applied to ref objects too.
- **Be descriptive but concise**: Choose names that clearly describe the purpose without being overly verbose.
- **Avoid abbreviations**: Use full words instead of abbreviations (e.g., `userProfile` instead of `usrProf`).
- **Use domain terminology**: Use terms that are familiar to the business domain and stakeholders.
- **Be consistent**: Use the same naming patterns throughout the codebase.
- **Avoid reserved words**: Don't use JavaScript/TypeScript reserved words as identifiers.
- **Consider context**: Names should make sense in the context where they're used.
- **Inconsistent casing**: Stick to the established casing conventions.
- **Overly long names**: While descriptive names are good, extremely long names can reduce readability.
- **Temporary names**: Don't use placeholder names like `temp`, `foo`, `bar` in production code.

## Nuxt

Follow these instructions when writing composables or component setup functions.

- Take advantage of VueUse functions to enhance reactivity and performance.
- Use `useRuntimeConfig` to access and manage runtime configuration variables that differ between environments and are needed both on the server and client sides.
- Pass an object to `navigateTo` for better type safety. For example, `navigateTo({ name: 'about' })` instead of `navigateTo('/about')`.
- Use `import.meta.client` or `import.meta.server` to check if the current context is client-side or server-side.

## Error handling

- Implement error boundaries for component error handling
- Use try-catch blocks for async operations
- Log errors appropriately for debugging
- When catching an error and throwing a new Error, set the original error to the `cause` property
