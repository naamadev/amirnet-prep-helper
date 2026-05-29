import React, { ReactNode, useCallback, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Avatar, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';
import useStyles from './appLayoutStyles';
import ReminderDialog from '../reminders/ReminderDialog';
import { useReminder } from '../../hooks/useReminder';

interface Props {
  children: ReactNode;
  onUploadClick?: () => void;
}

const AppLayout: React.FC<Props> = ({ children, onUploadClick }) => {
  const { classes } = useStyles();
  const { user, refetch } = useAuth();
  const [reminderOpen, setReminderOpen] = useState(false);
  const { data: reminderData } = useReminder();
  const hasReminder = !!reminderData?.reminder;

  const handleLogout = useCallback(async () => {
    await apiClient.post('/auth/logout');
    await refetch();
  }, [refetch]);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <Box className={classes.root}>
      <AppBar position="sticky" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <Typography component="span" className={classes.logo}>
            📖 Amirnet
          </Typography>

          <Box className={classes.nav}>
            {onUploadClick && (
              <Button variant="outlined" size="small" onClick={onUploadClick} sx={{ mr: 1 }}>
                Upload More
              </Button>
            )}
            <Tooltip title={hasReminder ? 'Manage study reminder' : 'Set study reminder'}>
              <IconButton
                onClick={() => setReminderOpen(true)}
                color="inherit"
                size="small"
                sx={{ mr: 0.5, color: hasReminder ? 'warning.light' : 'inherit' }}
              >
                <NotificationsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography className={classes.userName}>{user?.name}</Typography>
            <Avatar className={classes.userAvatar}>{initials}</Avatar>
            <Button
              size="small"
              startIcon={<LogoutIcon fontSize="small" />}
              onClick={handleLogout}
              color="inherit"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box className={classes.content}>{children}</Box>

      <ReminderDialog open={reminderOpen} onClose={() => setReminderOpen(false)} />
    </Box>
  );
};

export default AppLayout;
