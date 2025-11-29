# Deploy Guide: Azure AI Foundry & Models

This guide details how to provision the core AI infrastructure required for the Chatbot: **Azure AI Foundry (Hub & Project)**, **Azure OpenAI**, and **Azure AI Search**.

## Prerequisites

1.  **Azure CLI** installed and logged in (`az login`).
2.  **Subscription Selected** (`az account set -s <SUBSCRIPTION_ID>`).
3.  **Resource Group Created**:
    ```bash
    az group create --name civic-chatbot-rg --location eastus2
    ```
    _(Note: We recommend `eastus2`, `swedencentral`, or `westus3` for better model availability)._

---

## 1. Infrastructure as Code (Bicep)

Create a file named `ai-foundry.bicep` inside your `infrastructure` folder. This script automates the creation of all dependent resources (Storage, Key Vault, AI Services).

**File:** `infrastructure/ai-foundry.bicep`

```bicep
@description('Azure Region')
param location string = resourceGroup().location

@description('Prefix for resource names')
param prefix string = 'civic-chatbot'

// --- 1. Dependencies (Storage, Key Vault, App Insights) ---

resource storage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: '${replace(prefix, '-', '')}sto${uniqueString(resourceGroup().id)}'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: '${prefix}-kv-${uniqueString(resourceGroup().id)}'
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: { family: 'A', name: 'standard' }
    accessPolicies: []
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${prefix}-ai'
  location: location
  kind: 'web'
  properties: { Application_Type: 'web' }
}

// --- 2. Azure AI Services (OpenAI) ---

resource openai 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: '${prefix}-openai'
  location: location
  kind: 'OpenAI'
  sku: { name: 'S0' }
  properties: {
    customSubDomainName: '${prefix}-openai-${uniqueString(resourceGroup().id)}'
    publicNetworkAccess: 'Enabled'
  }
}

// --- 3. Azure AI Search ---

resource search 'Microsoft.Search/searchServices@2023-11-01' = {
  name: '${prefix}-search'
  location: location
  sku: { name: 'basic' } // Basic is required for Semantic Search/Vector features
  properties: {
    replicaCount: 1
    partitionCount: 1
  }
}

// --- 4. Azure AI Foundry (Hub & Project) ---

resource aiHub 'Microsoft.MachineLearningServices/workspaces@2023-08-01-preview' = {
  name: '${prefix}-hub'
  location: location
  kind: 'Hub'
  sku: { name: 'Basic', tier: 'Basic' }
  identity: { type: 'SystemAssigned' }
  properties: {
    friendlyName: 'Civic Chatbot Hub'
    storageAccount: storage.id
    keyVault: keyVault.id
    applicationInsights: appInsights.id
  }
}

resource aiProject 'Microsoft.MachineLearningServices/workspaces@2023-08-01-preview' = {
  name: '${prefix}-project'
  location: location
  kind: 'Project'
  sku: { name: 'Basic', tier: 'Basic' }
  identity: { type: 'SystemAssigned' }
  properties: {
    friendlyName: 'Civic Chatbot Project'
    hubResourceId: aiHub.id
  }
}

// --- 5. Connections (Link OpenAI/Search to the Hub) ---

resource openaiConnection 'Microsoft.MachineLearningServices/workspaces/connections@2024-04-01-preview' = {
  parent: aiHub
  name: 'aoai-connection'
  properties: {
    category: 'AzureOpenAI'
    target: openai.properties.endpoint
    authType: 'AAD'
    isSharedToAll: true
    metadata: { ResourceId: openai.id }
  }
}

resource searchConnection 'Microsoft.MachineLearningServices/workspaces/connections@2024-04-01-preview' = {
  parent: aiHub
  name: 'search-connection'
  properties: {
    category: 'CognitiveSearch'
    target: 'https://${search.name}.search.windows.net'
    authType: 'AAD'
    isSharedToAll: true
    metadata: { ResourceId: search.id }
  }
}

// --- Outputs ---
output openaiEndpoint string = openai.properties.endpoint
output openaiName string = openai.name
output searchEndpoint string = 'https://${search.name}.search.windows.net'
output searchName string = search.name
output projectId string = aiProject.id
```

---

## 2. Deploy Infrastructure

Run the following command in your terminal to provision the resources defined above.

```bash
# Deploy the Bicep file
az deployment group create \
  --resource-group civic-chatbot-rg \
  --template-file infrastructure/ai-foundry.bicep \
  --name deploy-ai-foundry
```

_Wait for the deployment to finish (approx. 2-5 minutes)._

---

## 3. Deploy Models (GPT-4o & Embeddings)

Once the OpenAI resource is created, you need to deploy the specific models. Run these commands directly:

### 3.1. Set Variables

Retrieve the OpenAI resource name created in the previous step (check the outputs or your Azure Portal). It usually looks like `civic-chatbot-openai`.

```bash
OPENAI_NAME="civic-chatbot-openai" # Update if your name is different
RG="civic-chatbot-rg"
```

### 3.2. Deploy GPT-4o-mini

This model handles the chat logic.

```bash
az cognitiveservices account deployment create \
  --resource-group $RG \
  --name $OPENAI_NAME \
  --deployment-name gpt-4o-mini \
  --model-name gpt-4o-mini \
  --model-version "2024-07-18" \
  --model-format OpenAI \
  --sku-name "Standard" \
  --sku-capacity 10
```

### 3.3. Deploy text-embedding-3-small

This model handles the vectorization for RAG (Search).

```bash
az cognitiveservices account deployment create \
  --resource-group $RG \
  --name $OPENAI_NAME \
  --deployment-name text-embedding-3-small \
  --model-name text-embedding-3-small \
  --model-version "1" \
  --model-format OpenAI \
  --sku-name "Standard" \
  --sku-capacity 10
```

> **Note:** If you get a "Model not found" error, ensure your selected region (`eastus2`, `swedencentral`, etc.) supports these specific models.

---

## 4. Get Credentials for Your App

Run these commands to retrieve the keys needed for your `backend` and `multi-agents` containers.

```bash
# Get OpenAI Key
echo "AZURE_OPENAI_API_KEY: "
az cognitiveservices account keys list \
  --resource-group $RG \
  --name $OPENAI_NAME \
  --query "key1" -o tsv

# Get OpenAI Endpoint
echo "AZURE_OPENAI_ENDPOINT: "
az cognitiveservices account show \
  --resource-group $RG \
  --name $OPENAI_NAME \
  --query "properties.endpoint" -o tsv

# Get Search Key
SEARCH_NAME="civic-chatbot-search" # Check your Bicep output for exact name
echo "AZURE_SEARCH_KEY: "
az search admin-key show \
  --resource-group $RG \
  --service-name $SEARCH_NAME \
  --query "primaryKey" -o tsv

# Get Search Endpoint
echo "AZURE_SEARCH_ENDPOINT: "
echo "https://$SEARCH_NAME.search.windows.net"
```

Copy these values into your Deployment settings (as described in `DEPLOY_BACKEND.md` and `DEPLOY_MULTI_AGENTS.md`).
