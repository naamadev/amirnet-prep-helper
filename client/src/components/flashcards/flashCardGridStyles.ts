import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(0, 2, 4),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  stats: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  statChip: {
    fontWeight: 600,
  },
  filterRow: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
  },
  alphabetRow: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
    marginBottom: theme.spacing(3),
    alignItems: 'center',
  },
  letterBtn: {
    minWidth: 32,
    width: 32,
    height: 32,
    padding: 0,
    fontSize: '0.75rem',
    fontWeight: 700,
    borderRadius: 6,
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    transition: 'all 0.15s ease',
    '&:hover:not(.disabled)': {
      backgroundColor: theme.palette.primary.light,
      color: '#fff',
      borderColor: theme.palette.primary.light,
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      borderColor: theme.palette.primary.main,
    },
    '&.disabled': {
      opacity: 0.25,
      cursor: 'default',
    },
  },
  clearLetterBtn: {
    fontSize: '0.72rem',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0 6px',
    fontWeight: 600,
    '&:hover': { textDecoration: 'underline' },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: theme.spacing(2.5),
  },
  empty: {
    textAlign: 'center',
    padding: theme.spacing(8, 2),
    color: theme.palette.text.secondary,
  },
}));

export default useStyles;
