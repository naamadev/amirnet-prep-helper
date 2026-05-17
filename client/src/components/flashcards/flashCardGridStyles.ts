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
    marginBottom: theme.spacing(3),
    alignItems: 'center',
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
