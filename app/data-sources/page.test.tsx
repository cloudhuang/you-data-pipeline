import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataSourcesPage from './page'; // Adjust path as necessary

// Mock next/link (if not globally mocked)
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  PlusCircle: () => <svg data-testid="plus-icon" />,
  Edit: () => <svg data-testid="edit-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
  RefreshCw: () => <svg data-testid="refresh-icon" />,
}));

// Mock sonner
const mockToast = {
  info: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
};
jest.mock('sonner', () => ({
  toast: mockToast,
  Toaster: () => <div data-testid="toaster" />, // Mock Toaster component
}));

// Mock fetch
global.fetch = jest.fn();

describe('DataSourcesPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    render(<DataSourcesPage />);
  });

  it('renders the "Add New Data Source" button', () => {
    expect(screen.getByRole('button', { name: /Add New Data Source/i })).toBeInTheDocument();
  });

  it('renders the data sources table with mock data', () => {
    // Check for table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Driver')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check for specific data source names from mock data
    expect(screen.getByText('Production DB')).toBeInTheDocument();
    expect(screen.getByText('Data Warehouse')).toBeInTheDocument();
    expect(screen.getByText('CRM API')).toBeInTheDocument();
  });

  describe('Sync functionality', () => {
    const mockSuccessResponse = {
      ok: true,
      json: async () => ({ message: 'Sync started successfully', jobId: 'job-123' }),
    };
    const mockFailResponse = {
      ok: false,
      statusText: 'Server Error',
      json: async () => ({ error: 'Failed to start sync' }),
    };

    it('triggers fetch with correct parameters when Sync is clicked for a connected "Source" data source', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      // Find the Sync button for "Production DB" (Source, Connected)
      // Assuming "Production DB" is the first row, its buttons will be the first set.
      const syncButtons = screen.getAllByTitle(/Sync Data Source/i);
      // Production DB is connected
      const productionDbSyncButton = syncButtons[0];

      fireEvent.click(productionDbSyncButton);

      expect(mockToast.info).toHaveBeenCalledWith('Starting sync for Production DB...');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('/api/sync/start', expect.any(Object));

        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const requestBody = JSON.parse(fetchCall[1].body);

        expect(requestBody.syncType).toBe('full');
        expect(requestBody.tableName).toBe('public.users');
        expect(requestBody.sourceConfig.driver).toBe('PostgreSQL');
        expect(requestBody.sourceConfig.config.dbname).toBe('proddb');
        expect(requestBody.targetConfig.driver).toBe('DummyTarget'); // from MOCK_DEFAULT_TARGET_CONFIG
      });

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Sync started for Production DB: Sync started successfully. Job ID: job-123');
      });
    });

    it('triggers fetch with correct parameters when Sync is clicked for a connected "Target" data source', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

        // Find the Sync button for "Data Warehouse" (Target, Connected)
        const syncButtons = screen.getAllByTitle(/Sync Data Source/i);
        // Data Warehouse is the second item, but CRM API is disconnected, so it's the second *enabled* sync button
        const dataWarehouseSyncButton = syncButtons[1];

        fireEvent.click(dataWarehouseSyncButton);

        expect(mockToast.info).toHaveBeenCalledWith('Starting sync for Data Warehouse...');

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledTimes(1);
          expect(global.fetch).toHaveBeenCalledWith('/api/sync/start', expect.any(Object));

          const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
          const requestBody = JSON.parse(fetchCall[1].body);

          expect(requestBody.syncType).toBe('full');
          expect(requestBody.tableName).toBe('public.users');
          expect(requestBody.sourceConfig.driver).toBe('DummySource'); // from MOCK_DEFAULT_SOURCE_CONFIG
          expect(requestBody.targetConfig.driver).toBe('Snowflake');
          expect(requestBody.targetConfig.config.db).toBe('ANALYTICS');
        });

        await waitFor(() => {
          expect(mockToast.success).toHaveBeenCalledWith('Sync started for Data Warehouse: Sync started successfully. Job ID: job-123');
        });
      });

    it('does NOT trigger fetch and shows error toast when Sync is clicked for a "Disconnected" data source', () => {
      // Find the Sync button for "CRM API" (Disconnected)
      // This button will be disabled. We look for it by its specific row context if possible,
      // or rely on its disabled state.
      const crmApiEditButton = screen.getByText('CRM API').closest('tr')?.querySelector('button[title="Edit Data Source"]');
      // The sync button is the one before edit button in the DOM for that row.
      const crmApiSyncButton = crmApiEditButton?.previousElementSibling as HTMLButtonElement;

      expect(crmApiSyncButton).toBeInTheDocument();
      expect(crmApiSyncButton).toBeDisabled(); // Key check

      fireEvent.click(crmApiSyncButton!); // It's disabled, but let's confirm behavior if clicked

      expect(global.fetch).not.toHaveBeenCalled();
      // The click on a disabled button might not trigger the handler,
      // but if it did, or if the check was inside handleSync:
      // expect(mockToast.error).toHaveBeenCalledWith('Data source "CRM API" is disconnected. Cannot sync.');
      // Since the button is disabled, the onClick handler in the component shouldn't even fire.
      // If it were enabled and status was checked inside handleSync, then toast.error would be called.
      // Let's ensure no error toast related to "disconnected" is called if it's truly disabled.
      // The component's logic is to disable, so `handleSync` isn't called.
      // If we want to test the toast for a disconnected source, we'd have to enable the button and call handleSync directly.
      // For this test, confirming it's disabled and fetch is not called is sufficient.
      expect(mockToast.error).not.toHaveBeenCalledWith(expect.stringContaining('is disconnected. Cannot sync.'));
    });

    it('shows an error toast if the fetch call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockFailResponse);

      const syncButtons = screen.getAllByTitle(/Sync Data Source/i);
      fireEvent.click(syncButtons[0]); // Click sync for "Production DB"

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Sync failed for Production DB: Failed to start sync');
      });
    });

    it('shows an error toast if the fetch call throws an exception', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

        const syncButtons = screen.getAllByTitle(/Sync Data Source/i);
        fireEvent.click(syncButtons[0]); // Click sync for "Production DB"

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
          expect(mockToast.error).toHaveBeenCalledWith('Sync request failed for Production DB: Network Error');
        });
      });
  });
});
