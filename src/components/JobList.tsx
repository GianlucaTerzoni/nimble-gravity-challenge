import { useEffect, useState } from 'react';
import { getJobs } from '../api/botfilter';
import type { Candidate, Job } from '../api/types';

type JobListProps = {
  candidate: Candidate | null;
};

function JobList({ candidate }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!candidate) return;

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [candidate]);

  if (!candidate) {
    return null;
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2>Open Positions</h2>

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: '#b00020' }}>{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p>No jobs available.</p>
      )}

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {jobs.map((job) => (
          <li key={job.id} style={{ marginBottom: 16 }}>
            {job.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default JobList;