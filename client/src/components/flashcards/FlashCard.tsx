import React, { useState, useCallback } from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { WordItem } from '../../types';
import { useUpdateWord } from '../../hooks/useWords';
import useStyles, { POS_COLORS } from './flashCardStyles';

interface Props {
  word: WordItem;
}

const FlashCard: React.FC<Props> = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(word.hebrewTranslation);
  const { classes, cx } = useStyles();
  const { mutate: updateWord } = useUpdateWord();

  const handleFlip = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button') || isEditing) return;
      setIsFlipped((v) => !v);
    },
    [isEditing]
  );

  const handleLearnedToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateWord({ wordId: word.wordId, isLearned: !word.isLearned });
    },
    [word.wordId, word.isLearned, updateWord]
  );

  const handleEditSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateWord({ wordId: word.wordId, customHebrewTranslation: editValue.trim() || null });
      setIsEditing(false);
    },
    [word.wordId, editValue, updateWord]
  );

  const handleEditCancel = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditValue(word.hebrewTranslation);
      setIsEditing(false);
    },
    [word.hebrewTranslation]
  );

  const partOfSpeech = word.partOfSpeech ?? 'Other';

  return (
    <Box className={classes.container} onClick={handleFlip}>
      <Box className={cx(classes.inner, isFlipped && 'flipped')}>

        {/* Front */}
        <Box
          className={cx(classes.face, classes.front)}
          sx={word.isLearned ? {
            border: '2px solid',
            borderColor: 'success.main',
            opacity: 0.7,
            boxShadow: '0 4px 16px rgba(16,185,129,0.2)',
          } : {}}
        >
          <IconButton
            className={classes.learnedBtn}
            onClick={handleLearnedToggle}
            size="small"
            sx={{ color: word.isLearned ? 'success.main' : 'action.disabled', transition: 'color 0.2s' }}
          >
            {word.isLearned
              ? <CheckCircleIcon fontSize="small" />
              : <CheckCircleOutlineIcon fontSize="small" />}
          </IconButton>
          <Typography className={classes.englishWord}>{word.englishWord}</Typography>
          <Typography className={classes.hint}>tap to reveal</Typography>
        </Box>

        {/* Back */}
        <Box className={cx(classes.face, classes.back)}>
          <Box
            className={classes.posBadge}
            style={{ backgroundColor: POS_COLORS[partOfSpeech] ?? POS_COLORS.Other }}
          >
            {partOfSpeech}
          </Box>

          {isEditing ? (
            <TextField
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="small"
              inputProps={{ dir: 'rtl', style: { textAlign: 'center', color: '#fff' } }}
              sx={{ mb: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' } }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <Typography className={classes.hebrewWord}>{word.hebrewTranslation}</Typography>
          )}

          <Box className={classes.actions}>
            {isEditing ? (
              <>
                <IconButton
                  className={classes.actionBtn}
                  onClick={handleEditSave}
                  size="small"
                  sx={{ color: '#fff', bgcolor: 'success.main' }}
                >
                  <DoneIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  className={classes.actionBtn}
                  onClick={handleEditCancel}
                  size="small"
                  sx={{ color: '#fff', bgcolor: 'error.main' }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </>
            ) : (
              <IconButton
                className={classes.actionBtn}
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                size="small"
                sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)' }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            )}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default FlashCard;
