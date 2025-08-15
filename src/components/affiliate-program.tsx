"use client";

import { AffiliateLink, AffiliateAPI } from "@/lib/affiliate-api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink, TrendingUp, DollarSign, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AffiliateData {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingPayouts: number;
  conversionRate: number;
  isActive: boolean;
}

export function AffiliateProgram() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Check if user is already an affiliate on component mount
  useEffect(() => {
    if (user?.uid) {
      checkAffiliateStatus();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch analytics when affiliate data is available
  useEffect(() => {
    if (affiliateData && user) {
      fetchAnalytics();
    }
  }, [affiliateData, user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function checkAffiliateStatus() {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/affiliate/status?userId=${user.uid}`);
      const data = await response.json();
      
      if (response.ok && data.affiliate) {
        setAffiliateData(data.affiliate);
        fetchLinks();
      }
    } catch (error) {
      console.error('Error checking affiliate status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLinks() {
    if (!user) return;
    setLoadingLinks(true);
    try {
      const affiliateLinks = await AffiliateAPI.getLinks(user);
      setLinks(affiliateLinks || []);
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      setLinks([]); // Set empty array on error
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch affiliate links.",
      });
    } finally {
      setLoadingLinks(false);
    }
  }

  async function fetchAnalytics() {
    if (!user) return;
    setLoadingAnalytics(true);
    try {
      const analyticsData = await AffiliateAPI.getAnalytics(user);
      setAnalytics(analyticsData);
      console.log('Analytics data:', analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        variant: "destructive",
        title: "Analytics Error",
        description: "Could not fetch analytics data.",
      });
    } finally {
      setLoadingAnalytics(false);
    }
  }

  async function handleSignup() {
    if (!user?.uid || !user?.email) {
      setError("Please log in to join the affiliate program");
      return;
    }

    setIsSigningUp(true);
    setError(null);
    
    try {
      const response = await fetch("/api/affiliate/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.uid, 
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0]
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAffiliateData(data.affiliate);
        toast({
          title: "Welcome to the Affiliate Program!",
          description: "Your affiliate link has been generated successfully.",
        });
      } else {
        setError(data.error || "Failed to join affiliate program");
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: data.error || "Failed to join affiliate program",
        });
      }
    } catch (error) {
      console.error('Affiliate signup error:', error);
      setError("Network error. Please try again.");
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSigningUp(false);
    }
  }

  async function copyAffiliateLink(slug?: string) {
    if (!affiliateData?.referralCode) return;
    
    const linkToCopy = slug 
      ? `${origin}/go/${slug}`
      : `${origin}/signup?ref=${affiliateData.referralCode}`;
    
    try {
      await navigator.clipboard.writeText(linkToCopy);
      toast({
        title: "Link Copied!",
        description: "Your affiliate link has been copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy link. Please copy manually.",
      });
    }
  }

  if (loading && !affiliateData) {
    return (
      <Card className="max-w-4xl mx-auto my-8">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-blue-600">Loading affiliate status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-6">
      {/* Main Affiliate Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">HighLaunchPad Affiliate Program</CardTitle>
              {affiliateData && (
                <Badge variant={affiliateData.isActive ? "default" : "secondary"} className="mt-2">
                  {affiliateData.isActive ? "Active Affiliate" : "Inactive"}
                </Badge>
              )}
            </div>
            {affiliateData && (
              <div className="text-right">
                <p className="text-sm text-blue-600">Total Earnings</p>
                <p className="text-2xl font-bold text-primary">${affiliateData.totalEarnings.toFixed(2)}</p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Program Benefits */}
          <div>
            <p className="text-lg font-semibold mb-3">Earn recurring commissions for every paid sign up you refer!</p>
            <ul className="list-disc ml-6 space-y-1 text-base">
              <li>Tier 1: 30% payout per paid subscription (first 12 months)</li>
              <li>Tier 2: 10% payout for referrals made by your affiliates</li>
              <li>Monthly payouts via Stripe (minimum $50)</li>
              <li>Real-time tracking and analytics</li>
              <li>Dedicated affiliate support</li>
            </ul>
          </div>

          {/* Affiliate Link Section */}
          {affiliateData ? (
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Your Affiliate Link:</p>
                <div className="flex items-center gap-2">
                  <div className="bg-muted rounded px-3 py-2 flex-1 break-all select-all text-sm">
                    {`${origin}/signup?ref=${affiliateData.referralCode}`}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyAffiliateLink()}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/signup?ref=${affiliateData.referralCode}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold">{affiliateData.totalReferrals}</p>
                    <p className="text-sm text-blue-600">Total Referrals</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">${affiliateData.pendingPayouts.toFixed(2)}</p>
                    <p className="text-sm text-blue-600">Pending Payouts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold">{(affiliateData.conversionRate * 100).toFixed(1)}%</p>
                    <p className="text-sm text-blue-600">Conversion Rate</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-lg">Ready to start earning? Join our affiliate program today!</p>
              <Button 
                className="w-full max-w-md" 
                onClick={handleSignup} 
                disabled={isSigningUp || !user}
                size="lg"
              >
                {isSigningUp ? "Joining Program..." : "Become an Affiliate"}
              </Button>
              {error && (
                <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
                  {error}
                </div>
              )}
              {!user && (
                <p className="text-sm text-blue-600">
                  Please log in to join the affiliate program
                </p>
              )}
            </div>
          )}

          <div className="text-sm text-blue-600 pt-4 border-t">
            <p>Track your referrals, earnings, and payouts in your affiliate dashboard. Need help? Contact our support team.</p>
          </div>
        </CardContent>
      </Card>

      {affiliateData && analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAnalytics ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-blue-600">Loading analytics...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold">{analytics.totalClicks || 0}</p>
                      <p className="text-sm text-blue-600">Total Clicks</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold">{analytics.totalConversions || 0}</p>
                      <p className="text-sm text-blue-600">Total Conversions</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="h-5 w-5 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold">${(analytics.totalRevenue || 0).toFixed(2)}</p>
                      <p className="text-sm text-blue-600">Total Revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Activity className="h-5 w-5 text-orange-500" />
                      </div>
                      <p className="text-2xl font-bold">{analytics.overallConversionRate || '0.00'}%</p>
                      <p className="text-sm text-blue-600">Conversion Rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Link Performance */}
                {analytics.linkAnalytics && analytics.linkAnalytics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Link Performance</h3>
                    <div className="space-y-3">
                      {analytics.linkAnalytics.map((linkData: any) => (
                        <div key={linkData.linkId} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                          <div className="flex-1">
                            <p className="font-semibold">{linkData.name}</p>
                            <p className="text-sm text-blue-600">/{linkData.slug}</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="font-semibold">{linkData.clicks}</p>
                              <p className="text-xs text-blue-600">Clicks</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">{linkData.conversions}</p>
                              <p className="text-xs text-blue-600">Conversions</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">${linkData.revenue.toFixed(2)}</p>
                              <p className="text-xs text-blue-600">Revenue</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">{linkData.conversionRate}%</p>
                              <p className="text-xs text-blue-600">Rate</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => copyAffiliateLink(linkData.slug)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {affiliateData && (
        <Card>
          <CardHeader>
            <CardTitle>Your Affiliate Links</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLinks ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-blue-600">Loading links...</p>
              </div>
            ) : links.length > 0 ? (
              <div className="space-y-4">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{link.name}</p>
                      <p className="text-sm text-blue-600">{link.targetUrl}</p>
                      <p className="text-xs text-muted-foreground">{origin}/go/{link.slug}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-semibold">{link.clicks}</p>
                        <p className="text-sm text-blue-600">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{link.conversions}</p>
                        <p className="text-sm text-blue-600">Conversions</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">${(link.commission || 0).toFixed(2)}</p>
                        <p className="text-sm text-blue-600">Earned</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyAffiliateLink(link.slug)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-600">You haven&apos;t created any affiliate links yet. Create some in the main affiliate program page above.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

