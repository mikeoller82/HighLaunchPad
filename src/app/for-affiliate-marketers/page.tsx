import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, Target, Link as LinkIcon, Filter, Mail, Zap, Star, PlayCircle, BrainCircuit } from 'lucide-react'
import { CostCalculator } from '@/components/landing/cost-calculator'

const affiliateFeatures = [
  {
    icon: Filter,
    title: 'High-Converting Funnels',
    description: 'Build landing pages and sales funnels that convert visitors into buyers with our drag-and-drop builder.',
    benefits: ['Mobile-optimized templates', 'A/B testing built-in', 'Conversion tracking', 'Fast loading speeds']
  },
  {
    icon: LinkIcon,
    title: 'Link Management & Tracking',
    description: 'Manage all your affiliate links in one place with advanced tracking and analytics.',
    benefits: ['Click tracking', 'Conversion attribution', 'Link cloaking', 'Performance analytics']
  },
  {
    icon: Mail,
    title: 'Email Marketing Automation',
    description: 'Build your email list and nurture leads with automated sequences that sell while you sleep.',
    benefits: ['Automated sequences', 'Behavioral triggers', 'List segmentation', 'Performance tracking']
  },
  {
    icon: BrainCircuit,
    title: 'AI Content Creation',
    description: 'Generate high-converting ad copy, email sequences, and landing page content in seconds.',
    benefits: ['Ad copy generation', 'Email templates', 'Product reviews', 'Social media posts']
  }
];

const affiliateTestimonials = [
  {
    quote: "HighLaunchPad helped me scale from $2K to $15K per month in affiliate commissions. The funnel builder and email automation are game-changers.",
    name: "Alex Thompson",
    title: "Affiliate Marketer",
    avatar: "https://i.pravatar.cc/40?img=2",
    earnings: "$15K/month"
  },
  {
    quote: "I replaced ClickFunnels, ActiveCampaign, and 3 other tools with HighLaunchPad. My conversion rates increased 40% and my costs dropped 70%.",
    name: "Maria Santos",
    title: "Digital Marketing Specialist",
    avatar: "https://i.pravatar.cc/40?img=4",
    earnings: "$8K/month"
  },
  {
    quote: "The AI content tools are incredible. I can create entire campaigns in hours instead of weeks. My productivity has skyrocketed.",
    name: "David Kim",
    title: "Performance Marketer",
    avatar: "https://i.pravatar.cc/40?img=6",
    earnings: "$22K/month"
  }
];

const affiliateStack = [
  { tool: 'Funnel Builder', current: 'ClickFunnels ($97/mo)', replacement: '✓ Built-in' },
  { tool: 'Email Marketing', current: 'ActiveCampaign ($49/mo)', replacement: '✓ Built-in' },
  { tool: 'Link Tracking', current: 'VolumeDash ($47/mo)', replacement: '✓ Built-in' },
  { tool: 'Landing Pages', current: 'Leadpages ($37/mo)', replacement: '✓ Built-in' },
  { tool: 'Analytics', current: 'Google Analytics Pro ($25/mo)', replacement: '✓ Built-in' },
  { tool: 'CRM', current: 'HubSpot ($45/mo)', replacement: '✓ Built-in' }
];

const conversionStats = [
  { metric: 'Average Conversion Rate Increase', value: '47%', description: 'vs. using separate tools' },
  { metric: 'Time Saved Per Campaign', value: '15 hours', description: 'with AI content generation' },
  { metric: 'Cost Reduction', value: '73%', description: 'compared to tool stack' },
  { metric: 'Setup Time', value: '< 30 min', description: 'from idea to live funnel' }
];

