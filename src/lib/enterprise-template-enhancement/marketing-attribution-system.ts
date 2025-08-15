/**
 * Marketing Attribution System
 * Marketing tool integration and attribution tracking for campaigns
 */

export interface MarketingIntegrationConfig {
  enabled: boolean;
  providers: MarketingProvider[];
  attributionModel: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
  lookbackWindow: number; // days
  crossDeviceTracking: boolean;
  utmTracking: boolean;
  customParameters: string[];
}

export interface MarketingProvider {
  name: string;
  type: 'google_ads' | 'facebook_ads' | 'linkedin_ads' | 'twitter_ads' | 'email' | 'affiliate' | 'custom';
  apiKey?: string;
  accountId?: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface TouchPoint {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  customParameters: Record<string, string>;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  referrer?: string;
  landingPage: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ConversionEvent {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  type: 'purchase' | 'signup' | 'lead' | 'download' | 'custom';
  value: number;
  currency?: string;
  orderId?: string;
  productIds?: string[];
  customData: Record<string, any>;
}

export interface AttributionResult {
  conversionId: string;
  touchPoints: TouchPointAttribution[];
  totalValue: number;
  attributionModel: string;
  confidence: number;
}

export interface TouchPointAttribution {
  touchPointId: string;
  source: string;
  medium: string;
  campaign: string;
  attributedValue: number;
  attributionPercentage: number;
  position: number;
  timeDifference: number; // hours between touch and conversion
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  source: string;
  medium: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  revenue: number;
  clickThroughRate: number;
  conversionRate: number;
  costPerClick: number;
  costPerAcquisition: number;
  returnOnAdSpend: number;
  attributedConversions: number;
  attributedRevenue: number;
}

export interface ChannelPerformance {
  channel: string;
  touchPoints: number;
  conversions: number;
  revenue: number;
  firstTouchConversions: number;
  lastTouchConversions: number;
  assistedConversions: number;
  averageTimeToConversion: number;
  conversionRate: number;
}

export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  [key: string]: string | undefined;
}

export class MarketingAttributionSystem {
  private config: MarketingIntegrationConfig;
  private touchPoints: Map<string, TouchPoint[]> = new Map(); // userId -> touchPoints
  private conversions: ConversionEvent[] = [];
  private attributionResults: AttributionResult[] = [];

  constructor(config: MarketingIntegrationConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (!this.config.enabled) return;

    // Initialize tracking
    this.initializeUTMTracking();
    this.initializeProviderIntegrations();

    // Set up periodic data sync
    setInterval(() => {
      this.syncProviderData();
    }, 300000); // Sync every 5 minutes
  }

  async trackTouchPoint(touchPoint: Omit<TouchPoint, 'id' | 'timestamp'>): Promise<string> {
    const id = this.generateId();
    const fullTouchPoint: TouchPoint = {
      ...touchPoint,
      id,
      timestamp: new Date()
    };

    // Store touch point
    if (!this.touchPoints.has(touchPoint.userId)) {
      this.touchPoints.set(touchPoint.userId, []);
    }

    const userTouchPoints = this.touchPoints.get(touchPoint.userId)!;
    userTouchPoints.push(fullTouchPoint);

    // Clean up old touch points outside lookback window
    const cutoffDate = new Date(Date.now() - this.config.lookbackWindow * 24 * 60 * 60 * 1000);
    const filteredTouchPoints = userTouchPoints.filter(tp => tp.timestamp > cutoffDate);
    this.touchPoints.set(touchPoint.userId, filteredTouchPoints);

    return id;
  }

  async trackConversion(conversion: Omit<ConversionEvent, 'id' | 'timestamp'>): Promise<string> {
    const id = this.generateId();
    const fullConversion: ConversionEvent = {
      ...conversion,
      id,
      timestamp: new Date()
    };

    this.conversions.push(fullConversion);

    // Perform attribution analysis
    const attribution = await this.performAttribution(fullConversion);
    if (attribution) {
      this.attributionResults.push(attribution);
    }

    return id;
  }

