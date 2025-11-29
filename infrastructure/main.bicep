param location string = resourceGroup().location
param appNamePrefix string = 'civic-chatbot'
param environment string = 'dev'
param containerImageUri string = ''

// Variables
var appServicePlanName = '${appNamePrefix}-${environment}-asp'
var stagingAppName = '${appNamePrefix}-${environment}-staging'
var prodAppName = '${appNamePrefix}-${environment}-prod'
var acrName = '${replace(appNamePrefix, '-', '')}${environment}acr001'
var appInsightsName = '${appNamePrefix}-${environment}-ai'
var managedIdentityName = '${appNamePrefix}-${environment}-mi'

// Managed Identity
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    RetentionInDays: 30
  }
}

// Azure Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}

// Role assignment: Managed Identity -> ACR Pull
resource acrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: containerRegistry
  name: guid(containerRegistry.id, managedIdentity.id, 'acrPull')
  properties: {
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/7f951dda-4ed3-4680-a7ca-43fe172d538d'
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: 'B1'
    tier: 'Basic'
    capacity: 1
  }
  properties: {
    reserved: true
  }
}

// Staging App Service
resource stagingApp 'Microsoft.Web/sites@2023-01-01' = {
  name: stagingAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    clientAffinityEnabled: false
  }
}

// Staging App Configuration
resource stagingAppConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: stagingApp
  name: 'web'
  properties: {
    acrUseManagedIdentityCreds: true
    alwaysOn: true
    http20Enabled: true
    minTlsVersion: '1.2'
    scmMinTlsVersion: '1.2'
    ftpsState: 'Disabled'
    remoteDebuggingEnabled: false
    appSettings: [
      {
        name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: appInsights.properties.ConnectionString
      }
      {
        name: 'NODE_ENV'
        value: 'production'
      }
      {
        name: 'DOCKER_REGISTRY_SERVER_URL'
        value: 'https://${containerRegistry.properties.loginServer}'
      }
      {
        name: 'DOCKER_REGISTRY_SERVER_USERNAME'
        value: managedIdentity.properties.clientId
      }
      {
        name: 'DOCKER_ENABLE_CI'
        value: 'true'
      }
      {
        name: 'WEBSITES_PORT'
        value: '3000'
      }
    ]
  }
}

resource stagingAppContainer 'Microsoft.Web/sites/sitecontainers@2023-01-01' = {
  parent: stagingApp
  name: 'frontend'
  properties: {
    image: containerImageUri != ''
      ? containerImageUri
      : '${containerRegistry.properties.loginServer}/civic-chatbot-frontend:latest'
    isMain: true
    authType: 'UserAssigned'
    userManagedIdentityClientId: managedIdentity.properties.clientId
  }
}

// Production App Service
resource prodApp 'Microsoft.Web/sites@2023-01-01' = {
  name: prodAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    clientAffinityEnabled: false
  }
}

// Production App Configuration
resource prodAppConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: prodApp
  name: 'web'
  properties: {
    acrUseManagedIdentityCreds: true
    alwaysOn: true
    http20Enabled: true
    minTlsVersion: '1.2'
    scmMinTlsVersion: '1.2'
    ftpsState: 'Disabled'
    remoteDebuggingEnabled: false
    appSettings: [
      {
        name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: appInsights.properties.ConnectionString
      }
      {
        name: 'NODE_ENV'
        value: 'production'
      }
      {
        name: 'DOCKER_REGISTRY_SERVER_URL'
        value: 'https://${containerRegistry.properties.loginServer}'
      }
      {
        name: 'DOCKER_REGISTRY_SERVER_USERNAME'
        value: managedIdentity.properties.clientId
      }
      {
        name: 'DOCKER_ENABLE_CI'
        value: 'true'
      }
      {
        name: 'WEBSITES_PORT'
        value: '3000'
      }
    ]
  }
}

resource prodAppContainer 'Microsoft.Web/sites/sitecontainers@2023-01-01' = {
  parent: prodApp
  name: 'frontend'
  properties: {
    image: containerImageUri != ''
      ? containerImageUri
      : '${containerRegistry.properties.loginServer}/civic-chatbot-frontend:latest'
    isMain: true
    authType: 'UserAssigned'
    userManagedIdentityClientId: managedIdentity.properties.clientId
  }
}

// Outputs
output managedIdentityClientId string = managedIdentity.properties.clientId
output managedIdentityTenantId string = subscription().tenantId
output stagingAppName string = stagingApp.name
output prodAppName string = prodApp.name
output acrLoginServer string = containerRegistry.properties.loginServer
output acrName string = containerRegistry.name
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