export default function AffiliateMarketersPage() {
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
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 -z-10"></div>
          <div className="container relative py-20 text-center md:py-32">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 font-medium">
              <Target className="h-5 w-5" />
              For Affiliate Marketers & Performance Marketers
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Stop Losing Money on<br />
              <span className="text-foreground">Expensive Marketing Tools</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground">
              Replace ClickFunnels + ActiveCampaign + tracking tools + analytics with one powerful platform. Build high-converting funnels, automate your email marketing, and track everything in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90" asChild>
                <Link href="/signup">Scale Your Affiliate Business</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#demo">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  See Live Demo
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                30-day free trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Proven Results for Affiliate Marketers
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                See the real impact HighLaunchPad has on affiliate marketing performance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {conversionStats.map((stat) => (
                <Card key={stat.metric} className="text-center">
                  <CardHeader>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <CardTitle className="text-lg">{stat.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Stop Bleeding Money on Multiple Tools
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Most affiliate marketers waste $300+ per month on tools that don&apos;t integrate properly.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Your Current Stack (Expensive & Fragmented)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {affiliateStack.map((item) => (
                    <div key={item.tool} className="flex justify-between items-center">
                      <span className="font-medium">{item.tool}:</span>
                      <span className="text-muted-foreground">{item.current}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Monthly Total:</span>
                      <span className="text-destructive">$300+ / month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Plus integration headaches & data silos</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/50 border-2">
                <CardHeader>
                  <CardTitle className="text-primary">HighLaunchPad (All-in-One Solution)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {affiliateStack.map((item) => (
                    <div key={item.tool} className="flex justify-between items-center">
                      <span className="font-medium">{item.tool}:</span>
                      <span className="text-green-600 font-medium">{item.replacement}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Monthly Total:</span>
                      <span className="text-primary">$29 / month</span>
                    </div>
                    <p className="text-sm text-green-600 mt-2 font-medium">Everything integrated & working together</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Everything You Need to Dominate Affiliate Marketing
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                From funnel creation to lead nurturing to performance tracking - all in one platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {affiliateFeatures.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Tools Section */}
        <section className="py-20 bg-gray-900 text-gray-200">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-3 py-1 rounded-full mb-4 font-medium">
                <Zap className="h-5 w-5" />
                AI-Powered Marketing
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Create Campaigns 10x Faster with AI
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Our AI assistant creates high-converting ad copy, email sequences, and landing page content in seconds.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Target className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Ad Copy Generation</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  Generate high-converting Facebook, Google, and native ad copy that drives clicks and conversions.
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Mail className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Email Sequences</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  Create automated email sequences that nurture leads and convert them into buyers.
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Filter className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Landing Page Copy</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  Generate persuasive headlines, bullet points, and CTAs for your landing pages and funnels.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Trusted by Top Affiliate Marketers
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                See how other marketers are scaling their affiliate businesses with HighLaunchPad.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {affiliateTestimonials.map((testimonial) => (
                <Card key={testimonial.name} className="flex flex-col">
                  <CardContent className="pt-6 flex-1">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <p className="italic text-muted-foreground mb-4">&quot;{testimonial.quote}&quot;</p>
                  </CardContent>
                  <CardHeader className="flex-row items-center gap-4 pt-2">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      <p className="text-xs text-green-600 font-medium">{testimonial.earnings}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cost Calculator Section */}
        <section id="calculator" className="py-20 bg-muted/40">
          <div className="container">
            <CostCalculator />
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-primary/90 text-primary-foreground">
          <div className="container flex flex-col items-center py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Scale Your Affiliate Business?
            </h2>
            <p className="mt-4 max-w-xl text-lg opacity-90">
              Join thousands of affiliate marketers who trust HighLaunchPad to power their campaigns and maximize their commissions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/signup">Start Your Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/vs-clickfunnels">vs ClickFunnels</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm opacity-80">30-day free trial • No credit card required • Cancel anytime</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-muted/40">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 py-12 text-sm">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
                alt="HighLaunchPad Logo"
                width={24}
                height={24}
                className="rounded-md"
              />
              <span className="font-bold">HighLaunchPad</span>
            </Link>
            <p className="text-muted-foreground">The all-in-one platform for affiliate marketers and performance marketers.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">For Marketers</h4>
            <Link href="/for-affiliate-marketers" className="block text-muted-foreground hover:text-foreground">Affiliate Marketers</Link>
            <Link href="/for-course-creators" className="block text-muted-foreground hover:text-foreground">Course Creators</Link>
            <Link href="/vs-clickfunnels" className="block text-muted-foreground hover:text-foreground">vs ClickFunnels</Link>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Product</h4>
            <Link href="/#features" className="block text-muted-foreground hover:text-foreground">Features</Link>
            <Link href="/#pricing" className="block text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="/login" className="block text-muted-foreground hover:text-foreground">Login</Link>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Legal</h4>
            <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="block text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}