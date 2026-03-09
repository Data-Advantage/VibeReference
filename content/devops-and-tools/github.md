# GitHub

GitHub is the world's largest platform for version control and collaborative software development. It hosts Git repositories and adds features like pull requests, issues, actions (CI/CD), and project management tools. For AI-powered applications, GitHub is where you store code, manage deployments, and collaborate with others.

## Key Concepts

- **Repository**: A project folder tracked by Git, hosted on GitHub
- **Branch**: An isolated line of development for working on features or fixes
- **Pull Request (PR)**: A proposal to merge changes from one branch into another, with code review
- **Issues**: Bug reports, feature requests, and task tracking
- **Actions**: Automated workflows triggered by events like pushes or PRs

## Getting Started

### Create a Repository

```bash
# Initialize a new repo locally
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub and push
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

### Clone an Existing Repository

```bash
git clone https://github.com/owner/repo.git
cd repo
```

## Common Workflow

1. Create a branch for your feature: `git checkout -b feature/my-feature`
2. Make changes and commit: `git add . && git commit -m "Add feature"`
3. Push to GitHub: `git push -u origin feature/my-feature`
4. Open a Pull Request on GitHub for code review
5. Merge the PR after approval

## GitHub Actions

Automate testing, building, and deployment with workflow files:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

## Environment Variables and Secrets

Store API keys and sensitive data in GitHub Settings > Secrets and variables:

- **Repository secrets**: Available to GitHub Actions workflows
- **Environment secrets**: Scoped to specific deployment environments
- Never commit `.env` files or API keys to your repository

## Integrations

- **Vercel**: Automatic deployments from GitHub pushes
- **Netlify**: Alternative deployment platform with GitHub integration
- **Linear/Jira**: Link issues and PRs to project management tools
- **Dependabot**: Automated dependency updates via PRs

## Best Practices

- Write clear commit messages that explain the "why" not just the "what"
- Use branch protection rules to require PR reviews before merging
- Add a `.gitignore` file to exclude node_modules, .env, and build artifacts
- Keep PRs small and focused for easier review

## Resources

- [GitHub Documentation](https://docs.github.com)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
