export interface JobStatus {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number; // e.g., percentage 0-100 or records processed
  message?: string; // For status updates or error messages
  startedAt: Date;
  updatedAt: Date;
  result?: any; // Result from the load function
}

const jobStatuses: Map<string, JobStatus> = new Map();

export function initJob(jobId: string): void {
  if (jobStatuses.has(jobId)) {
    // If job exists, perhaps we should clear its old status or log a warning
    // For now, let's assume re-initializing means starting fresh for that ID
    console.warn(`Job ${jobId} already existed. Re-initializing.`);
  }
  jobStatuses.set(jobId, {
    jobId,
    status: 'pending',
    startedAt: new Date(),
    updatedAt: new Date(),
    message: 'Job initialized',
  });
  console.log(`Job ${jobId} initialized in store.`);
}

export function updateJobStatus(
  jobId: string,
  statusUpdate: Partial<Omit<JobStatus, 'jobId' | 'startedAt' | 'updatedAt'>> & { status?: JobStatus['status'] }
): void {
  const job = jobStatuses.get(jobId);
  if (job) {
    // Preserve startedAt, update updatedAt, merge other fields
    const updatedJob = {
      ...job,
      ...statusUpdate,
      updatedAt: new Date()
    };
    jobStatuses.set(jobId, updatedJob);
  } else {
    // This case might happen if a job updates status before initJob was called (e.g. race condition or error in logic)
    // Or if an update is attempted for a job that was never properly started.
    console.warn(`Job ${jobId} not found for update. Initializing with current update.`);
    jobStatuses.set(jobId, {
        jobId,
        status: statusUpdate.status || 'running', // Default to 'running' if status not provided in this edge case
        progress: statusUpdate.progress,
        message: statusUpdate.message,
        startedAt: new Date(), // This job effectively starts now as far as the store is concerned
        updatedAt: new Date(),
        result: statusUpdate.result,
    });
  }
   // console.log(`Job ${jobId} status updated: ${statusUpdate.status}, Msg: ${statusUpdate.message}`);
}

export function getJobStatus(jobId: string): JobStatus | undefined {
  return jobStatuses.get(jobId);
}

export function getAllJobStatuses(): JobStatus[] {
    return Array.from(jobStatuses.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); // Sort by most recently updated
}
