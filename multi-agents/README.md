# Deploy Guide: Multi-Agents (Prompt Flow)

This guide covers deploying the Prompt Flow logic as a Docker container. This container requires the `boot.py` script to inject connections at runtime using environment variables.

## Prerequisites

- Docker Desktop installed.
- Azure CLI installed.
- **Azure OpenAI** Endpoint and Key.
- **Azure AI Search** Endpoint and Key.

## Step 1: Preparation

Ensure your `multi-agents/boot.py` reads from `os.environ` as detailed in the `SENSITIVE_DATA_MIGRATION.md` guide. **Delete** `connections.json` and `connection.yaml` to avoid leaking keys in the image.

## Step 2: Build & Push

### 2.1. Set Variables

```bash
ACR_NAME="civicchatbotdevacr001"
IMAGE_NAME="civic-flow-api:v1"
```

### 2.2. Login & Build

```bash
az acr login --name $ACR_NAME

cd multi-agents

# Build for Linux AMD64
docker build --platform linux/amd64 -t $ACR_NAME.azurecr.io/$IMAGE_NAME .
```

### 2.3. Push

```bash
docker push $ACR_NAME.azurecr.io/$IMAGE_NAME
```

## Step 3: Deploy to Azure App Service

### 3.1. Create App Service

```bash
az webapp create \
  --resource-group civic-chatbot-rg \
  --plan civic-chatbot-dev-asp \
  --name civic-flow-api \
  --deployment-container-image-name $ACR_NAME.azurecr.io/$IMAGE_NAME
```

### 3.2. Inject AI Keys (Critical)

The `boot.py` script will fail if these variables are not present.

```bash
ACR_PASS=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

az webapp config appsettings set \
  --resource-group civic-chatbot-rg \
  --name civic-flow-api \
  --settings \
  WEBSITES_PORT=8080 \
  DOCKER_REGISTRY_SERVER_URL="https://$ACR_NAME.azurecr.io" \
  DOCKER_REGISTRY_SERVER_USERNAME=$ACR_NAME \
  DOCKER_REGISTRY_SERVER_PASSWORD=$ACR_PASS \
  AZURE_OPENAI_API_KEY="<YOUR_OPENAI_KEY>" \
  AZURE_OPENAI_ENDPOINT="<YOUR_OPENAI_ENDPOINT>" \
  AZURE_SEARCH_KEY="<YOUR_SEARCH_KEY>" \
  AZURE_SEARCH_ENDPOINT="<YOUR_SEARCH_ENDPOINT>" \
  AZURE_SEARCH_INDEX="json-vetorizado" \
  AZURE_STORAGE_CONNECTION_STRING="<YOUR_STORAGE_CONN_STRING>"
```

## Step 4: Verification

Tail the logs to ensure `boot.py` successfully registered the connections.

```bash
az webapp log tail --name civic-flow-api --resource-group civic-chatbot-rg
```

_Success Indicator:_ Look for logs saying `>>> [BOOT] OpenAI OK!` and `Uvicorn running on http://0.0.0.0:8080`.
