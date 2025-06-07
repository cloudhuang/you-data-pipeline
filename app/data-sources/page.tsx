"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// import DataSourceConfigurator from "@/app/data-sources/_components/data-source-configurator"; // Keep separate for now
import { PlusCircle, Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// Updated Mock Data with 'config'
const mockDataSources = [
  {
    id: "1",
    name: "Production DB",
    type: "Source",
    driver: "PostgreSQL",
    status: "Connected",
    config: { host: "db.example.com", port: 5432, user: "prod_user", dbname: "proddb" }
  },
  {
    id: "2",
    name: "Data Warehouse",
    type: "Target",
    driver: "Snowflake",
    status: "Connected",
    config: { account: "org.snowflakecomputing.com", warehouse: "COMPUTE_WH", user: "dw_user", db: "ANALYTICS" }
  },
  {
    id: "3",
    name: "CRM API",
    type: "Source",
    driver: "Salesforce",
    status: "Disconnected",
    config: { clientId: "xyz", clientSecret: "abc", domain: "mycompany.my.salesforce.com" }
  },
];

// Mock configurations for the other side of the sync
const MOCK_DEFAULT_TARGET_CONFIG = {
  driver: "DummyTarget",
  config: { endpoint: "https://target.example.com/api", apiKey: "target_api_key" }
};
const MOCK_DEFAULT_SOURCE_CONFIG = {
  driver: "DummySource",
  config: { connectionString: "dummy://user:pass@source.example.com/data" }
};


export default function DataSourcesPage() {
  const handleAddNewClick = () => {
    console.log("Add New Data Source button clicked. Navigation to configurator page would happen here.");
    toast.info("Navigating to Add New Data Source page...");
  };

  const handleSync = async (dataSource: any) => {
    if (dataSource.status === "Disconnected") {
      toast.error(`Data source "${dataSource.name}" is disconnected. Cannot sync.`);
      return;
    }

    toast.info(`Starting sync for ${dataSource.name}...`);

    let sourceConfig, targetConfig;
    if (dataSource.type === "Source") {
      sourceConfig = { driver: dataSource.driver, config: dataSource.config };
      targetConfig = MOCK_DEFAULT_TARGET_CONFIG;
    } else { // Target
      sourceConfig = MOCK_DEFAULT_SOURCE_CONFIG;
      targetConfig = { driver: dataSource.driver, config: dataSource.config };
    }

    const payload = {
      sourceConfig,
      targetConfig,
      syncType: "full", // Default to 'full' sync
      tableName: "public.users", // Mock table name for 'full' sync
      // For incremental, you would use something like:
      // syncType: "incremental",
      // options: { tableName: "public.orders", incrementalKeyColumn: "updated_at" }
    };

    try {
      const response = await fetch("/api/sync/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Sync started for ${dataSource.name}: ${result.message || 'Success'}. Job ID: ${result.jobId}`);
        console.log("Sync API call successful", result);
      } else {
        const errorResult = await response.json();
        toast.error(`Sync failed for ${dataSource.name}: ${errorResult.error || response.statusText}`);
        console.error("Sync API call failed", errorResult);
      }
    } catch (error) {
      toast.error(`Sync request failed for ${dataSource.name}: ${(error as Error).message}`);
      console.error("Sync request exception", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <Toaster richColors position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Sources</h1>
        <Button onClick={handleAddNewClick} className="bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Data Source
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[250px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {mockDataSources.map((ds) => (
              <TableRow key={ds.id} className="hover:bg-gray-50">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ds.name}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge
                    variant={ds.type === "Source" ? "default" : "secondary"}
                    className={ds.type === "Source" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}
                  >
                    {ds.type}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ds.driver}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge
                    variant={ds.status === "Connected" ? "outline" : "destructive"}
                    className={ds.status === "Connected" ? "border-green-500 text-green-700 bg-green-50" : "border-red-500 text-red-500 bg-red-50"}
                  >
                    {ds.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => handleSync(ds)}
                    disabled={ds.status === "Disconnected"}
                    title={ds.status === "Disconnected" ? "Cannot sync disconnected source" : "Sync Data Source"}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100" title="Edit Data Source">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" title="Delete Data Source">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/*
        The DataSourceConfigurator component is intended to be on a separate route
        or triggered by the "Add New Data Source" button.
      */}
    </main>
  );
}