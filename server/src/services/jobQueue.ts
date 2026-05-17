import { EventEmitter } from 'events';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  wordCount?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobs = new Map<string, Job>();
export const jobEvents = new EventEmitter();

export function createJob(id: string): Job {
  const job: Job = {
    id,
    status: 'pending',
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, updates: Partial<Job>): void {
  const job = jobs.get(id);
  if (!job) return;
  Object.assign(job, { ...updates, updatedAt: new Date() });
  jobEvents.emit(`job:${id}`, job);
}

export function setJobProgress(id: string, progress: number): void {
  updateJob(id, { progress, status: 'processing' });
}

export function completeJob(id: string, wordCount: number): void {
  updateJob(id, { status: 'completed', progress: 100, wordCount });
}

export function failJob(id: string, error: string): void {
  updateJob(id, { status: 'failed', error });
}
