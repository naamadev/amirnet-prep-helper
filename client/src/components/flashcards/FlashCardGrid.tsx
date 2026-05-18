import React, { useState, useMemo } from 'react';
import { Box, Typography, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { WordItem } from '../../types';
import FlashCard from './FlashCard';
import useStyles from './flashCardGridStyles';

interface Props {
  words: WordItem[];
}

type FilterType = 'all' | 'learning' | 'learned';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const FlashCardGrid: React.FC<Props> = ({ words }) => {
  const { classes, cx } = useStyles();
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const availableLetters = useMemo(
    () => new Set(words.map((w) => w.englishWord[0].toUpperCase())),
    [words]
  );

  const filteredWords = useMemo(() => {
    let result = words;
    if (filter === 'learned') result = result.filter((w) => w.isLearned);
    if (filter === 'learning') result = result.filter((w) => !w.isLearned);
    if (activeLetter) result = result.filter((w) => w.englishWord.toUpperCase().startsWith(activeLetter));
    return result;
  }, [words, filter, activeLetter]);

  const learnedCount = words.filter((w) => w.isLearned).length;

  const handleLetterClick = (letter: string) => {
    setActiveLetter((prev) => (prev === letter ? null : letter));
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h5" fontWeight={700}>
          My Vocabulary
        </Typography>
        <Box className={classes.stats}>
          <Chip className={classes.statChip} label={`${words.length} total`} color="primary" variant="outlined" />
          <Chip className={classes.statChip} label={`${learnedCount} learned`} color="success" variant="outlined" />
          <Chip className={classes.statChip} label={`${words.length - learnedCount} remaining`} color="warning" variant="outlined" />
        </Box>
      </Box>

      {/* Status filter */}
      <Box className={classes.filterRow}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_e, val) => { if (val) setFilter(val); }}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="learning">Learning</ToggleButton>
          <ToggleButton value="learned">Learned ✓</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* A-Z filter */}
      <Box className={classes.alphabetRow}>
        {ALPHABET.map((letter) => {
          const hasWords = availableLetters.has(letter);
          return (
            <button
              key={letter}
              className={cx(
                classes.letterBtn,
                !hasWords && 'disabled',
                activeLetter === letter && 'active'
              )}
              onClick={() => hasWords && handleLetterClick(letter)}
            >
              {letter}
            </button>
          );
        })}
        {activeLetter && (
          <button className={classes.clearLetterBtn} onClick={() => setActiveLetter(null)}>
            ✕ clear
          </button>
        )}
      </Box>

      {filteredWords.length === 0 ? (
        <Box className={classes.empty}>
          <Typography variant="h6">No words found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {activeLetter ? `No words starting with "${activeLetter}"` : 'No words in this category'}
          </Typography>
        </Box>
      ) : (
        <Box className={classes.grid}>
          {filteredWords.map((word) => (
            <FlashCard key={word.wordId} word={word} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FlashCardGrid;
