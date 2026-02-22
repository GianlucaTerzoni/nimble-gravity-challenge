import { useState } from 'react';
import { getCandidateByEmail } from '../api/botfilter';
import type { Candidate } from '../api/types';

type CandidatePanelProps = {
  onCandidateLoaded: (candidate: Candidate) => void;
};

function CandidatePanel({ onCandidateLoaded }: CandidatePanelProps) {
  const [email, setEmail] = useState<string>(
    (import.meta.env.VITE_DEFAULT_EMAIL as string) || ''
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedLabel, setLoadedLabel] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && !loading;

  const handleLoadCandidate = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter an email.');
      setLoadedLabel(null);
      return;
    }

    setLoading(true);
    setError(null);
    setLoadedLabel(null);

    try {
      const data = await getCandidateByEmail(trimmedEmail);
      onCandidateLoaded(data);
      setLoadedLabel(`${data.firstName} ${data.lastName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginTop: 16 }}>
      <h2 style={{ marginTop: 0 }}>Candidate</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, color: '#555' }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            style={{ padding: 8, minWidth: 280 }}
            disabled={loading}
          />
        </label>

        <button
          type="button"
          onClick={handleLoadCandidate}
          disabled={!canSubmit}
          style={{ padding: '10px 14px', cursor: canSubmit ? 'pointer' : 'not-allowed' }}
        >
          {loading ? 'Loading...' : 'Load candidate'}
        </button>
      </div>

      {error && <p style={{ marginTop: 12, color: '#b00020' }}>{error}</p>}

      {loadedLabel && !error && (
        <p style={{ marginTop: 12, marginBottom: 0 }}>
          <strong>Loaded:</strong> {loadedLabel}
        </p>
      )}
    </section>
  );
}

export default CandidatePanel;