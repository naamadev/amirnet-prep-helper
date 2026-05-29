import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Reminder } from '../types';

const KEY = ['reminder'];

export function useReminder() {
  return useQuery<{ reminder: Reminder | null }>({
    queryKey: KEY,
    queryFn: () => apiClient.get('/reminders').then((r) => r.data),
  });
}

export function useSetReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { hour: number; minute: number; durationMins: number; daysOfWeek: string }) =>
      apiClient.post('/reminders', payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete('/reminders').then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
