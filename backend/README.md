# Deploy Guide: Backend (FastAPI)

This guide covers deploying the Python FastAPI backend, which connects the Frontend to the Prompt Flow AI and Cosmos DB.

## Prerequisites

- Docker Desktop installed.
- Azure CLI installed.
- **Prompt Flow URL** ready.
- **Cosmos DB** Endpoint and Key ready.

## Step 1: Build & Push

### 1.1. Set Variables

```bash
ACR_NAME="civicchatbotdevacr001"
IMAGE_NAME="civic-chatbot-backend:v1"
```

### 1.2. Login & Build

```bash
az acr login --name $ACR_NAME

cd backend

# Build for Linux AMD64 (Required for Azure App Service)
docker build --platform linux/amd64 -t $ACR_NAME.azurecr.io/$IMAGE_NAME .
```

### 1.3. Push

```bash
docker push $ACR_NAME.azurecr.io/$IMAGE_NAME
```

## Step 2: Deploy & Configure Secrets

### 2.1. Create App Service

```bash
az webapp create \
  --resource-group civic-chatbot-rg \
  --plan civic-chatbot-dev-asp \
  --name civic-chatbot-backend-fastapi \
  --deployment-container-image-name $ACR_NAME.azurecr.io/$IMAGE_NAME
```

### 2.2. Configure Environment Variables (Secrets)

**Crucial:** Do not skip this. The application will fail if these are missing.

```bash
# Retrieve ACR Password
ACR_PASS=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# Set all secrets at once
az webapp config appsettings set \
  --resource-group civic-chatbot-rg \
  --name civic-chatbot-backend-fastapi \
  --settings \
  WEBSITES_PORT=8000 \
  DOCKER_REGISTRY_SERVER_URL="https://$ACR_NAME.azurecr.io" \
  DOCKER_REGISTRY_SERVER_USERNAME=$ACR_NAME \
  DOCKER_REGISTRY_SERVER_PASSWORD=$ACR_PASS \
  AZURE_COSMOS_ENDPOINT="<YOUR_COSMOS_DB_URL>" \
  AZURE_COSMOS_KEY="<YOUR_COSMOS_DB_MASTER_KEY>" \
  AUTH_SECRET_KEY="<GENERATE_A_STRONG_RANDOM_STRING>" \
  PF_ENDPOINT_URL="https://civic-flow-api.azurewebsites.net/score"
```

### 2.3. Verify

Access `https://civic-chatbot-backend-fastapi.azurewebsites.net/docs`. You should see the Swagger UI.
