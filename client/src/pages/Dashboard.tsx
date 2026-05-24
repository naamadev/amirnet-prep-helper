import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useWords } from '../hooks/useWords';
import AppLayout from '../components/layout/AppLayout';
import UploadZone from '../components/upload/UploadZone';
import FlashCardGrid from '../components/flashcards/FlashCardGrid';
import useStyles from './dashboardStyles';

const Dashboard: React.FC = () => {
  const { classes } = useStyles();
  const { data, isLoading, isError } = useWords();
  const [showUpload, setShowUpload] = useState(false);

  const hasWords = (data?.total ?? 0) > 0;

  const handleUploadComplete = () => {
    setShowUpload(false);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Box className={classes.loading}>
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  if (isError) {
    return (
      <AppLayout>
        <Box className={classes.errorBox}>
          <Typography variant="h6">Failed to load words. Please refresh.</Typography>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout onUploadClick={hasWords && !showUpload ? () => setShowUpload(true) : undefined}>
      <Box className={classes.root}>
        {!hasWords || showUpload ? (
          <UploadZone
            onComplete={handleUploadComplete}
            onCancel={hasWords ? () => setShowUpload(false) : undefined}
          />
        ) : (
          <FlashCardGrid words={data?.words ?? []} />
        )}
      </Box>
    </AppLayout>
  );
};

export default Dashboard;
