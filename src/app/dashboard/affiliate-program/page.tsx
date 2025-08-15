"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { AffiliateProgram } from "@/components/affiliate-program";
import { useAuth } from '@/context/auth-context';
import { AffiliateAPI, AffiliateLink } from '@/lib/affiliate-api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

export default function AffiliateProgramPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLinkData, setNewLinkData] = useState({ name: '', targetUrl: '', slug: '' });
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const fetchLinks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const fetchedLinks = await AffiliateAPI.getLinks(user);
      setLinks(fetchedLinks || []);
      
      // Also fetch analytics to get real-time data
      try {
        const analyticsData = await AffiliateAPI.getAnalytics(user);
        console.log('Real-time analytics:', analyticsData);
      } catch (analyticsError) {
        console.warn('Failed to fetch analytics:', analyticsError);
      }
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
      setLinks([]); // Set empty array on error
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch affiliate links.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
  }, [user, fetchLinks]);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const createdLink = await AffiliateAPI.createLink(user, newLinkData);
      setLinks([createdLink, ...links]);
      setNewLinkData({ name: '', targetUrl: '', slug: '' });
      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "Affiliate link created successfully.",
      });
    } catch (error: any) {
      console.error("Error creating affiliate link:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create affiliate link.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Your HighLaunchPad Affiliate Hub</h1>
      <p className="text-xl text-blue-600 mb-8 text-center md:text-left max-w-3xl mx-auto">Unlock unparalleled earning potential and grow your business by joining the HighLaunchPad Affiliate Program. Partner with us to maximize your commissions!</p>

      {/* Affiliate Program Component */}
      <AffiliateProgram />

      {/* Affiliate Links Section */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Affiliate Links</CardTitle>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Link
            </Button>
          </div>
          <CardDescription>
            Create and manage your custom affiliate links to track different campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <form onSubmit={handleCreateLink} className="mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Link Name (e.g., 'Facebook Ad')"
                  value={newLinkData.name}
                  onChange={(e) => setNewLinkData({ ...newLinkData, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Target URL"
                  value={newLinkData.targetUrl}
                  onChange={(e) => setNewLinkData({ ...newLinkData, targetUrl: e.target.value })}
                  required
                />
                <Input
                  placeholder="Custom Slug (e.g., 'fb-ad-1')"
                  value={newLinkData.slug}
                  onChange={(e) => setNewLinkData({ ...newLinkData, slug: e.target.value })}
                  required
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                <Button type="submit">Create Link</Button>
              </div>
            </form>
          )}
          {loading ? (
            <p>Loading links...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>{link.name}</TableCell>
                    <TableCell>
                      <a href={`${origin}/go/${link.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {`${origin}/go/${link.slug}`}
                      </a>
                    </TableCell>
                    <TableCell>{link.clicks}</TableCell>
                    <TableCell>{link.conversions}</TableCell>
                    <TableCell>{link.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}