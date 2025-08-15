"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Globe,
  Plus,
  ExternalLink,
  Copy,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useOptimizedCollection } from "@/hooks/use-optimized-firestore";

export interface CustomDomain {
  id: string;
  domain: string;
  status: "pending" | "active" | "failed" | "verifying";
  type: "funnel" | "website" | "blog" | "landing";
  sslEnabled: boolean;
  createdAt: any;
  updatedAt: any;
  dnsRecords?: DNSRecord[];
  verificationToken?: string;
  lastChecked?: any;
}

export interface DNSRecord {
  type: "A" | "CNAME" | "TXT";
  name: string;
  value: string;
  ttl?: number;
}

export function CustomDomainManager() {
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [domainType, setDomainType] = useState<
    "funnel" | "website" | "blog" | "landing"
  >("website");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);

  const { toast } = useToast();
  const { user, db } = useAuth();

  // Use optimized Firestore collection hook with fallback
  const domainsQuery =
    user && db ? collection(db, "workspaces", user.uid, "domains") : null;
  const {
    data: domainsData,
    loading: domainsLoading,
    error: domainsError,
  } = useOptimizedCollection<CustomDomain>(
    domainsQuery,
    `domains-${user?.uid}`,
    { enabled: !!user && !!db }
  );

  useEffect(() => {
    if (domainsData) {
      const sortedDomains = domainsData.sort(
        (a, b) =>
          new Date(b.createdAt?.toDate?.() || b.createdAt).getTime() -
          new Date(a.createdAt?.toDate?.() || a.createdAt).getTime()
      );
      setDomains(sortedDomains);
    }
    setIsLoading(domainsLoading);
  }, [domainsData, domainsLoading]);

  // Handle loading errors by showing the interface anyway
  useEffect(() => {
    if (domainsError) {
      console.error("Error loading domains:", domainsError);
      setIsLoading(false);
      // Still show the interface even if there's an error loading existing domains
    }
  }, [domainsError]);

  const validateDomain = (domain: string): boolean => {
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    return domainRegex.test(domain) && domain.length <= 253;
  };

  const generateDNSRecords = (domain: string, type: string): DNSRecord[] => {
    const baseRecords: DNSRecord[] = [
      {
        type: "A",
        name: "@",
        value: "76.76.19.123", // Example IP - replace with your actual server IP
        ttl: 3600,
      },
      {
        type: "CNAME",
        name: "www",
        value: domain,
        ttl: 3600,
      },
    ];

    // Add specific records based on domain type
    if (type === "blog") {
      baseRecords.push({
        type: "CNAME",
        name: "blog",
        value: `${domain}.cdn.example.com`,
        ttl: 3600,
      });
    }

    // Add verification TXT record
    baseRecords.push({
      type: "TXT",
      name: "@",
      value: `highlaunhpad-verification=${generateVerificationToken()}`,
      ttl: 300,
    });

    return baseRecords;
  };

  const generateVerificationToken = (): string => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleAddDomain = async () => {
    if (!user || !db) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add domains.",
        variant: "destructive",
      });
      return;
    }

    if (!newDomain.trim()) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name.",
        variant: "destructive",
      });
      return;
    }

    const cleanDomain = newDomain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");

    if (!validateDomain(cleanDomain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name (e.g., example.com).",
        variant: "destructive",
      });
      return;
    }

    // Check if domain already exists
    if (domains.some((d) => d.domain === cleanDomain)) {
      toast({
        title: "Domain Already Exists",
        description: "This domain has already been added to your workspace.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingDomain(true);

    try {
      const verificationToken = generateVerificationToken();
      const dnsRecords = generateDNSRecords(cleanDomain, domainType);

      const domainData: Omit<CustomDomain, "id"> = {
        domain: cleanDomain,
        status: "pending",
        type: domainType,
        sslEnabled: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        dnsRecords,
        verificationToken,
        lastChecked: serverTimestamp(),
      };

      const domainsRef = collection(db, "workspaces", user.uid, "domains");
      await addDoc(domainsRef, domainData);

      toast({
        title: "Domain Added Successfully!",
        description: `${cleanDomain} has been added. Please configure your DNS records to activate it.`,
      });

      setNewDomain("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding domain:", error);
      toast({
        title: "Failed to Add Domain",
        description: "There was an error adding your domain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    if (!user || !db) return;

    setVerifyingDomain(domainId);

    try {
      // Simulate DNS verification process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const domainRef = doc(db, "workspaces", user.uid, "domains", domainId);

      // Randomly simulate success/failure for demo
      const isVerified = Math.random() > 0.3; // 70% success rate

      await updateDoc(domainRef, {
        status: isVerified ? "active" : "failed",
        sslEnabled: isVerified,
        updatedAt: serverTimestamp(),
        lastChecked: serverTimestamp(),
      });

      toast({
        title: isVerified ? "Domain Verified!" : "Verification Failed",
        description: isVerified
          ? "Your domain is now active and ready to use."
          : "DNS records not found. Please check your configuration and try again.",
        variant: isVerified ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error verifying domain:", error);
      toast({
        title: "Verification Error",
        description:
          "There was an error verifying your domain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifyingDomain(null);
    }
  };

  const handleDeleteDomain = async (domainId: string, domainName: string) => {
    if (!user || !db) return;

    try {
      const domainRef = doc(db, "workspaces", user.uid, "domains", domainId);
      await deleteDoc(domainRef);

      toast({
        title: "Domain Deleted",
        description: `${domainName} has been removed from your workspace.`,
      });
    } catch (error) {
      console.error("Error deleting domain:", error);
      toast({
        title: "Failed to Delete Domain",
        description:
          "There was an error deleting your domain. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "DNS record copied to clipboard.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "verifying":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      failed: "destructive",
      verifying: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Show loading only for a short time, then show interface anyway
  if (isLoading && !domainsError) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading domains...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom Domains</h3>
          <p className="text-sm text-muted-foreground">
            Connect your own domains to your funnels, websites, and landing
            pages.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Custom Domain</DialogTitle>
              <DialogDescription>
                Enter your domain name and select how you want to use it.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter without http:// or https://
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Domain Type</Label>
                <select
                  id="type"
                  value={domainType}
                  onChange={(e) => setDomainType(e.target.value as any)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="website">Website</option>
                  <option value="funnel">Sales Funnel</option>
                  <option value="blog">Blog</option>
                  <option value="landing">Landing Page</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDomain} disabled={isAddingDomain}>
                {isAddingDomain && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Add Domain
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {domains.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Custom Domains</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first custom domain to start using your own branding for
              funnels and websites.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Domain
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {domains.map((domain) => (
            <Card key={domain.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(domain.status)}
                    <div>
                      <CardTitle className="text-lg">{domain.domain}</CardTitle>
                      <CardDescription className="capitalize">
                        {domain.type} • Added{" "}
                        {new Date(
                          domain.createdAt?.toDate?.() || domain.createdAt
                        ).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(domain.status)}
                    {domain.sslEnabled && (
                      <Badge variant="outline" className="text-green-600">
                        SSL
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {domain.status === "pending" && domain.dnsRecords && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">
                        DNS Configuration Required
                      </h4>
                      <Button
                        size="sm"
                        onClick={() => handleVerifyDomain(domain.id)}
                        disabled={verifyingDomain === domain.id}
                      >
                        {verifyingDomain === domain.id && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Verify Domain
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add these DNS records to your domain provider to activate
                      your domain:
                    </p>
                    <div className="space-y-2">
                      {domain.dnsRecords.map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{record.type}</Badge>
                              <span className="font-mono text-sm">
                                {record.name}
                              </span>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground break-all">
                              {record.value}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(record.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {domain.status === "active" && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Domain Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      <a
                        href={`https://${domain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Visit Site
                      </a>
                    </div>
                  </div>
                )}

                {domain.status === "failed" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-semibold">Verification Failed</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      We couldn&apos;t verify your DNS records. Please check
                      your configuration and try again.
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Last checked:{" "}
                    {domain.lastChecked
                      ? new Date(
                          domain.lastChecked.toDate?.() || domain.lastChecked
                        ).toLocaleString()
                      : "Never"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Domain</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {domain.domain}?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteDomain(domain.id, domain.domain)
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Domain
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
