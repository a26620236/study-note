import type { ReactNode } from 'react';

import { Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { alpha, styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

interface Node {
  id: string;
  name: string;
  depth: string;
  children?: Node[];
}

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: '2px 0',
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 12,
    paddingLeft: 10,
    borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const GroupName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: '100%',
}));

const TreeView = styled(SimpleTreeView)({
  flexGrow: 1,
  width: '100%',
});

const LabelWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

function countSubgroups(node: Node): { tier1: number; tier2: number } {
  const tier1 = node.children?.length ?? 0;
  const tier2 = node.children?.reduce((sum, child) => sum + (child.children?.length ?? 0), 0) ?? 0;
  return { tier1, tier2 };
}

function formatSubgroupText(tier1: number, tier2: number): string {
  const parts: string[] = [];
  if (tier1 > 0) {
    parts.push(`${tier1} Tier-1 subgroup${tier1 > 1 ? 's' : ''}`);
  }
  if (tier2 > 0) {
    parts.push(`${tier2} Tier-2 subgroup${tier2 > 1 ? 's' : ''}`);
  }
  return parts.length > 0 ? `, including ${parts.join(' and ')}.` : '';
}

function renderLabel(name: string, depth: string, subgroupText?: string) {
  const displayName = subgroupText ? `${name}${subgroupText}` : name;
  return (
    <LabelWrapper>
      <Chip label={depth} size="small" />
      <Tooltip title={displayName}>
        <GroupName variant="body1">{displayName}</GroupName>
      </Tooltip>
    </LabelWrapper>
  );
}

function renderTree(nodes: Node[], isRoot = false, parentItemId = ''): ReactNode {
  return nodes.map((node) => {
    const { id, name, depth, children } = node;
    const itemId = parentItemId ? `${parentItemId}-${id}` : id;
    const { tier1, tier2 } = countSubgroups(node);
    const subgroupText = isRoot ? formatSubgroupText(tier1, tier2) : undefined;

    return (
      <CustomTreeItem key={itemId} itemId={itemId} label={renderLabel(name, depth, subgroupText)}>
        {children ? renderTree(children, false, itemId) : null}
      </CustomTreeItem>
    );
  });
}

export function GroupHierarchy({ data }: { data: Node[] }) {
  if (data.length === 0) {
    return null;
  }

  return <TreeView defaultExpandedItems={[]}>{renderTree(data, true)}</TreeView>;
}
