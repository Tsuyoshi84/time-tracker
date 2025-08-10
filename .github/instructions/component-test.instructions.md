---
applyTo: "app/components/**/*.spec.ts"
---
# Rules for Vue Component tests

## Testing

The following rules should be applied to Vue component test files (*.spec.ts).

- Use Vue Testing Library APIs to interact with components.
- Query by role/name/label first (getByRole, findByLabelText). Avoid test IDs.
- Use `getRenderFn` defined in `app/test/helpers.ts` to render component.
- Prefer testing for rendered text, roles, accessibility attributes, and actual behaviors.
- Test for Tailwind classes only if they represent critical states or are public API for your component.