  async performAttribution(conversion: ConversionEvent): Promise<AttributionResult | null> {
    const userTouchPoints = this.touchPoints.get(conversion.userId);
    if (!userTouchPoints || userTouchPoints.length === 0) {
      return null;
    }

    // Filter touch points within lookback window
    const cutoffDate = new Date(conversion.timestamp.getTime() - this.config.lookbackWindow * 24 * 60 * 60 * 1000);
    const relevantTouchPoints = userTouchPoints.filter(tp => tp.timestamp > cutoffDate && tp.timestamp <= conversion.timestamp);

    if (relevantTouchPoints.length === 0) {
      return null;
    }

    // Apply attribution model
    const attributions = this.applyAttributionModel(relevantTouchPoints, conversion);

    return {
      conversionId: conversion.id,
      touchPoints: attributions,
      totalValue: conversion.value,
      attributionModel: this.config.attributionModel,
      confidence: this.calculateAttributionConfidence(relevantTouchPoints, conversion)
    };
  }

  async getCampaignPerformance(timeRange?: { start: Date; end: Date }): Promise<CampaignPerformance[]> {
    const campaigns = new Map<string, CampaignPerformance>();

    // Aggregate data from attribution results
    for (const attribution of this.attributionResults) {
      const conversion = this.conversions.find(c => c.id === attribution.conversionId);
      if (!conversion) continue;

      // Filter by time range if provided
      if (timeRange && (conversion.timestamp < timeRange.start || conversion.timestamp > timeRange.end)) {
        continue;
      }

      for (const touchPoint of attribution.touchPoints) {
        const campaignKey = `${touchPoint.source}_${touchPoint.medium}_${touchPoint.campaign}`;

        if (!campaigns.has(campaignKey)) {
          campaigns.set(campaignKey, {
            campaignId: campaignKey,
            campaignName: touchPoint.campaign,
            source: touchPoint.source,
            medium: touchPoint.medium,
            impressions: 0,
            clicks: 0,
            cost: 0,
            conversions: 0,
            revenue: 0,
            clickThroughRate: 0,
            conversionRate: 0,
            costPerClick: 0,
            costPerAcquisition: 0,
            returnOnAdSpend: 0,
            attributedConversions: 0,
            attributedRevenue: 0
          });
        }

        const campaign = campaigns.get(campaignKey)!;
        campaign.attributedConversions += touchPoint.attributionPercentage / 100;
        campaign.attributedRevenue += touchPoint.attributedValue;
      }
    }

    // Calculate derived metrics
    for (const campaign of Array.from(campaigns.values())) {
      if (campaign.clicks > 0) {
        campaign.conversionRate = (campaign.attributedConversions / campaign.clicks) * 100;
        campaign.costPerClick = campaign.cost / campaign.clicks;
      }
      if (campaign.attributedConversions > 0) {
        campaign.costPerAcquisition = campaign.cost / campaign.attributedConversions;
      }
      if (campaign.cost > 0) {
        campaign.returnOnAdSpend = campaign.attributedRevenue / campaign.cost;
      }
      if (campaign.impressions > 0) {
        campaign.clickThroughRate = (campaign.clicks / campaign.impressions) * 100;
      }
    }

    return Array.from(campaigns.values());
  }

