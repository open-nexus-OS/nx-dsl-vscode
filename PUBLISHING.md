# Publishing to the VS Code Marketplace

One-time setup (manual, needs a browser — this cannot be automated):

1. Create an Azure DevOps organization at https://dev.azure.com if you don't have one.
2. Go to https://marketplace.visualstudio.com/manage and create a **publisher** (choose an id, e.g. `your-publisher-id`).
3. In Azure DevOps, create a **Personal Access Token** (User settings → Personal access tokens) with:
   - Organization: "All accessible organizations"
   - Scope: **Marketplace → Manage**
4. Update `package.json`: set `"publisher"` to the publisher id you created.
5. In the GitHub repo settings (`Settings → Secrets and variables → Actions`), add a repository secret named `VSCE_PAT` with the token from step 3.

## Releasing a new version

```
npm version patch   # or minor / major
git push --follow-tags
```

Pushing a tag matching `v*` triggers `.github/workflows/publish.yml`, which builds and runs `vsce publish` using the `VSCE_PAT` secret.

## Publishing manually (without CI)

```
npx vsce login <publisher-id>
npx vsce publish
```
