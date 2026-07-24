import { PlatformsValue } from '@constants';

import { createPlatformResourcesStore } from '../createPlatformResourcesStore';

describe('createPlatformResourcesStore', () => {
  describe('initial state', () => {
    it('should initialize all platforms with empty searchText and empty rowSelection', () => {
      const store = createPlatformResourcesStore();
      const state = store.getState();

      expect(state.gcp).toEqual({ searchText: '', resourcesRowSelection: {} });
      expect(state.aws).toEqual({ searchText: '', resourcesRowSelection: {} });
      expect(state.azure).toEqual({ searchText: '', resourcesRowSelection: {} });
    });
  });

  describe('setSearchText', () => {
    it('should update searchText for GCP', () => {
      const store = createPlatformResourcesStore();

      store.getState().setSearchText(PlatformsValue.GCP, 'my-project');

      expect(store.getState().gcp.searchText).toBe('my-project');
    });

    it('should update searchText for AWS', () => {
      const store = createPlatformResourcesStore();

      store.getState().setSearchText(PlatformsValue.AWS, 'my-account');

      expect(store.getState().aws.searchText).toBe('my-account');
    });

    it('should update searchText for Azure', () => {
      const store = createPlatformResourcesStore();

      store.getState().setSearchText(PlatformsValue.AZURE, 'my-subscription');

      expect(store.getState().azure.searchText).toBe('my-subscription');
    });

    it('should not affect other platforms when updating one', () => {
      const store = createPlatformResourcesStore();

      store.getState().setSearchText(PlatformsValue.GCP, 'gcp-value');

      expect(store.getState().aws.searchText).toBe('');
      expect(store.getState().azure.searchText).toBe('');
    });
  });

  describe('setResourcesRowSelection', () => {
    it('should update resourcesRowSelection for GCP', () => {
      const store = createPlatformResourcesStore();

      store.getState().setResourcesRowSelection(PlatformsValue.GCP, { 'row-1': true });

      expect(store.getState().gcp.resourcesRowSelection).toEqual({ 'row-1': true });
    });

    it('should update resourcesRowSelection for AWS', () => {
      const store = createPlatformResourcesStore();

      store
        .getState()
        .setResourcesRowSelection(PlatformsValue.AWS, { 'row-2': true, 'row-3': false });

      expect(store.getState().aws.resourcesRowSelection).toEqual({ 'row-2': true, 'row-3': false });
    });

    it('should update resourcesRowSelection for Azure', () => {
      const store = createPlatformResourcesStore();

      store.getState().setResourcesRowSelection(PlatformsValue.AZURE, { 'row-4': true });

      expect(store.getState().azure.resourcesRowSelection).toEqual({ 'row-4': true });
    });

    it('should not affect other platforms when updating one', () => {
      const store = createPlatformResourcesStore();

      store.getState().setResourcesRowSelection(PlatformsValue.GCP, { 'row-1': true });

      expect(store.getState().aws.resourcesRowSelection).toEqual({});
      expect(store.getState().azure.resourcesRowSelection).toEqual({});
    });
  });

  describe('store isolation', () => {
    it('should return independent stores for each createPlatformResourcesStore call', () => {
      const storeA = createPlatformResourcesStore();
      const storeB = createPlatformResourcesStore();

      storeA.getState().setSearchText(PlatformsValue.GCP, 'store-a');

      expect(storeB.getState().gcp.searchText).toBe('');
    });
  });
});
