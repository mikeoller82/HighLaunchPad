/**
 * Analytics Dashboard
 * Data visualization and reporting for analytics insights
 */

export interface DashboardConfig {
  enabled: boolean;
  defaultTimeRange: TimeRange;
  refreshInterval: number; // seconds
  widgets: DashboardWidgetConfig[];
}

export interface TimeRange {
  start: Date;
  end: Date;
  preset: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'last_90_days' | 'custom';
}

export interface DashboardWidgetConfig {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'heatmap';
  title: string;
  dataSource: string;
  dimensions: string[];
  metrics: string[];
  filters?: Record<string, any>;
  visualization: VisualizationConfig;
}

export interface VisualizationConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'funnel' | 'table';
  colors?: string[];
  options?: Record<string, any>;
}

export interface DashboardWidget {
  id: string;
  title: string;
  data: any;
  updatedAt: Date;
  loading: boolean;
  error?: string;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  timeRange: TimeRange;
  widgets: DashboardWidget[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricsData {
  visits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  revenue: number;
  goalCompletions: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export class AnalyticsDashboard {
  private config: DashboardConfig;
  private widgets: Map<string, DashboardWidget> = new Map();
  private refreshTimer: any = null;
  private activeReports: Map<string, AnalyticsReport> = new Map();
  
  constructor(config: DashboardConfig) {
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    if (!this.config.enabled) return;
    
    // Initialize widgets
    for (const widgetConfig of this.config.widgets) {
      const widget: DashboardWidget = {
        id: widgetConfig.id,
        title: widgetConfig.title,
        data: null,
        updatedAt: new Date(),
        loading: true
      };
      
      this.widgets.set(widget.id, widget);
    }
    
    // Load initial data
    await this.refreshAllWidgets();
    
    // Set up auto-refresh if configured
    if (this.config.refreshInterval > 0) {
      this.refreshTimer = setInterval(() => {
        this.refreshAllWidgets();
      }, this.config.refreshInterval * 1000);
    }
  }
  
  destroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
  
  async refreshWidget(widgetId: string): Promise<void> {
    const widget = this.widgets.get(widgetId);
    if (!widget) return;
    
    widget.loading = true;
    widget.error = undefined;
    
    try {
      // Fetch data based on widget type and configuration
      const data = await this.fetchWidgetData(widgetId);
      widget.data = data;
      widget.updatedAt = new Date();
    } catch (error) {
      widget.error = error instanceof Error ? error.message : 'Failed to load data';
    } finally {
      widget.loading = false;
    }
  }
  
  async refreshAllWidgets(): Promise<void> {
    const widgetIds = Array.from(this.widgets.keys());
    await Promise.all(widgetIds.map(id => this.refreshWidget(id)));
  }
  
  getWidget(widgetId: string): DashboardWidget | undefined {
    return this.widgets.get(widgetId);
  }
  
  getAllWidgets(): DashboardWidget[] {
    return Array.from(this.widgets.values());
  }
  
  getConfig(): DashboardConfig {
    return { ...this.config };
  }
  
  updateConfig(config: Partial<DashboardConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart refresh timer if interval changed
    if (config.refreshInterval !== undefined && this.refreshTimer) {
      clearInterval(this.refreshTimer);
      if (config.refreshInterval > 0) {
        this.refreshTimer = setInterval(() => {
          this.refreshAllWidgets();
        }, config.refreshInterval * 1000);
      }
    }
  }
  
  async createReport(config: {
    name: string;
    description: string;
    timeRange: TimeRange;
    widgetIds: string[];
  }): Promise<AnalyticsReport> {
    const widgets = config.widgetIds
      .map(id => this.widgets.get(id))
      .filter(widget => widget !== undefined) as DashboardWidget[];
    
    const report: AnalyticsReport = {
      id: this.generateId(),
      name: config.name,
      description: config.description,
      timeRange: config.timeRange,
      widgets,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.activeReports.set(report.id, report);
    return report;
  }
  
  getReport(reportId: string): AnalyticsReport | undefined {
    return this.activeReports.get(reportId);
  }
  
  getAllReports(): AnalyticsReport[] {
    return Array.from(this.activeReports.values());
  }
  
  async exportReport(reportId: string, format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
    const report = this.getReport(reportId);
    if (!report) {
      throw new Error('Report not found');
    }
    
    // Simulate export process
    const data = JSON.stringify(report, null, 2);
    return new Blob([data], { type: 'application/json' });
  }
  
  private async fetchWidgetData(widgetId: string): Promise<any> {
    const widgetConfig = this.config.widgets.find(w => w.id === widgetId);
    if (!widgetConfig) {
      throw new Error(`Widget configuration not found for ID: ${widgetId}`);
    }
    
    // In a real implementation, this would fetch from analytics service
    // For now, we'll return mock data based on widget type
    switch (widgetConfig.type) {
      case 'metric':
        return this.generateMockMetricsData();
      case 'chart':
        return this.generateMockChartData(widgetConfig);
      case 'table':
        return this.generateMockTableData();
      case 'heatmap':
        return this.generateMockHeatmapData();
      default:
        return {};
    }
  }
  
  private generateMockMetricsData(): MetricsData {
    return {
      visits: Math.floor(Math.random() * 10000) + 1000,
      uniqueVisitors: Math.floor(Math.random() * 8000) + 800,
      pageViews: Math.floor(Math.random() * 15000) + 1500,
      bounceRate: Math.random() * 50 + 20, // 20-70%
      avgSessionDuration: Math.random() * 300 + 60, // 1-6 minutes
      conversionRate: Math.random() * 10 + 1, // 1-11%
      revenue: Math.random() * 10000 + 1000,
      goalCompletions: Math.floor(Math.random() * 500) + 50
    };
  }
  
  private generateMockChartData(widgetConfig: DashboardWidgetConfig): ChartData {
    const dataPoints = 12;
    const labels = Array.from({ length: dataPoints }, (_, i) => `Day ${i + 1}`);
    const data = Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 1000) + 100);
    
    return {
      labels,
      datasets: [
        {
          label: widgetConfig.title,
          data,
          backgroundColor: widgetConfig.visualization.colors?.[0] || '#3b82f6',
          borderColor: widgetConfig.visualization.colors?.[1] || '#2563eb',
          borderWidth: 2
        }
      ]
    };
  }
  
  private generateMockTableData(): any[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      page: `/page-${i + 1}`,
      visits: Math.floor(Math.random() * 1000) + 100,
      uniqueVisitors: Math.floor(Math.random() * 800) + 80,
      bounceRate: Math.random() * 50 + 20,
      avgTimeOnPage: Math.random() * 300 + 30
    }));
  }
  
  private generateMockHeatmapData(): any {
    return {
      data: Array.from({ length: 100 }, () => ({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        value: Math.random()
      }))
    };
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export function createAnalyticsDashboard(config: DashboardConfig): AnalyticsDashboard {
  return new AnalyticsDashboard(config);
}

export const analyticsDashboard = createAnalyticsDashboard({
  enabled: true,
  defaultTimeRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
    preset: 'last_7_days'
  },
  refreshInterval: 300, // 5 minutes
  widgets: [
    {
      id: 'visitors_metric',
      type: 'metric',
      title: 'Unique Visitors',
      dataSource: 'analytics',
      dimensions: ['date'],
      metrics: ['uniqueVisitors'],
      visualization: {
        type: 'bar'
      }
    },
    {
      id: 'conversion_chart',
      type: 'chart',
      title: 'Conversion Rate Over Time',
      dataSource: 'analytics',
      dimensions: ['date'],
      metrics: ['conversionRate'],
      visualization: {
        type: 'line',
        colors: ['#10b981', '#059669']
      }
    },
    {
      id: 'top_pages',
      type: 'table',
      title: 'Top Pages',
      dataSource: 'analytics',
      dimensions: ['page'],
      metrics: ['visits', 'uniqueVisitors', 'bounceRate'],
      visualization: {
        type: 'table'
      }
    }
  ]
});