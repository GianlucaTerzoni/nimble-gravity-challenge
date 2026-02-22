import { request } from './client';
import type { Candidate, Job, ApplyToJobPayload } from './types';

export function getCandidateByEmail(email: string) {
  return request<Candidate>(
    `/api/candidate/get-by-email?email=${encodeURIComponent(email)}`
  );
}

export function getJobs() {
  return request<Job[]>('/api/jobs/get-list');
}

export function applyToJob(payload: ApplyToJobPayload) {
  return request<{ ok: boolean }>('/api/candidate/apply-to-job', {
    method: 'POST',
    json: payload,
  });
}