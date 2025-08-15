import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Mail, Lock, Eye, Database, UserCheck, AlertTriangle, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
              alt="HighLaunchPad Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-bold">HighLaunchPad</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-muted/20">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 font-medium">
                <Shield className="h-5 w-5" />
                Your Privacy Matters
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                 We&apos;re committed to protecting your privacy and being transparent about how we collect, use, and protect your information.              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-20">
          <div className="container max-w-4xl space-y-12">
            
            {/* Quick Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  Quick Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-green-500" />
                      What We Do
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Collect only necessary information to provide our services</li>
                      <li>• Use industry-standard security measures</li>
                      <li>• Give you control over your data</li>
                      <li>• Never sell your personal information</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                       What We Don&apos;t Do                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sell your data to third parties</li>
                      <li>• Share your information without consent</li>
                      <li>• Use your data for unrelated purposes</li>
                      <li>• Store unnecessary personal information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                1. Information We Collect
              </h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    When you create an account with HighLaunchPad, we collect:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Email address:</strong> Used for account creation, login, and important communications</li>
                    <li>• <strong>Name:</strong> To personalize your experience and for billing purposes</li>
                    <li>• <strong>Password:</strong> Encrypted and stored securely for account access</li>
                    <li>• <strong>Profile information:</strong> Any additional details you choose to provide</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    To improve our services and provide analytics, we collect:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Platform usage:</strong> Features used, pages visited, time spent</li>
                    <li>• <strong>Device information:</strong> Browser type, operating system, IP address</li>
                    <li>• <strong>Performance data:</strong> Load times, errors, and system performance</li>
                    <li>• <strong>Interaction data:</strong> Clicks, form submissions, and user flows</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Content and data you create using our platform:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Websites and funnels:</strong> Content, designs, and configurations</li>
                    <li>• <strong>Customer data:</strong> Contacts, leads, and CRM information you input</li>
                    <li>• <strong>Email campaigns:</strong> Content, lists, and performance metrics</li>
                    <li>• <strong>Automation workflows:</strong> Rules, triggers, and sequences you create</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* How We Use Information */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Lock className="h-8 w-8 text-primary" />
                2. How We Use Your Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Provide and maintain our platform</li>
                      <li>• Process your requests and transactions</li>
                      <li>• Deliver customer support</li>
                      <li>• Send service-related communications</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Analyze usage patterns and trends</li>
                      <li>• Develop new features and services</li>
                      <li>• Fix bugs and improve performance</li>
                      <li>• Conduct research and analytics</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Send important account updates</li>
                      <li>• Provide technical support</li>
                      <li>• Share product announcements</li>
                      <li>• Send marketing communications (with consent)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Legal Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Comply with legal obligations</li>
                      <li>• Protect against fraud and abuse</li>
                      <li>• Enforce our terms of service</li>
                      <li>• Respond to legal requests</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Data Sharing */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                3. How We Share Your Information
              </h2>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    We do not sell, rent, or trade your personal information. We only share your data in these limited circumstances:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Service Providers</h4>
                      <p className="text-muted-foreground text-sm">
                        We work with trusted third-party services to operate our platform (hosting, payment processing, email delivery). These providers are contractually bound to protect your data.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Legal Requirements</h4>
                      <p className="text-muted-foreground text-sm">
                        We may disclose information when required by law, to protect our rights, or to protect the safety of our users.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Business Transfers</h4>
                      <p className="text-muted-foreground text-sm">
                        In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">With Your Consent</h4>
                      <p className="text-muted-foreground text-sm">
                        We may share information for other purposes with your explicit consent.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Data Security */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Lock className="h-8 w-8 text-primary" />
                4. Data Security
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Safeguards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• SSL/TLS encryption for data in transit</li>
                      <li>• Encryption at rest for sensitive data</li>
                      <li>• Regular security audits and updates</li>
                      <li>• Secure cloud infrastructure (Firebase/Google Cloud)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Access Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Multi-factor authentication options</li>
                      <li>• Role-based access controls</li>
                      <li>• Regular access reviews</li>
                      <li>• Secure password requirements</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Your Rights */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-primary" />
                5. Your Rights and Choices
              </h2>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Access and Portability</h4>
                        <p className="text-muted-foreground text-sm">
                          Request a copy of your personal data and export your content at any time.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Correction</h4>
                        <p className="text-muted-foreground text-sm">
                          Update or correct your personal information through your account settings.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Deletion</h4>
                        <p className="text-muted-foreground text-sm">
                          Request deletion of your account and associated data (subject to legal requirements).
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Marketing Communications</h4>
                        <p className="text-muted-foreground text-sm">
                          Opt out of marketing emails at any time using the unsubscribe link.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Data Processing</h4>
                        <p className="text-muted-foreground text-sm">
                          Object to certain types of data processing where legally permitted.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Complaints</h4>
                        <p className="text-muted-foreground text-sm">
                          File a complaint with your local data protection authority if you have concerns.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Cookies and Tracking */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Eye className="h-8 w-8 text-primary" />
                6. Cookies and Tracking
              </h2>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    We use cookies and similar technologies to improve your experience:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Essential Cookies</h4>
                      <p className="text-muted-foreground text-sm">
                        Required for the platform to function properly (authentication, security, preferences).
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                      <p className="text-muted-foreground text-sm">
                        Help us understand how you use our platform to improve performance and features.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Marketing Cookies</h4>
                      <p className="text-muted-foreground text-sm">
                        Used to deliver relevant advertisements and measure campaign effectiveness (with consent).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Mail className="h-8 w-8 text-primary" />
                7. Contact Us
              </h2>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    If you have questions about this Privacy Policy or how we handle your data, please contact us:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-muted-foreground">privacy@highlaunchpad.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Support</p>
                        <p className="text-muted-foreground">
                          <Link href="/dashboard/support" className="text-primary hover:underline">
                            Submit a support request
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Updates */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">8. Policy Updates</h2>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                     We will notify you of any material changes by email or through our platform. The &quot;Last updated&quot; date at the top                     of this policy indicates when it was last revised.
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-muted/40">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
                alt="HighLaunchPad Logo"
                width={24}
                height={24}
                className="rounded-md"
              />
              <span className="font-bold">HighLaunchPad</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground">Terms of Service</Link>
              <Link href="/dashboard/support" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}