  async getChannelPerformance(timeRange?: { start: Date; end: Date }): Promise<ChannelPerformance[]> {
    const channels = new Map<string, ChannelPerformance>();

    // Aggregate touch points by channel
    for (const [userId, userTouchPoints] of Array.from(this.touchPoints.entries())) {
      for (const touchPoint of userTouchPoints) {
        // Filter by time range if provided
        if (timeRange && (touchPoint.timestamp < timeRange.start || touchPoint.timestamp > timeRange.end)) {
          continue;
        }

        const channelKey = `${touchPoint.source}_${touchPoint.medium}`;

        if (!channels.has(channelKey)) {
          channels.set(channelKey, {
            channel: channelKey,
            touchPoints: 0,
            conversions: 0,
            revenue: 0,
            firstTouchConversions: 0,
            lastTouchConversions: 0,
            assistedConversions: 0,
            averageTimeToConversion: 0,
            conversionRate: 0
          });
        }

        const channel = channels.get(channelKey)!;
        channel.touchPoints++;
      }
    }

    // Add conversion data
    for (const attribution of this.attributionResults) {
      const conversion = this.conversions.find(c => c.id === attribution.conversionId);
      if (!conversion) continue;

      // Filter by time range if provided
      if (timeRange && (conversion.timestamp < timeRange.start || conversion.timestamp > timeRange.end)) {
        continue;
      }

      for (const touchPoint of attribution.touchPoints) {
        const channelKey = `${touchPoint.source}_${touchPoint.medium}`;
        const channel = channels.get(channelKey);
        if (!channel) continue;

        channel.revenue += touchPoint.attributedValue;

        if (touchPoint.position === 0) {
          channel.firstTouchConversions++;
        } else if (touchPoint.position === attribution.touchPoints.length - 1) {
          channel.lastTouchConversions++;
        } else {
          channel.assistedConversions++;
        }
      }
    }

    // Calculate derived metrics
    for (const channel of Array.from(channels.values())) {
      channel.conversions = channel.firstTouchConversions + channel.lastTouchConversions + channel.assistedConversions;
      if (channel.touchPoints > 0) {
        channel.conversionRate = (channel.conversions / channel.touchPoints) * 100;
      }
    }

    return Array.from(channels.values());
  }

  async getAttributionReport(conversionId: string): Promise<AttributionResult | null> {
    return this.attributionResults.find(ar => ar.conversionId === conversionId) || null;
  }

  parseUTMParameters(url: string): UTMParameters {
    const urlObj = new URL(url);
    const params: UTMParameters = {};

    // Standard UTM parameters
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    for (const param of utmParams) {
      const value = urlObj.searchParams.get(param);
      if (value) {
        params[param] = value;
      }
    }

    // Custom parameters
    for (const customParam of this.config.customParameters) {
      const value = urlObj.searchParams.get(customParam);
      if (value) {
        params[customParam] = value;
      }
    }

    return params;
  }

  async exportAttributionData(format: 'csv' | 'json', timeRange?: { start: Date; end: Date }): Promise<Blob> {
    const campaignData = await this.getCampaignPerformance(timeRange);
    const channelData = await this.getChannelPerformance(timeRange);

    const exportData = {
      campaigns: campaignData,
      channels: channelData,
      attributionResults: this.attributionResults.filter(ar => {
        if (!timeRange) return true;
        const conversion = this.conversions.find(c => c.id === ar.conversionId);
        return conversion && conversion.timestamp >= timeRange.start && conversion.timestamp <= timeRange.end;
      }),
      summary: {
        totalConversions: this.conversions.length,
        totalRevenue: this.conversions.reduce((sum, c) => sum + c.value, 0),
        totalTouchPoints: Array.from(this.touchPoints.values()).reduce((sum, tps) => sum + tps.length, 0)
      }
    };

    if (format === 'json') {
      return new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    } else {
      // Convert to CSV
      const csv = this.convertAttributionToCSV(exportData);
      return new Blob([csv], { type: 'text/csv' });
    }
  }

  getConfig(): MarketingIntegrationConfig {
    return { ...this.config };
  }

  async updateConfig(config: Partial<MarketingIntegrationConfig>): Promise<void> {
    this.config = { ...this.config, ...config };

    if (config.enabled !== undefined) {
      if (config.enabled) {
        await this.initialize();
      }
    }
  }

