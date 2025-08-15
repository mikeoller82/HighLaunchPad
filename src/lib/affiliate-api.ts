import { User } from 'firebase/auth';

export interface AffiliateLink {
  id: string;
  name: string;
  targetUrl: string;
  slug: string;
  clicks: number;
  conversions: number;
  commission: number;
  status: 'Active' | 'Archived';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AffiliateAPI {
  private static async getAuthToken(user: User): Promise<string> {
    return await user.getIdToken();
  }

  private static async makeRequest(url: string, options: RequestInit, user: User) {
    const token = await this.getAuthToken(user);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        console.warn('Failed to parse error response:', e);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      console.error('API Request failed:', {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        errorMessage
      });
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  static async getLinks(user: User): Promise<AffiliateLink[]> {
    try {
      const data = await this.makeRequest('/api/affiliate/links', { method: 'GET' }, user);
      if (!data || !Array.isArray(data.links)) {
        console.warn('Invalid response format for affiliate links:', data);
        return [];
      }
      return data.links.map((link: any) => ({
        ...link,
        createdAt: link.createdAt ? new Date(link.createdAt) : new Date(),
        updatedAt: link.updatedAt ? new Date(link.updatedAt) : new Date(),
        clicks: link.clicks || 0,
        conversions: link.conversions || 0,
        commission: link.commission || 0,
        status: link.status || 'Active',
      }));
    } catch (error) {
      console.error('Failed to get affiliate links:', error);
      throw error; // Re-throw to let components handle the error properly
    }
  }

  static async createLink(
    user: User,
    linkData: { name: string; targetUrl: string; slug: string }
  ): Promise<AffiliateLink> {
    try {
      const data = await this.makeRequest(
        '/api/affiliate/links',
        {
          method: 'POST',
          body: JSON.stringify(linkData),
        },
        user
      );
      return {
        ...data.link,
        createdAt: data.link.createdAt ? new Date(data.link.createdAt) : new Date(),
        updatedAt: data.link.updatedAt ? new Date(data.link.updatedAt) : new Date(),
        clicks: data.link.clicks || 0,
        conversions: data.link.conversions || 0,
        commission: data.link.commission || 0,
        status: data.link.status || 'Active',
      };
    } catch (error) {
      console.error('Failed to create affiliate link:', error);
      throw error;
    }
  }

  static async updateLink(
    user: User,
    linkData: { id: string; name?: string; targetUrl?: string; status?: 'Active' | 'Archived' }
  ): Promise<AffiliateLink> {
    try {
      const data = await this.makeRequest(
        '/api/affiliate/links',
        {
          method: 'PUT',
          body: JSON.stringify(linkData),
        },
        user
      );
      return {
        ...data.link,
        createdAt: data.link.createdAt ? new Date(data.link.createdAt) : new Date(),
        updatedAt: data.link.updatedAt ? new Date(data.link.updatedAt) : new Date(),
        clicks: data.link.clicks || 0,
        conversions: data.link.conversions || 0,
        commission: data.link.commission || 0,
        status: data.link.status || 'Active',
      };
    } catch (error) {
      console.error('Failed to update affiliate link:', error);
      throw error;
    }
  }

  static async deleteLink(user: User, linkId: string): Promise<void> {
    try {
      await this.makeRequest(
        `/api/affiliate/links?id=${linkId}`,
        {
          method: 'DELETE',
        },
        user
      );
    } catch (error) {
      console.error('Failed to delete affiliate link:', error);
      throw error;
    }
  }

  static async getAnalytics(user: User, linkId?: string): Promise<any> {
    try {
      // Get comprehensive analytics for the user
      const url = linkId 
        ? `/api/affiliate/analytics?linkId=${linkId}` 
        : `/api/affiliate/analytics?userId=${user.uid}`;
      const data = await this.makeRequest(url, { method: 'GET' }, user);
      return data;
    } catch (error) {
      console.error('Failed to get affiliate analytics:', error);
      return { 
        totalClicks: 0, 
        totalConversions: 0, 
        totalRevenue: 0, 
        overallConversionRate: '0.00',
        linkAnalytics: [],
        affiliateProgram: {
          totalReferrals: 0,
          totalEarnings: 0,
          pendingPayouts: 0,
          conversionRate: 0
        }
      };
    }
  }

  static async getLinkAnalytics(user: User, linkId: string): Promise<any> {
    try {
      const data = await this.makeRequest(`/api/affiliate/analytics?linkId=${linkId}`, { method: 'GET' }, user);
      return data;
    } catch (error) {
      console.error('Failed to get link analytics:', error);
      return { 
        clicks: 0, 
        conversions: 0, 
        revenue: 0, 
        conversionRate: '0.00',
        recentClicks: []
      };
    }
  }
}