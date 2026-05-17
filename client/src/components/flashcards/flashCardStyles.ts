import { makeStyles } from 'tss-react/mui';

const POS_COLORS: Record<string, string> = {
  Noun: '#4F46E5',
  Verb: '#059669',
  Adjective: '#D97706',
  Adverb: '#DC2626',
  Other: '#6B7280',
};

const useStyles = makeStyles<{ isLearned: boolean }>()((theme, { isLearned }) => ({
  container: {
    perspective: 1000,
    width: '100%',
    height: 220,
    cursor: 'pointer',
  },
  inner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.flipped': {
      transform: 'rotateY(180deg)',
    },
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    boxShadow: isLearned
      ? `0 4px 16px ${theme.palette.success.main}30`
      : '0 4px 24px rgba(0,0,0,0.10)',
    opacity: isLearned ? 0.65 : 1,
    transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
  },
  front: {
    backgroundColor: theme.palette.background.paper,
    border: isLearned
      ? `2px solid ${theme.palette.success.main}`
      : `2px solid transparent`,
  },
  back: {
    backgroundColor: theme.palette.primary.main,
    transform: 'rotateY(180deg)',
    color: '#fff',
  },
  englishWord: {
    fontWeight: 700,
    fontSize: '1.4rem',
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  hint: {
    fontSize: '0.75rem',
    color: theme.palette.text.disabled,
    marginTop: theme.spacing(1),
  },
  hebrewWord: {
    fontWeight: 700,
    fontSize: '1.5rem',
    textAlign: 'center',
    direction: 'rtl',
    marginBottom: theme.spacing(1),
  },
  posBadge: (params: { partOfSpeech: string }) => ({
    backgroundColor: POS_COLORS[params.partOfSpeech] ?? POS_COLORS.Other,
    color: '#fff',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: '0.7rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1.5),
  }),
  actions: {
    position: 'absolute',
    bottom: theme.spacing(1.5),
    right: theme.spacing(1.5),
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  actionBtn: {
    width: 28,
    height: 28,
    minWidth: 'unset',
    padding: 0,
    borderRadius: '50%',
    fontSize: '0.75rem',
  },
  learnedCheckmark: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    color: isLearned ? theme.palette.success.main : theme.palette.action.disabled,
    transition: 'color 0.2s ease',
  },
}));

export default useStyles;
export { POS_COLORS };