  private applyAttributionModel(touchPoints: TouchPoint[], conversion: ConversionEvent): TouchPointAttribution[] {
    const attributions: TouchPointAttribution[] = [];
    const totalValue = conversion.value;

    switch (this.config.attributionModel) {
      case 'first_touch':
        attributions.push({
          touchPointId: touchPoints[0].id,
          source: touchPoints[0].source,
          medium: touchPoints[0].medium,
          campaign: touchPoints[0].campaign,
          attributedValue: totalValue,
          attributionPercentage: 100,
          position: 0,
          timeDifference: (conversion.timestamp.getTime() - touchPoints[0].timestamp.getTime()) / (1000 * 60 * 60)
        });
        break;

      case 'last_touch':
        const lastTouchPoint = touchPoints[touchPoints.length - 1];
        attributions.push({
          touchPointId: lastTouchPoint.id,
          source: lastTouchPoint.source,
          medium: lastTouchPoint.medium,
          campaign: lastTouchPoint.campaign,
          attributedValue: totalValue,
          attributionPercentage: 100,
          position: touchPoints.length - 1,
          timeDifference: (conversion.timestamp.getTime() - lastTouchPoint.timestamp.getTime()) / (1000 * 60 * 60)
        });
        break;

      case 'linear':
        const linearValue = totalValue / touchPoints.length;
        const linearPercentage = 100 / touchPoints.length;
        touchPoints.forEach((tp, index) => {
          attributions.push({
            touchPointId: tp.id,
            source: tp.source,
            medium: tp.medium,
            campaign: tp.campaign,
            attributedValue: linearValue,
            attributionPercentage: linearPercentage,
            position: index,
            timeDifference: (conversion.timestamp.getTime() - tp.timestamp.getTime()) / (1000 * 60 * 60)
          });
        });
        break;

      case 'time_decay':
        const weights = this.calculateTimeDecayWeights(touchPoints, conversion);
        touchPoints.forEach((tp, index) => {
          const weight = weights[index];
          attributions.push({
            touchPointId: tp.id,
            source: tp.source,
            medium: tp.medium,
            campaign: tp.campaign,
            attributedValue: totalValue * weight,
            attributionPercentage: weight * 100,
            position: index,
            timeDifference: (conversion.timestamp.getTime() - tp.timestamp.getTime()) / (1000 * 60 * 60)
          });
        });
        break;

      case 'position_based':
        // 40% first touch, 40% last touch, 20% distributed among middle touches
        if (touchPoints.length === 1) {
          attributions.push({
            touchPointId: touchPoints[0].id,
            source: touchPoints[0].source,
            medium: touchPoints[0].medium,
            campaign: touchPoints[0].campaign,
            attributedValue: totalValue,
            attributionPercentage: 100,
            position: 0,
            timeDifference: (conversion.timestamp.getTime() - touchPoints[0].timestamp.getTime()) / (1000 * 60 * 60)
          });
        } else {
          const middleCount = touchPoints.length - 2;
          const middleWeight = middleCount > 0 ? 0.2 / middleCount : 0;

          touchPoints.forEach((tp, index) => {
            let weight: number;
            if (index === 0) weight = 0.4;
            else if (index === touchPoints.length - 1) weight = 0.4;
            else weight = middleWeight;

            attributions.push({
              touchPointId: tp.id,
              source: tp.source,
              medium: tp.medium,
              campaign: tp.campaign,
              attributedValue: totalValue * weight,
              attributionPercentage: weight * 100,
              position: index,
              timeDifference: (conversion.timestamp.getTime() - tp.timestamp.getTime()) / (1000 * 60 * 60)
            });
          });
        }
        break;
    }

    return attributions;
  }

  private calculateTimeDecayWeights(touchPoints: TouchPoint[], conversion: ConversionEvent): number[] {
    const halfLife = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const weights: number[] = [];
    let totalWeight = 0;

    // Calculate raw weights based on time decay
    for (const touchPoint of touchPoints) {
      const timeDiff = conversion.timestamp.getTime() - touchPoint.timestamp.getTime();
      const weight = Math.pow(0.5, timeDiff / halfLife);
      weights.push(weight);
      totalWeight += weight;
    }

    // Normalize weights to sum to 1
    return weights.map(w => w / totalWeight);
  }

  private calculateAttributionConfidence(touchPoints: TouchPoint[], conversion: ConversionEvent): number {
    // Simple confidence calculation based on number of touch points and time span
    const timeSpan = touchPoints.length > 1 ?
      touchPoints[touchPoints.length - 1].timestamp.getTime() - touchPoints[0].timestamp.getTime() : 0;
    const timeSpanDays = timeSpan / (1000 * 60 * 60 * 24);

    // Higher confidence for more touch points and reasonable time spans
    let confidence = Math.min(0.5 + (touchPoints.length * 0.1), 0.9);

    // Adjust for time span (too short or too long reduces confidence)
    if (timeSpanDays < 1) {
      confidence *= 0.8;
    } else if (timeSpanDays > 30) {
      confidence *= 0.7;
    }

    return Math.max(0.3, confidence);
  }

