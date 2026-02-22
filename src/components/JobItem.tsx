import { useState } from 'react';
import { applyToJob } from '../api/botfilter';
import type { Candidate, Job } from '../api/types';

type JobItemProps = {
  job: Job;
  candidate: Candidate;
};

function JobItem({ job, candidate }: JobItemProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isValidRepo = repoUrl.trim().startsWith('https://github.com/');

  const canSubmit =
    isValidRepo &&
    !submitting &&
    !success;

  const handleSubmit = async () => {
    if (!isValidRepo) {
      setError('Please enter a valid GitHub repository URL.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await applyToJob({
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        repoUrl: repoUrl.trim(),
      });

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: 12,
        borderRadius: 6,
      }}
    >
      <h3 style={{ marginTop: 0 }}>{job.title}</h3>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="https://github.com/your-user/your-repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          disabled={submitting || success}
          style={{ padding: 8, minWidth: 300 }}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            padding: '8px 12px',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {submitting ? 'Submitting...' : success ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 8, color: '#b00020' }}>{error}</p>
      )}
    </div>
  );
}

export default JobItem;