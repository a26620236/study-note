export interface AvailableActions {
  assignResource: boolean;
  removeResource: boolean;
}

//  <================== GCP ==================>
export interface GCPAssignedResourcesInfos {
  projectName: string;
  projectId: string;
  billingAccountName: string;
  billingAccountId: string;
  canRemoveResource: boolean;
}

export interface GCPAssignedResources {
  availableActions: AvailableActions;
  resources: GCPAssignedResourcesInfos[];
}

export interface GCPAvailableResourcesInfos {
  billingAccountId: string;
  billingAccountName: string;
  projects: {
    projectName: string;
    projectId: string;
    assigned: boolean;
  }[];
}

export interface GCPAvailableResources {
  resources: GCPAvailableResourcesInfos[];
}

export interface GCPResourceGroup {
  resources: {
    projectName: string;
    projectId: string;
    groups: string[];
  }[];
}

//  <================== AWS ==================>
export interface AWSAssignedResourcesInfos {
  accountName: string;
  accountId: string;
  managementAccountId: string;
  managementAccountName: string;
  canRemoveResource: boolean;
}

export interface AWSAssignedResources {
  availableActions: AvailableActions;
  resources: AWSAssignedResourcesInfos[];
}

export interface AWSAvailableResourcesInfos {
  managementAccountId: string;
  managementAccountName: string;
  accounts: {
    accountId: string;
    accountName: string;
    assigned: boolean;
  }[];
}

export interface AWSAvailableResources {
  resources: AWSAvailableResourcesInfos[];
}

export interface AWSResourceGroup {
  resources: {
    accountName: string;
    accountId: string;
    groups: string[];
  }[];
}

//  <================== Azure ==================>

export interface AzureAssignedResourcesInfos {
  subscriptionId: string;
  subscriptionName: string;
  resourceGroupId: string;
  resourceGroupName: string;
  canRemoveResource: boolean;
}

export interface AzureAssignedResources {
  availableActions: AvailableActions;
  resources: AzureAssignedResourcesInfos[];
}

export interface AzureAvailableResourcesInfos {
  subscriptionId: string;
  subscriptionName: string;
  resourceGroups: {
    resourceGroupId: string;
    resourceGroupName: string;
    assigned: boolean;
  }[];
}

export interface AzureAvailableResources {
  resources: AzureAvailableResourcesInfos[];
}

export interface AzureResourceGroup {
  resources: {
    resourceGroupName: string;
    resourceGroupId: string;
    groups: string[];
  }[];
}

export interface ResourcesAssignmentStatus {
  hasAssignedResources: boolean;
}
