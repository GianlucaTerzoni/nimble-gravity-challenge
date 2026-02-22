import { useState } from 'react';
import CandidatePanel from './components/CandidatePanel';
import type { Candidate } from './api/types';

function App() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Nimble Gravity Challenge</h1>

      <CandidatePanel onCandidateLoaded={setCandidate} />

      {candidate && (
        <p style={{ marginTop: 12, fontSize: 12, color: '#555' }}>
          Candidate ready (uuid: {candidate.uuid}, candidateId: {candidate.candidateId})
        </p>
      )}
    </div>
  );
}

export default App;