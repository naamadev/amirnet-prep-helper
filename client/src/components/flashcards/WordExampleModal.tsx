import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, CircularProgress, Chip, Alert,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useWordExamples } from '../../hooks/useWordExamples';

interface Props {
  word: string;
  open: boolean;
  onClose: () => void;
}

const WordExampleModal: React.FC<Props> = ({ word, open, onClose }) => {
  const { data: examples, isLoading, isError } = useWordExamples(word, open);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MenuBookIcon color="primary" />
        <Box>
          "{word}" in context
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
            Example sentences
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {isError && (
          <Alert severity="warning">
            No example sentences found for "{word}". Try a different form of the word.
          </Alert>
        )}

        {examples && examples.length === 0 && (
          <Alert severity="info">
            No example sentences available for "{word}" in the dictionary.
          </Alert>
        )}

        {examples && examples.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {examples.map((ex, i) => (
              <Box key={i} sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 2 }}>
                <Chip
                  label={ex.partOfSpeech}
                  size="small"
                  sx={{ mb: 0.5, fontSize: '0.65rem', height: 20 }}
                />
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{ex.example}"
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WordExampleModal;
