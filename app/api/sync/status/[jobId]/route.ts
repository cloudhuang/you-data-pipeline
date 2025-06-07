// app/api/sync/status/[jobId]/route.ts
import { NextResponse } from 'next/server';
import { getJobStatus } from '@/lib/sync/job-store'; // Adjust path as needed

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId;
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
    }

    const status = getJobStatus(jobId);

    if (status) {
      return NextResponse.json(status);
    } else {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error fetching status for job ${params.jobId}:`, error);
    let errorMessage = 'Failed to fetch job status.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
