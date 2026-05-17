import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles<{ isDragging: boolean }>()((theme, { isDragging }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    padding: theme.spacing(4),
  },
  dropZone: {
    border: `2.5px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: 20,
    padding: theme.spacing(8, 6),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isDragging ? theme.palette.primary.light + '15' : 'transparent',
    maxWidth: 560,
    width: '100%',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light + '10',
    },
  },
  icon: {
    fontSize: 64,
    color: isDragging ? theme.palette.primary.main : theme.palette.text.disabled,
    marginBottom: theme.spacing(2),
    transition: 'color 0.2s ease',
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  browseBtn: {
    borderRadius: 8,
    padding: theme.spacing(1, 3),
  },
  progressContainer: {
    maxWidth: 560,
    width: '100%',
    padding: theme.spacing(4),
    borderRadius: 16,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  progressLabel: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
  successIcon: {
    fontSize: 56,
    color: theme.palette.success.main,
    marginBottom: theme.spacing(1),
  },
  errorIcon: {
    fontSize: 56,
    color: theme.palette.error.main,
    marginBottom: theme.spacing(1),
  },
}));

export default useStyles;
