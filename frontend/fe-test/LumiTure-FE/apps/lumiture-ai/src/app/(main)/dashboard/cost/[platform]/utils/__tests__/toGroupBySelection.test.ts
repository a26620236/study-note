import { GROUPED_SINGLE_SELECT_UNGROUPED_KEY } from '@lumiture-ui';

import { AWSGroupBy, AzureGroupBy, GCPGroupBy } from '@hooks-api';

import { GROUP_KEY } from '../../constants/groupByOptions';
import { toAwsGroupBy, toAzureGroupBy, toGcpGroupBy } from '../toGroupBySelection';

describe('toGroupBySelection', () => {
  describe('toGcpGroupBy', () => {
    it('maps the lumitag group to LumiTag + key', () => {
      expect(toGcpGroupBy(GROUP_KEY.lumitag, 'lt-1')).toEqual({
        type: GCPGroupBy.LumiTag,
        key: 'lt-1',
      });
    });

    it('maps the label group to LabelKey + key', () => {
      expect(toGcpGroupBy(GROUP_KEY.label, 'env')).toEqual({
        type: GCPGroupBy.LabelKey,
        key: 'env',
      });
    });

    it('maps a built-in option to its enum with null key', () => {
      expect(toGcpGroupBy(GROUPED_SINGLE_SELECT_UNGROUPED_KEY, GCPGroupBy.Project)).toEqual({
        type: GCPGroupBy.Project,
        key: null,
      });
    });

    it('falls back to Organization when the value is not a built-in option', () => {
      expect(toGcpGroupBy(GROUPED_SINGLE_SELECT_UNGROUPED_KEY, GCPGroupBy.LumiTag)).toEqual({
        type: GCPGroupBy.Organization,
        key: null,
      });
    });
  });

  describe('toAwsGroupBy', () => {
    it('maps the lumitag group to LumiTag + key', () => {
      expect(toAwsGroupBy(GROUP_KEY.lumitag, 'lt-1')).toEqual({
        type: AWSGroupBy.LumiTag,
        key: 'lt-1',
      });
    });

    it('maps the tag group to TagKey + key', () => {
      expect(toAwsGroupBy(GROUP_KEY.tag, 'env')).toEqual({
        type: AWSGroupBy.TagKey,
        key: 'env',
      });
    });

    it('maps a built-in option to its enum with null key', () => {
      expect(toAwsGroupBy(GROUPED_SINGLE_SELECT_UNGROUPED_KEY, AWSGroupBy.Account)).toEqual({
        type: AWSGroupBy.Account,
        key: null,
      });
    });

    it('falls back to Organization when the value is not a built-in option', () => {
      expect(toAwsGroupBy(GROUPED_SINGLE_SELECT_UNGROUPED_KEY, AWSGroupBy.LumiTag)).toEqual({
        type: AWSGroupBy.Organization,
        key: null,
      });
    });
  });

  describe('toAzureGroupBy', () => {
    it('maps the lumitag group to LumiTag + key', () => {
      expect(toAzureGroupBy(GROUP_KEY.lumitag, 'lt-1')).toEqual({
        type: AzureGroupBy.LumiTag,
        key: 'lt-1',
      });
    });

    it('maps the tag group to TagKey + key', () => {
      expect(toAzureGroupBy(GROUP_KEY.tag, 'env')).toEqual({
        type: AzureGroupBy.TagKey,
        key: 'env',
      });
    });

    it('maps a built-in option to its enum with null key', () => {
      expect(
        toAzureGroupBy(GROUPED_SINGLE_SELECT_UNGROUPED_KEY, AzureGroupBy.ResourceGroup)
      ).toEqual({ type: AzureGroupBy.ResourceGroup, key: null });
    });

    it('falls back to Organization when the value is not a built-in option', () => {
      expect(toAzureGroupBy(GROUPED_SINGLE_SELECT_UNGROUPED_KEY, AzureGroupBy.LumiTag)).toEqual({
        type: AzureGroupBy.Organization,
        key: null,
      });
    });
  });
});
