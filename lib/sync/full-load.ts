// lib/sync/full-load.ts
import fs from "fs";
import path from "path";
import { initJob, updateJobStatus } from "./job-store"; // Import job store functions

// Define interfaces (DbConnectionConfig, TableInfo, CheckpointData, FullLoadOptions etc.)
export interface DbConnectionConfig {
  type: "mysql" | "postgres" | "file" | "api" | string; // Allow other DB types or string for flexibility
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  // For file types
  filePath?: string;
  format?: string; // e.g., 'CSV', 'JSON', 'Parquet'
  // For API types
  url?: string;
  method?: string; // e.g., 'GET', 'POST'
  authType?: string; // e.g., 'None', 'API Key', 'OAuth 2.0'
  // Potentially other config like connectionString for JDBC from pipeline-flow
  connectionString?: string;
  name?: string; // Name of the source/target node
}

export interface TableInfo {
  name: string;
  primaryKey: string;
  estimatedRows: number;
  columns: string[];
}

export interface CheckpointData {
  lastId?: number | string; // Primary key can be string or number
  timestamp?: string;
  processedChunks?: number;
  currentChunkOffset?: number; // For non-PK based chunking
  // other checkpoint fields
}

export interface FullLoadOptions {
  chunkSize?: number;
  concurrency?: number;
  useCompression?: boolean;
  // Add other options as needed
}

const CHECKPOINTS_DIR = path.resolve(process.cwd(), "checkpoints");
if (!fs.existsSync(CHECKPOINTS_DIR)) {
  fs.mkdirSync(CHECKPOINTS_DIR, { recursive: true });
  console.log(`Created checkpoints directory: ${CHECKPOINTS_DIR}`);
}

// Simulated DB functions (to be replaced with real implementations)
async function getTableInfo(
  sourceConfig: DbConnectionConfig,
  tableName: string
): Promise<TableInfo> {
  console.log(
    `Simulating getTableInfo for ${tableName} at ${
      sourceConfig.host || sourceConfig.filePath || sourceConfig.url
    }`
  );
  // Simulate based on sourceConfig.type if needed
  // In a real scenario, this would connect to the source and fetch metadata.
  // For file types, it might involve reading headers or schema files.
  // For API types, this might be predefined or fetched from a schema endpoint.

  // Default basic table info
  let primaryKey = "id";
  let estimatedRows = 1000000;
  let columns = ["id", "name", "created_at", "updated_at", "value1", "value2"];

  if (sourceConfig.type === "file") {
    primaryKey = "line_number"; // Or inferred from data if possible
    estimatedRows = 10000; // Could be estimated by file size
    columns = ["col1", "col2", "col3", "col4"]; // Or from CSV header
  } else if (sourceConfig.type === "api") {
    primaryKey = "id"; // Common for APIs
    estimatedRows = 50000; // Could be based on pagination info if available
    columns = ["id", "fieldA", "fieldB", "timestamp"];
  }

  return {
    name: tableName,
    primaryKey: primaryKey,
    estimatedRows: estimatedRows,
    columns: columns,
  };
}

async function query(
  sourceConfig: DbConnectionConfig,
  sql: string,
  params?: any[]
): Promise<any[]> {
  console.log(
    `Simulating query "${sql}" with params ${JSON.stringify(params)} at ${
      sourceConfig.host || sourceConfig.filePath || sourceConfig.url
    }`
  );
  // Simulate based on sourceConfig.type if needed
  // For file type, 'sql' could be an abstraction for reading a chunk of the file.
  // For API type, 'sql' could be an abstraction for an API request with pagination parameters.
  const recordsPerPage =
    params && params.length > 1 ? params[1] - params[0] : 10; // Approximate from limit/offset or chunkSize

  return Array(recordsPerPage)
    .fill(0)
    .map((_, i) => {
      const record: any = {};
      const baseId = params && params.length > 0 ? params[0] : 0;
      record.id = baseId + i;
      record.name = `Record ${baseId + i}`;
      record.created_at = new Date().toISOString();
      record.updated_at = new Date().toISOString();
      record.value1 = Math.random() * 100;
      record.value2 = `Text value ${Math.random().toString(36).substring(7)}`;
      return record;
    });
}

