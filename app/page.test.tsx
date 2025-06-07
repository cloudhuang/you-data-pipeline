import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './page'; // Adjust path as necessary

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Database: () => <svg data-testid="db-icon" />,
  Workflow: () => <svg data-testid="workflow-icon" />,
  Building: () => <svg data-testid="building-icon" />,
  LayoutDashboard: () => <svg data-testid="layout-dashboard-icon" />,
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    render(<DashboardPage />);
  });

  it('renders the main welcome message', () => {
    expect(screen.getByText('欢迎回来!')).toBeInTheDocument();
    expect(screen.getByText('这是您的数据管道仪表盘。')).toBeInTheDocument();
  });

  it('renders the quick statistics section with correct labels', () => {
    expect(screen.getByText('数据源')).toBeInTheDocument();
    expect(screen.getByText('当前配置的数据源数量')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Example value

    expect(screen.getByText('同步任务')).toBeInTheDocument();
    expect(screen.getByText('正在运行的同步任务')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument(); // Example value

    expect(screen.getByText('组织')).toBeInTheDocument();
    expect(screen.getByText('当前组织数量')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Example value
  });

  it('renders quick links with correct href attributes', () => {
    const dataSourceLink = screen.getByRole('link', { name: /管理数据源/i });
    expect(dataSourceLink).toBeInTheDocument();
    expect(dataSourceLink).toHaveAttribute('href', '/data-sources');

    const workflowDesignerLink = screen.getByRole('link', { name: /工作流设计器/i });
    expect(workflowDesignerLink).toBeInTheDocument();
    expect(workflowDesignerLink).toHaveAttribute('href', '/workflow');

    const taskManagementLink = screen.getByRole('link', { name: /任务管理/i });
    expect(taskManagementLink).toBeInTheDocument();
    expect(taskManagementLink).toHaveAttribute('href', '/settings');
  });
});
