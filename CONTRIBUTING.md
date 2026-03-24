# Contributing Guidelines

Thank you for considering a contribution! Please follow these steps:

1. **Fork the repository** and create a new branch for your changes.
2. **Write clear commit messages** – use the imperative mood (e.g., `Add feature X`).
3. **Run existing tests** (if any) and add tests for new functionality.
4. **Open a Pull Request** targeting the `main` branch.
5. **Fill the PR template** – describe the problem, the solution, and any relevant screenshots.
6. **Address reviewer feedback** promptly.

### Code style
- Python: `flake8` and `black` (run via `make lint`).
- JavaScript/TypeScript: `eslint` and `prettier` (run via `npm run lint`).
- Keep the `strict` TypeScript setting (`noImplicitAny`, `strictNullChecks`).

### Documentation
- Update the `README` if the public interface changes.
- Add or update any relevant diagrams in the `docs/` folder.

### License
All contributions are covered under the repository’s MIT license.
