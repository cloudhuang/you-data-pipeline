// lib/sync/incremental-load.ts
import fs from 'fs';
import path from 'path';
import { initJob, updateJobStatus } from './job-store'; // Import job store functions

// Re-use or define interfaces as needed
export interface DbConnectionConfig {
  type: 'mysql' | 'postgres' | 'file' | 'api' | string; // Allow string for flexibility
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  filePath?: string;
  format?: string;
  url?: string;
  method?: string;
  authType?: string;
  // Potentially other config options
  name?: string; // Name of the source/target node
  connectionString?: string; // from pipeline-flow
}

export interface IncrementalLoadOptions {
  tableName: string;
  incrementalKeyColumn: string; // e.g., 'updated_at' or 'id'
  targetTableName?: string; // If different from source
  batchSize?: number;
}

interface IncrementalCheckpointData {
  lastValue: any; // Can be a timestamp (string/number) or an ID (number)
  lastSyncTimestamp: string;
}

const CHECKPOINTS_DIR = path.resolve(process.cwd(), 'checkpoints');
// Ensure checkpoints directory exists (might be redundant if full-load also does this, but safe)
if (!fs.existsSync(CHECKPOINTS_DIR)) {
  fs.mkdirSync(CHECKPOINTS_DIR, { recursive: true });
  console.log(`Created checkpoints directory (by incremental-load): ${CHECKPOINTS_DIR}`);
}

// Simulated DB functions (similar to full-load, adapt as needed)
async function querySourceIncrementally(
  sourceConfig: DbConnectionConfig,
  tableName: string,
  keyColumn: string,
  lastValue: any,
  batchSize: number
): Promise<any[]> {
  console.log(`Simulating incremental query on ${tableName} where ${keyColumn} > "${lastValue}" (batch: ${batchSize}) from ${sourceConfig.type} at ${sourceConfig.host || sourceConfig.filePath || sourceConfig.url}`);
  // Simulate fetching new records.
  // In a real scenario, the query would be like:
  // SELECT * FROM ${tableName} WHERE ${keyColumn} > ? ORDER BY ${keyColumn} ASC LIMIT ?
  // For timestamp-based, ensure proper handling of timezones and precision.
  // For ID-based, it's straightforward.

  // Simulate some new data
  let startId = 0;
  if (typeof lastValue === 'number') {
    startId = lastValue + 1;
  } else if (typeof lastValue === 'string' && !isNaN(Date.parse(lastValue))) { // basic ISO date string check
    startId = Math.floor(new Date(lastValue).getTime() / 1000) + 1; // example: use seconds timestamp
  } else if (lastValue === null || lastValue === undefined) {
    startId = 1; // Default starting point if no checkpoint
  } else {
    console.warn(`Unsupported lastValue type: ${typeof lastValue}. Defaulting to fetching from beginning/small numbers.`);
    startId = 1;
  }

  // Simulate limited number of new records for demo
  const newRecordsCount = Math.floor(Math.random() * (Math.min(batchSize, 5) + 1)); // 0 to 5 (or batchSize) new records
  if (newRecordsCount === 0) return [];

  return Array(newRecordsCount).fill(0).map((_, i) => {
    const currentVal = startId + i;
    const record: any = {
      name: `Incremental Record ${currentVal}`,
      updated_at: new Date().toISOString(),
    };
    // Ensure the keyColumn has the incrementing value
    record[keyColumn] = currentVal;
    // Add an 'id' if it's not the keyColumn, common for DB tables
    if (keyColumn !== 'id') {
        record.id = currentVal; // Or some other unique identifier
    }
    return record;
  });
}

async function upsertBatch(
  targetConfig: DbConnectionConfig,
  tableName: string,
  keyColumn: string, // Primary key or unique key for upsert
  data: any[]
): Promise<void> {
  if (data.length === 0) {
    console.log(`Simulating upsertBatch: No data to upsert into ${tableName} at ${targetConfig.host || targetConfig.filePath || targetConfig.url}`);
    return;
  }
  console.log(`Simulating upsertBatch of ${data.length} records into ${tableName} (key: ${keyColumn}) at ${targetConfig.host || targetConfig.filePath || targetConfig.url}`);
  // In a real implementation, this would perform an INSERT ... ON CONFLICT ... UPDATE or MERGE operation.
}

