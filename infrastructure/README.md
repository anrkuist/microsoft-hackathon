# Frontend Deployment Guide

Complete guide to deploy the Civic Chatbot frontend to Azure App Service using Azure Container Registry (ACR).

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- [GitHub CLI](https://cli.github.com/) installed (for automatic secrets setup)
- Azure subscription with appropriate permissions
- GitHub repository with Actions enabled

## Architecture

```
GitHub Actions → Build Docker Image → Push to ACR → Deploy to App Service
```

**Components:**

- **Azure Container Registry (ACR):** Stores Docker images
- **Managed Identity:** Authenticates App Service to pull from ACR
- **App Service (Linux):** Hosts the Next.js container
- **Application Insights:** Monitoring and telemetry

## Deployment Steps

### 1. Login to Azure

```bash
az login
az account set --subscription 8fbef766-67cd-462d-850c-24ea6fa798f4
```

### 2. Deploy Infrastructure with Bicep

```bash
cd infrastructure

# Deploy all resources
az deployment group create \
  --resource-group civic-chatbot-rg \
  --template-file main.bicep \
  --parameters location=canadacentral
```

**What gets created:**

- Azure Container Registry (`civicchatbotdevacr001`)
- Managed Identity with AcrPull permissions
- App Service Plan (Basic B1)
- App Service - Staging (`civic-chatbot-dev-staging`)
- App Service - Production (`civic-chatbot-dev-prod`)
- Application Insights

> **Note on Managed Identity:** The Bicep template automatically configures the App Service to use the created User-Assigned Managed Identity to pull images from ACR. It sets `acrUseManagedIdentityCreds: true` and `DOCKER_REGISTRY_SERVER_USERNAME` to the identity's Client ID. No manual configuration is required in the Azure Portal.

### 3. Export Deployment Outputs

```bash
./scripts/export-azure-outputs.sh
```

This creates `infrastructure/azure-outputs.json` with all resource details.

### 4. Configure GitHub Secrets

#### Option A: Automatic Setup (Recommended)

```bash
# Login to GitHub CLI
gh auth login

# Run the automated setup script
./scripts/setup-github-secrets.sh -r anrkuist/civic-chatbot-dev -e staging
```

#### Option B: Manual Setup

Create a Service Principal:

```bash
az ad sp create-for-rbac \
  --name "civic-chatbot-github-sp" \
  --role contributor \
  --scopes /subscriptions/8fbef766-67cd-462d-850c-24ea6fa798f4/resourceGroups/civic-chatbot-rg \
  --sdk-auth
```

Copy the entire JSON output and set these secrets in GitHub:

**Repository Settings → Secrets and variables → Actions → Environments → staging**

| Secret Name                 | Value                                       |
| --------------------------- | ------------------------------------------- |
| `AZURE_SP`                  | Service Principal JSON (from command above) |
| `ACR_NAME`                  | `civicchatbotdevacr001`                     |
| `ACR_LOGIN_SERVER`          | `civicchatbotdevacr001.azurecr.io`          |
| `AZURE_APP_SERVICE_BACKEND` | `civic-chatbot-dev-staging`                 |
| `AZURE_RESOURCE_GROUP`      | `civic-chatbot-rg`                          |
| `AZURE_DEPLOYMENT_NAME`     | `main`                                      |

### 5. Deploy via GitHub Actions

Push to the `develop` branch to trigger automatic deployment:

```bash
git add .
git commit -m "feat: Setup Azure deployment"
git push origin develop
```

The workflow (`.github/workflows/front_staging_deploy.yml`) will:

1. Build the Docker image with correct context (`./frontend`)
2. Push to ACR
3. Deploy to App Service
4. ACR webhook triggers automatic pull

### 6. Verify Deployment

```bash
# Check App Service status
az webapp show \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg \
  --query state -o tsv

# View logs
az webapp log tail \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg

# Open in browser
open https://civic-chatbot-dev-staging.azurewebsites.net
```

## Troubleshooting

### Issue: "Failed to pull image - unauthorized"

**Cause:** App Service cannot authenticate to ACR.

**Fix:**

```bash
# Ensure Managed Identity is configured
az webapp config set \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg \
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'

# Restart the app
az webapp restart \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg
```

### Issue: "Container image is 0 bytes"

**Cause:** Docker build context was incorrect.

**Fix:** Ensure GitHub Actions workflow uses `./frontend` as build context:

```yaml
docker build --push -t ${{ secrets.ACR_LOGIN_SERVER }}/civic-chatbot-frontend:latest ./frontend
```

### Issue: "Container fails to start"

**Check logs:**

```bash
az webapp log tail \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg
```

**Common causes:**

- Missing environment variables
- Port mismatch (ensure container exposes port 3000)
- Application errors during startup

### Issue: Deployment succeeds but app doesn't update

**Force pull latest image:**

```bash
az webapp config container set \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg \
  --docker-custom-image-name civicchatbotdevacr001.azurecr.io/civic-chatbot-frontend:latest

az webapp restart \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg
```

## Manual Deployment (Alternative)

If you prefer to deploy without GitHub Actions:

```bash
# Build and push manually
cd frontend
az acr build \
  --registry civicchatbotdevacr001 \
  --image civic-chatbot-frontend:latest \
  .

# Update App Service
az webapp config container set \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg \
  --docker-custom-image-name civicchatbotdevacr001.azurecr.io/civic-chatbot-frontend:latest

# Restart
az webapp restart \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg
```

## Security Notes

- **Never enable ACR admin user** - Use Managed Identity instead
- Service Principal credentials are stored as GitHub secrets
- App Service uses User-Assigned Managed Identity with AcrPull role
- All connections use HTTPS/TLS 1.2+

## Monitoring

View logs and metrics in Azure Portal:

- **Application Insights:** Real-time monitoring
- **App Service Logs:** Container and application logs
- **ACR Tasks:** Build history and logs

```bash
# Stream logs
az webapp log tail \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg

# Download logs
az webapp log download \
  --name civic-chatbot-dev-staging \
  --resource-group civic-chatbot-rg \
  --log-file logs.zip
```

## Cleanup

To remove all resources:

```bash
# Delete resource group (removes everything)
az group delete --name civic-chatbot-rg --yes --no-wait

# Or delete Service Principal only
az ad sp delete --id $(az ad sp list --display-name civic-chatbot-github-sp --query "[0].appId" -o tsv)
```

## Additional Resources

- [Azure Container Registry documentation](https://docs.microsoft.com/en-us/azure/container-registry/)
- [App Service for Containers](https://docs.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [Managed Identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)
- [GitHub Actions for Azure](https://docs.microsoft.com/en-us/azure/developer/github/github-actions)

## Support

For issues or questions, check:

- GitHub Actions workflow logs
- Azure Portal → App Service → Diagnose and solve problems
- Application Insights → Live Metrics