// Target 'db' functions (simulated)
async function insertBatch(
  targetConfig: DbConnectionConfig,
  tableName: string,
  data: any[]
): Promise<void> {
  if (data.length === 0) {
    console.log(
      `Skipping insertBatch for ${tableName} at ${
        targetConfig.host || targetConfig.filePath || targetConfig.url
      } as data is empty.`
    );
    return;
  }
  console.log(
    `Simulating insertBatch of ${data.length} records into ${tableName} at ${
      targetConfig.host || targetConfig.filePath || targetConfig.url
    }`
  );
  // In a real implementation, this would connect to the target and insert data.
  // For file types, it would append to the file.
  // For API types, it might POST data to an endpoint.
}

class CheckpointManager {
  private jobId: string;
  private checkpointFile: string;

  constructor(jobId: string) {
    this.jobId = jobId; // Full job ID, e.g., full_load_job123_customers
    this.checkpointFile = path.join(CHECKPOINTS_DIR, `${this.jobId}.json`);
  }

  async saveCheckpoint(position: CheckpointData): Promise<void> {
    console.log(
      `Saving checkpoint for ${this.jobId} at position: ${JSON.stringify(
        position
      )} to ${this.checkpointFile}`
    );
    // Using sync file write for simplicity in this simulation, but async is preferred in real scenarios
    try {
      fs.writeFileSync(this.checkpointFile, JSON.stringify(position, null, 2));
    } catch (err) {
      console.error(`Failed to save checkpoint for ${this.jobId}:`, err);
      // Decide if this error should propagate or be handled (e.g., retry)
    }
  }

  async getLastCheckpoint(): Promise<CheckpointData | null> {
    console.log(
      `Retrieving last checkpoint for ${this.jobId} from ${this.checkpointFile}`
    );
    try {
      if (fs.existsSync(this.checkpointFile)) {
        const data = fs.readFileSync(this.checkpointFile, "utf-8");
        return JSON.parse(data) as CheckpointData;
      }
    } catch (err) {
      console.error(
        `Failed to read or parse checkpoint for ${this.jobId}:`,
        err
      );
      // Decide how to handle (e.g., start fresh, or throw)
    }
    return null;
  }
}

