import React, { useCallback, useRef, useState } from 'react';
import { Box, Typography, Button, LinearProgress, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useUpload } from '../../hooks/useUpload';
import useStyles from './uploadZoneStyles';

interface Props {
  onComplete?: () => void;
  onCancel?: () => void;
}

const UploadZone: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { classes } = useStyles({ isDragging });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { status, progress, wordCount, error, uploadFile, reset } = useUpload();

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== 'application/pdf') return;
      uploadFile(file);
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (status === 'completed') {
    return (
      <Box className={classes.root}>
        <Box className={classes.progressContainer}>
          <CheckCircleIcon className={classes.successIcon} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Processing Complete!
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {wordCount ?? 0} words added to your vocabulary list.
          </Typography>
          <Button variant="contained" onClick={onComplete} sx={{ mt: 2, mr: 1 }}>
            View Flashcards
          </Button>
          <Button variant="outlined" onClick={reset} sx={{ mt: 2 }}>
            Upload Another
          </Button>
        </Box>
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box className={classes.root}>
        <Box className={classes.progressContainer}>
          <ErrorIcon className={classes.errorIcon} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Processing Failed
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {error ?? 'An unexpected error occurred.'}
          </Typography>
          <Button variant="contained" onClick={reset} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  if (status === 'pending' || status === 'processing') {
    return (
      <Box className={classes.root}>
        <Box className={classes.progressContainer}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography className={classes.progressLabel}>
            {status === 'pending' ? 'Uploading PDF...' : `Processing words... ${progress}%`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ borderRadius: 4, height: 8 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Extracting and translating vocabulary. This may take a moment.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Box
        className={classes.dropZone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          hidden
          onChange={handleInputChange}
        />
        <CloudUploadIcon className={classes.icon} />
        <Typography variant="h5" className={classes.title}>
          Drop your PDF here
        </Typography>
        <Typography className={classes.subtitle}>
          Upload your Amirnet study material and we&apos;ll extract and translate all vocabulary
          automatically.
        </Typography>
        <Button variant="contained" className={classes.browseBtn} disableElevation>
          Browse File
        </Button>
      </Box>
      {onCancel && (
        <Button variant="text" onClick={onCancel} sx={{ mt: 2, color: 'text.secondary' }}>
          ← Back to flashcards
        </Button>
      )}
    </Box>
  );
};

export default UploadZone;
