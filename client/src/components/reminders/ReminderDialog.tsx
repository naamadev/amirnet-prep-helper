import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Alert,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { useReminder, useSetReminder, useDeleteReminder } from '../../hooks/useReminder';
import { Reminder } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function describeReminder(r: Reminder): string {
  const time = formatTime(r.hour, r.minute);
  const days = r.daysOfWeek === 'daily' ? 'every day' : 'on weekdays';
  return `${time}, ${days}, ${r.durationMins} min`;
}

const ReminderDialog: React.FC<Props> = ({ open, onClose }) => {
  const { data, isLoading } = useReminder();
  const { mutate: setReminder, isPending: isSaving, error: saveError } = useSetReminder();
  const { mutate: deleteReminder, isPending: isDeleting } = useDeleteReminder();

  const [time, setTime] = useState('08:00');
  const [duration, setDuration] = useState(10);
  const [daysOfWeek, setDaysOfWeek] = useState<'daily' | 'weekdays'>('daily');

  const active = data?.reminder ?? null;

  useEffect(() => {
    if (active) {
      setTime(formatTime(active.hour, active.minute));
      setDuration(active.durationMins);
      setDaysOfWeek(active.daysOfWeek === 'daily' ? 'daily' : 'weekdays');
    }
  }, [active]);

  const handleSave = () => {
    const [h, m] = time.split(':').map(Number);
    setReminder(
      { hour: h, minute: m, durationMins: duration, daysOfWeek: daysOfWeek === 'weekdays' ? '1,2,3,4,5' : 'daily' },
      { onSuccess: onClose }
    );
  };

  const handleDelete = () => deleteReminder(undefined, { onSuccess: onClose });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationsIcon color="primary" />
        Study Reminder
      </DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            {active && (
              <Alert severity="success" icon={<NotificationsIcon />}>
                Active: {describeReminder(active)}
              </Alert>
            )}

            <TextField
              label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 10))}
              inputProps={{ min: 1, max: 120 }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Repeat</InputLabel>
              <Select
                value={daysOfWeek}
                label="Repeat"
                onChange={(e) => setDaysOfWeek(e.target.value as 'daily' | 'weekdays')}
              >
                <MenuItem value="daily">Every day</MenuItem>
                <MenuItem value="weekdays">Weekdays only (Mon–Fri)</MenuItem>
              </Select>
            </FormControl>

            {saveError && (
              <Alert severity="error">
                {(saveError as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to save reminder'}
              </Alert>
            )}

            <Typography variant="caption" color="text.secondary">
              A recurring event will be added to your Google Calendar with a 5-minute popup notification.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {active && (
          <Button
            startIcon={<NotificationsOffIcon />}
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            sx={{ mr: 'auto' }}
          >
            {isDeleting ? 'Removing…' : 'Remove'}
          </Button>
        )}
        <Button onClick={onClose} disabled={isSaving || isDeleting}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || isDeleting || isLoading}
        >
          {isSaving ? <CircularProgress size={18} color="inherit" /> : active ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReminderDialog;