class IncrementalCheckpointManager {
  private jobId: string;
  private checkpointFile: string;

  constructor(jobId: string) { // e.g., "inc_load_sourceDb_sourceTable_to_targetDb_targetTable_incrementalKey"
    this.jobId = jobId;
    this.checkpointFile = path.join(CHECKPOINTS_DIR, `${this.jobId}.json`);
  }

  async saveCheckpoint(data: IncrementalCheckpointData): Promise<void> {
    console.log(`Saving incremental checkpoint for ${this.jobId}: ${JSON.stringify(data)} to ${this.checkpointFile}`);
    try {
      fs.writeFileSync(this.checkpointFile, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(`Failed to save incremental checkpoint for ${this.jobId}:`, err);
    }
  }

  async getLastCheckpoint(): Promise<IncrementalCheckpointData | null> {
    console.log(`Retrieving last incremental checkpoint for ${this.jobId} from ${this.checkpointFile}`);
    if (fs.existsSync(this.checkpointFile)) {
      const fileData = fs.readFileSync(this.checkpointFile, 'utf-8');
      try {
        return JSON.parse(fileData) as IncrementalCheckpointData;
      } catch (e) {
        console.error(`Error parsing checkpoint file ${this.checkpointFile}:`, e);
        return null;
      }
    }
    return null;
  }
}

export async function executeIncrementalLoad(
  jobId: string, // A unique identifier for this specific incremental load job
  sourceConfig: DbConnectionConfig,
  targetConfig: DbConnectionConfig,
  options: IncrementalLoadOptions
): Promise<any> {
  initJob(jobId);
  updateJobStatus(jobId, {
    status: 'running',
    message: `Initializing incremental load for table ${options.tableName}, key: ${options.incrementalKeyColumn}...`,
    progress: 0
  });

  try {
    console.log(`=== EXECUTING INCREMENTAL LOAD (Job ID: ${jobId}) ===`);
    console.log('Source Config:', JSON.stringify(sourceConfig));
    console.log('Target Config:', JSON.stringify(targetConfig));
    console.log('Options:', JSON.stringify(options));

    const { tableName, incrementalKeyColumn, targetTableName, batchSize = 1000 } = options;
    const effectiveTargetTable = targetTableName || tableName;

    if (!tableName || !incrementalKeyColumn) {
      const errorMsg = 'tableName and incrementalKeyColumn must be provided for incremental load.';
      console.error(errorMsg);
      updateJobStatus(jobId, { status: 'failed', message: errorMsg, progress: 0 });
      throw new Error(errorMsg);
    }

    const checkpointManager = new IncrementalCheckpointManager(`inc_load_${jobId}_${sourceConfig.name || 'source'}_${tableName}_${targetConfig.name || 'target'}_${effectiveTargetTable}_${incrementalKeyColumn}`);
    const lastCheckpoint = await checkpointManager.getLastCheckpoint();

    let currentLastValue = lastCheckpoint ? lastCheckpoint.lastValue : null;

    if (currentLastValue === null) {
      updateJobStatus(jobId, { message: `No checkpoint for ${tableName}, key ${incrementalKeyColumn}. Starting fresh or from default.`, progress: 0 });
      console.log(`No checkpoint found for job path ${checkpointManager['checkpointFile']}. This might be the first run or requires an initial full load baseline. Defaulting to fetching initial data.`);
    } else {
      updateJobStatus(jobId, { message: `Resuming incremental load for ${tableName} from last value: ${currentLastValue}.`, progress: 0 });
      console.log(`Resuming incremental load from lastValue: ${currentLastValue}`);
    }

    let totalProcessedThisRun = 0;
    let newMaxKeyValue = currentLastValue;

    for (let i = 0; i < 100; i++) { // Safety break for simulation
      updateJobStatus(jobId, {
        status: 'running',
        message: `Fetching batch for ${tableName}, key > ${newMaxKeyValue === null ? 'start' : newMaxKeyValue }...`,
        progress: totalProcessedThisRun
      });
      const dataBatch = await querySourceIncrementally(
        sourceConfig, tableName, incrementalKeyColumn, newMaxKeyValue, batchSize
      );

      if (dataBatch.length === 0) {
        updateJobStatus(jobId, { message: `No new data found for ${tableName} in this batch. Current records processed: ${totalProcessedThisRun}.` });
        console.log('No new data found in this batch. Incremental load cycle complete for now.');
        break;
      }

      const batchMaxKeyValueCandidate = dataBatch[dataBatch.length - 1][incrementalKeyColumn];
      if (batchMaxKeyValueCandidate === undefined || batchMaxKeyValueCandidate === null) {
          const errorMsg = `Incremental key column '${incrementalKeyColumn}' not found in fetched data or its value is null.`;
          console.error(`Error: ${errorMsg} Stopping.`);
          updateJobStatus(jobId, { status: 'failed', message: errorMsg });
          throw new Error(errorMsg);
      }

      if (newMaxKeyValue !== null && batchMaxKeyValueCandidate <= newMaxKeyValue) {
          const warnMsg = `New max key value (${batchMaxKeyValueCandidate}) for ${tableName} is not greater than previous max key value (${newMaxKeyValue}). Stopping.`;
          console.warn(warnMsg);
          updateJobStatus(jobId, { status: 'failed', message: warnMsg });
          await checkpointManager.saveCheckpoint({ lastValue: newMaxKeyValue, lastSyncTimestamp: new Date().toISOString() });
          break;
      }

      updateJobStatus(jobId, { message: `Upserting batch of ${dataBatch.length} records for ${tableName}...`, progress: totalProcessedThisRun });
      const upsertKeyColumn = (dataBatch[0] && dataBatch[0].hasOwnProperty('id')) ? 'id' : incrementalKeyColumn;
      await upsertBatch(targetConfig, effectiveTargetTable, upsertKeyColumn, dataBatch);

      totalProcessedThisRun += dataBatch.length;
      newMaxKeyValue = batchMaxKeyValueCandidate;

      await checkpointManager.saveCheckpoint({ lastValue: newMaxKeyValue, lastSyncTimestamp: new Date().toISOString() });
      console.log(`Processed batch of ${dataBatch.length}. New max key for ${incrementalKeyColumn}: ${newMaxKeyValue}. Total this run: ${totalProcessedThisRun}`);
      updateJobStatus(jobId, {
        message: `Processed batch for ${tableName}. New max key: ${newMaxKeyValue}. Total this run: ${totalProcessedThisRun}`,
        progress: totalProcessedThisRun
      });

      if (totalProcessedThisRun >= (batchSize * 5) && process.env.NODE_ENV !== 'production') {
           console.warn(`SIMULATION: Reached processing limit for ${tableName}. Stopping.`);
           break;
      }
      if (i === 99) console.warn("SIMULATION: Reached maximum batch iteration limit for ${tableName}.");
    }

    const finalMessage = `Incremental load for job ${jobId} on table ${tableName} (key: ${incrementalKeyColumn}) processed ${totalProcessedThisRun} records in this run. Last key: ${newMaxKeyValue}.`;
    console.log(finalMessage);
    const resultObject = {
      jobId,
      sourceTable: tableName,
      targetTable: effectiveTargetTable,
      incrementalKey: incrementalKeyColumn,
      processedRecordsThisRun: totalProcessedThisRun,
      lastValuePersisted: newMaxKeyValue,
      status: totalProcessedThisRun > 0 ? 'processed_data' : 'no_new_data'
    };
    updateJobStatus(jobId, {
      status: 'completed',
      message: finalMessage,
      progress: totalProcessedThisRun,
      result: resultObject
    });
    return resultObject;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error during incremental load for job ${jobId}, table ${options.tableName}:`, errorMessage);
    updateJobStatus(jobId, { status: 'failed', message: `Incremental load failed: ${errorMessage}` });
    throw error;
  }
}
