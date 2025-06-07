// app/api/sync/start/route.ts
import { NextResponse } from 'next/server';
import { executeFullLoad, DbConnectionConfig as FullLoadDbConfig, FullLoadOptions } from '@/lib/sync/full-load';
import { executeIncrementalLoad, DbConnectionConfig as IncLoadDbConfig, IncrementalLoadOptions } from '@/lib/sync/incremental-load';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Note: sourceConfig and targetConfig can be typed more broadly if shared,
    // or use type assertion/validation if specific fields are expected by loads.
    const { sourceConfig, targetConfig, syncType, tableName, options } = body as {
      sourceConfig: FullLoadDbConfig | IncLoadDbConfig, // Use a union type or a base config type
      targetConfig: FullLoadDbConfig | IncLoadDbConfig,
      syncType: 'full' | 'incremental' | string,
      tableName?: string, // Used by full load primarily, and potentially by incremental if not in options
      options?: FullLoadOptions | IncrementalLoadOptions // Options for respective loads
    };

    if (!sourceConfig || !targetConfig || !syncType) {
      return NextResponse.json({ error: 'Missing required parameters: sourceConfig, targetConfig, syncType' }, { status: 400 });
    }

    const jobId = `job-${Date.now()}`;
    console.log(`Sync request received for type "${syncType}" (Job ID: ${jobId}):`);
    console.log('Source Config:', JSON.stringify(sourceConfig));
    console.log('Target Config:', JSON.stringify(targetConfig));
    // Only log tableName if it's relevant for the syncType
    if (syncType === 'full' && tableName) console.log('Table Name (for full load):', tableName);
    if (options) console.log('Options:', JSON.stringify(options));


    if (syncType === 'full') {
      if (!tableName) { // tableName is required for full load
        return NextResponse.json({ error: 'Missing tableName for full sync type' }, { status: 400 });
      }
      // Ensure options is correctly typed for executeFullLoad or undefined
      const fullLoadOpts = options as FullLoadOptions | undefined;

      executeFullLoad(jobId, sourceConfig, targetConfig, tableName, fullLoadOpts)
        .then(result => console.log(`Full load for job ${jobId} on table ${tableName} completed:`, JSON.stringify(result)))
        .catch(err => {
          let errorMessage = 'Full load execution failed.';
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          console.error(`Error in full load for job ${jobId} on table ${tableName}:`, errorMessage, err)
        });

      return NextResponse.json({
        message: `Full synchronization process started for table ${tableName}.`,
        jobId: jobId
      });
    } else if (syncType === 'incremental') {
      const incrementalOpts = options as IncrementalLoadOptions;
      // For incremental, tableName and incrementalKeyColumn are typically part of options.
      if (!incrementalOpts || !incrementalOpts.tableName || !incrementalOpts.incrementalKeyColumn) {
         return NextResponse.json({ error: 'Missing options (tableName, incrementalKeyColumn) for incremental sync type' }, { status: 400 });
      }
      executeIncrementalLoad(jobId, sourceConfig, targetConfig, incrementalOpts)
        .then(result => console.log(`Incremental load for job ${jobId} on table ${incrementalOpts.tableName} completed:`, JSON.stringify(result)))
        .catch(err => {
          let errorMessage = 'Incremental load execution failed.';
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          console.error(`Error in incremental load for job ${jobId} on table ${incrementalOpts.tableName}:`,errorMessage, err)
        });

      return NextResponse.json({
        message: `Incremental synchronization process started for table ${incrementalOpts.tableName}.`,
        jobId: jobId
      });
    } else {
      return NextResponse.json({ error: `Invalid syncType specified: ${syncType}` }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing sync request in API route:', error);
    let errorMessage = 'Failed to start synchronization.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
