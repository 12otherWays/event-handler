# Coding Rules

- Use async/await
- Prefer functional patterns
- Strong typing everywhere
- Avoid any
- Use inferred types where clean
- Keep functions small and composable

Never:
- add unnecessary abstractions
- generate dead code
- create unused variables/imports

# File Modification Rules

Only modify requested files/components.

Do not:
- refactor unrelated files
- rename unrelated code
- reformat entire repository

Prefer:
- minimal diffs
- targeted edits

# Generation Strategy

For large tasks:
1. analyze
2. infer architecture
3. build shared system
4. generate reusable components
5. generate feature modules
6. optimize

Never generate entire large applications in one step unless explicitly requested.
