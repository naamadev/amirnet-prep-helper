import { useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { JobStatus } from '../types';

interface UploadState {
  jobId: string | null;
  status: JobStatus['status'] | 'idle';
  progress: number;
  wordCount: number | null;
  error: string | null;
}

export const useUpload = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<UploadState>({
    jobId: null,
    status: 'idle',
    progress: 0,
    wordCount: null,
    error: null,
  });
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (jobId: string) => {
      pollingRef.current = setInterval(async () => {
        try {
          const { data } = await apiClient.get<JobStatus>(`/upload/status/${jobId}`);
          setState((prev) => ({
            ...prev,
            status: data.status,
            progress: data.progress,
            wordCount: data.wordCount ?? null,
            error: data.error ?? null,
          }));

          if (data.status === 'completed') {
            stopPolling();
            queryClient.invalidateQueries({ queryKey: ['words'] });
          } else if (data.status === 'failed') {
            stopPolling();
          }
        } catch {
          stopPolling();
          setState((prev) => ({ ...prev, status: 'failed', error: 'Failed to fetch job status' }));
        }
      }, 1500);
    },
    [queryClient, stopPolling]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      setState({ jobId: null, status: 'pending', progress: 0, wordCount: null, error: null });

      const formData = new FormData();
      formData.append('pdf', file);

      try {
        const { data } = await apiClient.post<{ jobId: string }>('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setState((prev) => ({ ...prev, jobId: data.jobId, status: 'processing' }));
        startPolling(data.jobId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setState((prev) => ({ ...prev, status: 'failed', error: message }));
      }
    },
    [startPolling]
  );

  const reset = useCallback(() => {
    stopPolling();
    setState({ jobId: null, status: 'idle', progress: 0, wordCount: null, error: null });
  }, [stopPolling]);

  return { ...state, uploadFile, reset };
};
