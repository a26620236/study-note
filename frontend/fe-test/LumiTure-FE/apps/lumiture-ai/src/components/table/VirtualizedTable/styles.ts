export const STYLES = {
  CONTAINER: {
    position: 'relative',
    overflow: 'auto',
    maxHeight: '575px',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'gray.borderLight',
      borderRadius: '4px',
    },
  },
  TABLE: { display: 'grid' },
  TABLE_HEAD: {
    display: 'grid',
    position: 'sticky',
    top: 0,
    zIndex: 3,
    '& .MuiTableCell-root': {
      height: '50px',
      '& .MuiStack-root': {
        '& .material-icons': {
          fontSize: '20px',
        },
      },
    },
  },
  TABLE_BODY: {
    position: 'relative',
    display: 'grid',
    '& .MuiTableCell-root': {
      height: '50px',
    },
    '& .MuiTableRow-root:hover .MuiTableCell-root': { bgcolor: 'gray.hover' },
  },
  TR: {
    display: 'flex',
    width: '100%',
  },
  TD: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 50,
    px: 4,
    py: 1.5,
    borderColor: 'gray.borderLight',
    '&.MuiTableCell-head': { fontWeight: 700, bgcolor: 'primary.light10' },
    '&.MuiTableCell-body': { bgcolor: 'common.white' },
  },
  TABLE_FOOTER: {
    position: 'sticky',
    bottom: 0,
    zIndex: 3,
    bgcolor: 'primary.light10',
  },
  _START_SHADOW: 'rgba(0, 0, 0, 0.05) 4px 0px 6px',
  _END_SHADOW: '-4px 0px 6px rgba(0, 0, 0, 0.05)',
} as const;
