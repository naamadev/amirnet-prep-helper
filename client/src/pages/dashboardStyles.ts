import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    minHeight: 'calc(100vh - 64px)',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
  },
  errorBox: {
    textAlign: 'center',
    padding: theme.spacing(6),
    color: theme.palette.error.main,
  },
}));

export default useStyles;