async function parallelTableExtraction(
  jobId: string, // Base jobId, will be augmented with table name for checkpointing
  sourceConfig: DbConnectionConfig,
  targetConfig: DbConnectionConfig,
  tableName: string,
  options: FullLoadOptions = {}
): Promise<{
  table: string;
  totalRecords: number;
  processedRecords: number;
  status: string;
}> {
  console.log(
    `Starting parallel extraction for table: ${tableName} from source: ${sourceConfig.type} to target: ${targetConfig.type}`
  );
  const tableInfo = await getTableInfo(sourceConfig, tableName);
  console.log(`Table info: ${JSON.stringify(tableInfo)}`);

  const chunkSize = options.chunkSize || 10000; // Number of records per chunk
  let totalChunks = 0;
  if (tableInfo.estimatedRows > 0) {
    totalChunks = Math.ceil(tableInfo.estimatedRows / chunkSize);
  }

  if (tableInfo.estimatedRows === 0) {
    console.log(
      `Table ${tableName} is empty or estimated rows is 0. Skipping extraction.`
    );
    // Though executeFullLoad might have already set progress, this ensures a specific message for empty tables.
    updateJobStatus(jobId, {
      message: `Table ${tableName} is empty, no records to extract.`,
      progress: 100,
    });
    return {
      table: tableName,
      totalRecords: 0,
      processedRecords: 0,
      status: "complete",
    };
  }
  totalChunks = Math.ceil(tableInfo.estimatedRows / chunkSize);
  console.log(
    `Processing ${tableInfo.estimatedRows} rows in ${totalChunks} chunks of ${chunkSize}`
  );

  const checkpointManager = new CheckpointManager(
    `full_load_${jobId}_${tableName}`
  );
  const lastCheckpoint = await checkpointManager.getLastCheckpoint();

  let startPosition = 0; // This is the starting primary key value for the first chunk
  if (lastCheckpoint && typeof lastCheckpoint.lastId === "number") {
    console.log(`Resuming from checkpoint: ${JSON.stringify(lastCheckpoint)}`);
    startPosition = lastCheckpoint.lastId; // Resume after the last successfully processed ID
  } else if (lastCheckpoint && typeof lastCheckpoint.lastId === "string") {
    // Handle string based PKs if necessary, or ensure PK is numeric for this strategy
    console.warn(
      "String primary key checkpoint resume not fully implemented in simulation. Starting from beginning."
    );
  }

  const processChunk = async (
    chunkStartId: number | string,
    currentChunkSize: number
  ) => {
    // For numeric PKs. String PKs or no PKs would need a different strategy (e.g. offset-based)
    if (typeof chunkStartId !== "number") {
      console.error(
        "This simulated chunk processing requires a numeric start ID."
      );
      return 0;
    }
    const chunkEndId = chunkStartId + currentChunkSize;
    console.log(
      `Processing chunk for PK range from ${chunkStartId} to < ${chunkEndId}`
    );

    const sql = `SELECT * FROM ${tableInfo.name} WHERE ${tableInfo.primaryKey} >= ? AND ${tableInfo.primaryKey} < ? ORDER BY ${tableInfo.primaryKey}`;
    const data = await query(sourceConfig, sql, [chunkStartId, chunkEndId]);

    if (options.useCompression && data.length > 0) {
      console.log("Simulating ZSTD compression for chunk data");
      // Actual compression would happen here
    }

    await insertBatch(targetConfig, tableInfo.name, data);

    // Checkpoint the end of the successfully processed chunk (the next ID to start from)
    await checkpointManager.saveCheckpoint({
      lastId: chunkEndId,
      timestamp: new Date().toISOString(),
    });
    return data.length;
  };

  let totalProcessed = 0;
  // Simplified loop for demonstration. Real implementation needs robust concurrency control (e.g., using a pool of workers).
  // This loop assumes PK is numeric and auto-incrementing or at least continuously increasing.
  let chunksProcessed = 0;
  for (let currentId = startPosition; currentId < tableInfo.estimatedRows; ) {
    // If startPosition came from a checkpoint, currentId is already set to where we left off.
    // We calculate how many records have been processed based on startPosition for logging purposes.
    // totalProcessed will track records processed in this run.

    // Check if estimatedRows is positive to prevent infinite loop on bad data
    if (tableInfo.estimatedRows <= 0) break;

    const remainingRows = tableInfo.estimatedRows - currentId;
    const currentChunkSize = Math.min(chunkSize, remainingRows);

    if (currentChunkSize <= 0) break; // No more rows to process

    const processedInChunk = await processChunk(currentId, currentChunkSize);
    totalProcessed += processedInChunk;
    chunksProcessed++;

    // Update job status with progress
    if (totalChunks > 0) {
      const progressPercentage = Math.min(
        99,
        Math.round((chunksProcessed / totalChunks) * 100)
      ); // Cap at 99 until truly done
      updateJobStatus(jobId, {
        status: "running",
        message: `Processed chunk ${chunksProcessed}/${totalChunks} for table ${tableName}. Total records processed in run: ${totalProcessed}.`,
        progress: progressPercentage,
      });
    } else {
      // This case should ideally not be hit if tableInfo.estimatedRows > 0
      updateJobStatus(jobId, {
        status: "running",
        message: `Processed ${totalProcessed} records for table ${tableName} (chunk progress unavailable).`,
      });
    }

    if (
      processedInChunk < currentChunkSize &&
      currentId + processedInChunk < tableInfo.estimatedRows
    ) {
      // This might happen if query returns less than expected.
      // For PK-based, we should advance by what was actually processed if PKs are dense.
      // However, the simple query `PK >= start AND PK < end` assumes `end` is the next checkpoint.
      // If data is sparse, this is fine. If dense, and `processedInChunk` is less, it means we hit the end of table earlier than estimated.
      console.warn(
        `Chunk for PK range ${currentId} to ${
          currentId + currentChunkSize
        } returned ${processedInChunk} records. Expected up to ${currentChunkSize}.`
      );
      // The checkpoint is based on `chunkEndId` (which is `currentId + currentChunkSize`), so this is consistent.
    }

    currentId += currentChunkSize; // Advance to the start of the next chunk

    if (currentId >= tableInfo.estimatedRows) break;
  }
  // Recalculate records processed *in this specific execution* if resuming
  // The 'totalProcessed' here is just for this run.
  // A more accurate 'overallProcessed' would consider startPosition.
  let overallProcessedSinceStart = startPosition + totalProcessed;

  console.log(
    `Processed ${totalProcessed} records for table ${tableName} in this run.`
  );
  console.log(
    `Overall progress: ${overallProcessedSinceStart} / ${tableInfo.estimatedRows} records for table ${tableName}.`
  );

  return {
    table: tableName,
    totalRecords: tableInfo.estimatedRows,
    processedRecords: overallProcessedSinceStart, // Report total progress against estimated rows
    status:
      overallProcessedSinceStart >= tableInfo.estimatedRows
        ? "complete"
        : "partial",
  };
}

