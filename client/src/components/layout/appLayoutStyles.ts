import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
    color: theme.palette.text.primary,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 3),
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontWeight: 800,
    fontSize: '1.1rem',
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  userAvatar: {
    width: 34,
    height: 34,
    backgroundColor: theme.palette.primary.main,
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  content: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: theme.spacing(3, 2),
  },
}));

export default useStyles;