  private initializeUTMTracking(): void {
    if (!this.config.utmTracking || typeof window === 'undefined') return;

    // Track initial page load with UTM parameters
    const utmParams = this.parseUTMParameters(window.location.href);
    if (Object.keys(utmParams).length > 0) {
      // In a real implementation, this would get the actual user ID
      const userId = this.getUserId();
      const sessionId = this.getSessionId();

      this.trackTouchPoint({
        userId,
        sessionId,
        source: utmParams.utm_source || 'direct',
        medium: utmParams.utm_medium || 'none',
        campaign: utmParams.utm_campaign || '(not set)',
        content: utmParams.utm_content,
        term: utmParams.utm_term,
        customParameters: Object.fromEntries(
          Object.entries(utmParams).filter(([_, value]) => value !== undefined)
        ) as Record<string, string>,
        deviceType: this.getDeviceType(),
        referrer: document.referrer,
        landingPage: window.location.href,
        userAgent: navigator.userAgent
      });
    }
  }

  private initializeProviderIntegrations(): void {
    // Initialize integrations with marketing platforms
    for (const provider of this.config.providers) {
      if (!provider.enabled) continue;

      switch (provider.type) {
        case 'google_ads':
          this.initializeGoogleAdsIntegration(provider);
          break;
        case 'facebook_ads':
          this.initializeFacebookAdsIntegration(provider);
          break;
        // Add other provider integrations as needed
      }
    }
  }

  private initializeGoogleAdsIntegration(provider: MarketingProvider): void {
    // In a real implementation, this would set up Google Ads API integration
    console.log('Initializing Google Ads integration:', provider.accountId);
  }

  private initializeFacebookAdsIntegration(provider: MarketingProvider): void {
    // In a real implementation, this would set up Facebook Ads API integration
    console.log('Initializing Facebook Ads integration:', provider.accountId);
  }

  private async syncProviderData(): Promise<void> {
    // Sync data from marketing platforms
    for (const provider of this.config.providers) {
      if (!provider.enabled) continue;

      try {
        await this.syncProviderCampaignData(provider);
      } catch (error) {
        console.error(`Failed to sync data from ${provider.name}:`, error);
      }
    }
  }

  private async syncProviderCampaignData(provider: MarketingProvider): Promise<void> {
    // In a real implementation, this would fetch campaign data from the provider's API
    // and update the campaign performance metrics
  }

  private convertAttributionToCSV(data: any): string {
    const headers = ['Campaign', 'Source', 'Medium', 'Conversions', 'Revenue', 'ROAS'];
    const rows = data.campaigns.map((campaign: CampaignPerformance) => [
      campaign.campaignName,
      campaign.source,
      campaign.medium,
      campaign.attributedConversions.toFixed(2),
      campaign.attributedRevenue.toFixed(2),
      campaign.returnOnAdSpend.toFixed(2)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private getUserId(): string {
    // In a real implementation, this would get the actual user ID from authentication
    return 'user_' + Math.random().toString(36).substring(2, 11);
  }

  private getSessionId(): string {
    // In a real implementation, this would get the actual session ID
    return 'session_' + Math.random().toString(36).substring(2, 11);
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';

    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}

export function createMarketingAttributionSystem(config: MarketingIntegrationConfig): MarketingAttributionSystem {
  return new MarketingAttributionSystem(config);
}

export const marketingAttributionSystem = createMarketingAttributionSystem({
  enabled: true,
  providers: [
    {
      name: 'Google Ads',
      type: 'google_ads',
      enabled: true,
      config: {}
    },
    {
      name: 'Facebook Ads',
      type: 'facebook_ads',
      enabled: true,
      config: {}
    }
  ],
  attributionModel: 'position_based',
  lookbackWindow: 30,
  crossDeviceTracking: true,
  utmTracking: true,
  customParameters: ['gclid', 'fbclid', 'msclkid']
});