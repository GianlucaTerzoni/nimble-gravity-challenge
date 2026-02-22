export interface Candidate {
  uuid: string;
  candidateId: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Job {
  id: string;
  title: string;
}

export interface ApplyToJobPayload {
  uuid: string;
  jobId: string;
  candidateId: string;
  repoUrl: string;
// Se incluye applicationId porque el backend lo requiere para validar la solicitud.
  applicationId: string;
}