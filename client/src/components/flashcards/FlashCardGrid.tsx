import React, { useState, useMemo } from 'react';
import { Box, Typography, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { WordItem } from '../../types';
import FlashCard from './FlashCard';
import useStyles from './flashCardGridStyles';

interface Props {
  words: WordItem[];
}

type FilterType = 'all' | 'learning' | 'learned';

const FlashCardGrid: React.FC<Props> = ({ words }) => {
  const { classes } = useStyles();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredWords = useMemo(() => {
    if (filter === 'learned') return words.filter((w) => w.isLearned);
    if (filter === 'learning') return words.filter((w) => !w.isLearned);
    return words;
  }, [words, filter]);

  const learnedCount = words.filter((w) => w.isLearned).length;

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h5" fontWeight={700}>
          My Vocabulary
        </Typography>
        <Box className={classes.stats}>
          <Chip
            className={classes.statChip}
            label={`${words.length} total`}
            color="primary"
            variant="outlined"
          />
          <Chip
            className={classes.statChip}
            label={`${learnedCount} learned`}
            color="success"
            variant="outlined"
          />
          <Chip
            className={classes.statChip}
            label={`${words.length - learnedCount} remaining`}
            color="warning"
            variant="outlined"
          />
        </Box>
      </Box>

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

      {filteredWords.length === 0 ? (
        <Box className={classes.empty}>
          <Typography variant="h6">No words in this category</Typography>
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
