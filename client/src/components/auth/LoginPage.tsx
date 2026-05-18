import React from 'react';
import { Box, Card, Typography, Button, Chip } from '@mui/material';
import useStyles from './loginPageStyles';

const LoginPage: React.FC = () => {
  const { classes } = useStyles();

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <Box className={classes.root}>
      <Card className={classes.card} elevation={0}>
        <Box className={classes.logo}>📖</Box>
        <Typography variant="h4" className={classes.title}>
          Amirnet
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          Master English vocabulary for the Amirnet exam with smart flashcards and AI-powered
          translation.
        </Typography>

        <Button
          className={classes.googleBtn}
          onClick={handleGoogleLogin}
          startIcon={
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              width={20}
              height={20}
            />
          }
        >
          Continue with Google
        </Button>

        <Box className={classes.features}>
          {['📄 Upload PDFs', '🔤 Auto Translate', '🃏 Flashcards', '✅ Track Progress'].map(
            (f) => (
              <Chip key={f} label={f} variant="outlined" size="small" className={classes.featureChip} />
            )
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;