export async function executeFullLoad(
  jobId: string,
  sourceConfig: DbConnectionConfig,
  targetConfig: DbConnectionConfig,
  tableName: string,
  options?: FullLoadOptions
): Promise<any> {
  // Return type can be more specific
  initJob(jobId);
  updateJobStatus(jobId, {
    status: "running",
    message: `Initializing full load for table ${tableName}...`,
    progress: 0,
  });

  try {
    console.log(`=== EXECUTING FULL LOAD (Job ID: ${jobId}) ===`);
    console.log("Source Config:", JSON.stringify(sourceConfig));
    console.log("Target Config:", JSON.stringify(targetConfig));
    console.log("Table Name:", tableName);
    console.log("Options:", JSON.stringify(options));

    if (!tableName) {
      const errorMsg = "Table name must be provided for full load.";
      console.error(errorMsg);
      updateJobStatus(jobId, {
        status: "failed",
        message: errorMsg,
        progress: 0,
      });
      throw new Error(errorMsg);
    }

    updateJobStatus(jobId, {
      status: "running",
      message: `Starting extraction for table ${tableName}...`,
      progress: 5,
    });
    // Here, you could add logic to fetch a list of tables from sourceConfig if not syncing a single table
    // For now, we proceed with the given tableName.

    const result = await parallelTableExtraction(
      jobId,
      sourceConfig,
      targetConfig,
      tableName,
      options
    );

    const finalMessage = `Full load for table ${tableName} completed. Processed ${result.processedRecords} out of estimated ${result.totalRecords} records.`;
    console.log(
      `Full load result for ${tableName}: ${JSON.stringify(result, null, 2)}`
    );
    updateJobStatus(jobId, {
      status: "completed",
      message: finalMessage,
      progress: 100,
      result: result,
    });

    // You might want to return more comprehensive results, e.g., for multiple tables
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `Error during full load for job ${jobId}, table ${tableName}:`,
      errorMessage
    );
    updateJobStatus(jobId, {
      status: "failed",
      message: `Full load failed: ${errorMessage}`,
      progress: 0,
    }); // Assuming progress is 0 or last known if error occurs
    throw error; // Re-throw the error so the caller (API route) can also be aware
  }
}
