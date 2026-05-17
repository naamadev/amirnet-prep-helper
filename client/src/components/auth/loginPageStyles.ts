import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    padding: theme.spacing(2),
  },
  card: {
    padding: theme.spacing(6),
    maxWidth: 440,
    width: '100%',
    textAlign: 'center',
    borderRadius: 20,
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
  },
  logo: {
    fontSize: 56,
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 800,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
  },
  googleBtn: {
    width: '100%',
    padding: theme.spacing(1.5),
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: 10,
    textTransform: 'none',
    border: `1.5px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
    flexWrap: 'wrap',
  },
  featureChip: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
}));

export default useStyles;
