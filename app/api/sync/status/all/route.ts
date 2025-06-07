// app/api/sync/status/all/route.ts
import { NextResponse } from 'next/server';
import { getAllJobStatuses } from '@/lib/sync/job-store'; // Adjust path

export async function GET() {
  try {
    const statuses = getAllJobStatuses();
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Error fetching all job statuses:', error);
    let errorMessage = 'Failed to fetch all job statuses.';
    if (error instanceof Error) {
        errorMessage = error.message;
    } // In case the error is not an Error instance
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
