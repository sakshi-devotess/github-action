# Shared GitHub Workflow Action

This repository contains a reusable GitHub Workflow Action designed to simplify your CI/CD processes across multiple repositories. By centralizing the workflow logic here, you can maintain consistency and streamline updates.

## 🚀 Features

- **Centralized Workflows**: Manage CI/CD workflows across multiple repositories from a single location.
- **Reusable Logic**: Update your workflow logic once, and changes apply to all repositories using this action.
- **Customizable Inputs**: Supports customizable inputs to tailor workflows to specific repository needs.
- **Reduced Duplication**: Minimize duplicated YAML configuration by sharing workflows across multiple projects.

## 📂 Usage

To use this workflow in your project, reference it from your repository's `.github/workflows` directory.

### Example Workflow Usage

Below is an example of how to use this shared workflow in your repository:

```yaml
name: Example Workflow Using Shared Workflow

on:
  push:
    branches:
      - main

jobs:
  example-job:
    uses: your-organization/shared-workflow/.github/workflows/your-workflow.yml@v1
    with:
      input_variable_1: "value1"
      input_variable_2: "value2"
```

- **`uses`**: This key references the reusable workflow from this repository.
  - Replace `your-organization/shared-workflow` with the appropriate owner and repository name.
  - You can specify a branch, tag, or commit hash after `@` (e.g., `@v1`).

### Inputs

The shared workflow may support various inputs to allow customization:

| Input              | Description                               | Required | Default        |
| ------------------ | ----------------------------------------- | -------- | -------------- |
| `input_variable_1` | Description of the first input variable.  | Yes      | -              |
| `input_variable_2` | Description of the second input variable. | No       | `defaultValue` |

Specify the appropriate input values in your workflow file as needed.

## 📜 Pre-requisites

To use this workflow, ensure:

- Your repository has the necessary permissions to use workflows.
- The required secrets or environment variables are properly set up in your repository.

## 🛠️ Setup Instructions

1. **Add this Workflow to Your Repository**:

   - Create or update a workflow in your `.github/workflows` directory.
   - Reference the shared workflow action using the `uses` keyword, as shown in the example.

2. **Configure Inputs**:
   - If applicable, fill in any required input parameters to customize the behavior of the workflow.

## 🔑 Secrets and Permissions

To use this workflow, you may need to add certain secrets to your repository. These could include:

- **`GITHUB_TOKEN`**: Automatically provided by GitHub, but you may need other tokens for deployment or integration.
- **Environment Secrets**: For instance, deployment keys or API tokens for external services.

### Adding Secrets

To add a secret to your repository:

1. Go to your GitHub repository.
2. Click on `Settings` > `Secrets` > `Actions`.
3. Click `New repository secret`, then add the required secrets.

## 📝 Notes

- Ensure the referenced workflow version (`@v1`) points to the correct branch, tag, or commit that contains the desired workflow logic.
- You can create tags in this shared workflow repository to make versioning easier and to help track changes.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Make your changes and commit them.
4. Create a pull request describing your changes.

## 🐞 Troubleshooting

- **Permissions Issue**: Make sure your repository has access to run actions and any secrets required by the workflow.
- **Failed Workflow**: Check the workflow logs for detailed error messages and trace the issue. Ensure the input values and repository permissions are correct.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## 💬 Questions?

If you have any questions or run into issues, feel free to [open an issue](https://github.com/your-organization/shared-workflow/issues) in this repository.

---

This `README.md` file should give users clear guidance on how to use the shared workflow, handle inputs, manage secrets, and troubleshoot problems. Adapt the placeholders (`your-organization`, etc.) as needed for your specific action.
