import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, X, Filter, Mail, Users, Star, Crown, Shield } from 'lucide-react'

const comparisonFeatures = [
  {
    category: 'Funnel Building',
    features: [
      { name: 'Drag & Drop Builder', clickfunnels: true, highlaunchpad: true },
      { name: 'Mobile Responsive', clickfunnels: true, highlaunchpad: true },
      { name: 'A/B Testing', clickfunnels: true, highlaunchpad: true },
      { name: 'Custom Domains', clickfunnels: true, highlaunchpad: true },
      { name: 'Unlimited Funnels', clickfunnels: false, highlaunchpad: true },
      { name: 'Page Load Speed', clickfunnels: 'Good', highlaunchpad: 'Excellent' },
    ]
  },
  {
    category: 'Email Marketing',
    features: [
      { name: 'Email Automation', clickfunnels: 'Basic', highlaunchpad: 'Advanced' },
      { name: 'Email Templates', clickfunnels: 'Limited', highlaunchpad: 'Extensive' },
      { name: 'Behavioral Triggers', clickfunnels: false, highlaunchpad: true },
      { name: 'Advanced Segmentation', clickfunnels: false, highlaunchpad: true },
      { name: 'Email Analytics', clickfunnels: 'Basic', highlaunchpad: 'Advanced' },
      { name: 'Deliverability', clickfunnels: 'Good', highlaunchpad: 'Excellent' },
    ]
  },
  {
    category: 'CRM & Analytics',
    features: [
      { name: 'Contact Management', clickfunnels: 'Basic', highlaunchpad: 'Advanced' },
      { name: 'Sales Pipeline', clickfunnels: false, highlaunchpad: true },
      { name: 'Advanced Analytics', clickfunnels: false, highlaunchpad: true },
      { name: 'Conversion Tracking', clickfunnels: 'Basic', highlaunchpad: 'Advanced' },
      { name: 'Custom Reports', clickfunnels: false, highlaunchpad: true },
      { name: 'Real-time Dashboard', clickfunnels: 'Basic', highlaunchpad: 'Advanced' },
    ]
  },
  {
    category: 'AI & Automation',
    features: [
      { name: 'AI Content Generation', clickfunnels: false, highlaunchpad: true },
      { name: 'AI Ad Copy Creation', clickfunnels: false, highlaunchpad: true },
      { name: 'AI Email Writing', clickfunnels: false, highlaunchpad: true },
      { name: 'Smart Automation', clickfunnels: 'Basic', highlaunchpad: 'Advanced' },
      { name: 'Predictive Analytics', clickfunnels: false, highlaunchpad: true },
      { name: 'AI Optimization', clickfunnels: false, highlaunchpad: true },
    ]
  }
];

const pricingComparison = [
  {
    feature: 'Starting Price',
    clickfunnels: '$97/month',
    highlaunchpad: '$29/month',
    savings: '$68/month'
  },
  {
    feature: 'Email Marketing',
    clickfunnels: 'Extra $97/month',
    highlaunchpad: 'Included',
    savings: '$97/month'
  },
  {
    feature: 'Advanced CRM',
    clickfunnels: 'Extra $297/month',
    highlaunchpad: 'Included',
    savings: '$297/month'
  },
  {
    feature: 'AI Tools',
    clickfunnels: 'Not Available',
    highlaunchpad: 'Included',
    savings: 'Priceless'
  },
  {
    feature: 'Analytics & Reporting',
    clickfunnels: 'Extra $47/month',
    highlaunchpad: 'Included',
    savings: '$47/month'
  }
];

const migrationTestimonials = [
  {
    quote: "I switched from ClickFunnels to HighLaunchPad and saved $200/month while getting better features. The AI tools alone are worth the switch.",
    name: "Rachel Martinez",
    title: "Digital Marketing Consultant",
    avatar: "https://i.pravatar.cc/40?img=1",
    previousTool: "ClickFunnels user for 2 years"
  },
  {
    quote: "ClickFunnels was costing me $300+ with all the add-ons. HighLaunchPad gives me everything for $29. My conversion rates actually improved too.",
    name: "James Wilson",
    title: "E-commerce Entrepreneur",
    avatar: "https://i.pravatar.cc/40?img=3",
    previousTool: "ClickFunnels Platinum user"
  },
  {
    quote: "The migration was seamless and the support team helped me every step of the way. I wish I had switched sooner.",
    name: "Lisa Chen",
    title: "Course Creator",
    avatar: "https://i.pravatar.cc/40?img=5",
    previousTool: "ClickFunnels user for 3 years"
  }
];

const FeatureIcon = ({ available }: { available: boolean | string }) => {
  if (typeof available === 'boolean') {
    return available ? (
      <Check className="h-5 w-5 text-green-500" />
    ) : (
      <X className="h-5 w-5 text-red-500" />
    );
  }
  
  return (
    <span className={`text-sm font-medium ${
      available === 'Excellent' || available === 'Advanced' ? 'text-green-600' :
      available === 'Good' || available === 'Basic' ? 'text-yellow-600' :
      available === 'Limited' ? 'text-orange-600' : 'text-gray-600'
    }`}>
      {available}
    </span>
  );
};

export default function VsClickFunnelsPage() {
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
              <Crown className="h-5 w-5" />
              HighLaunchPad vs ClickFunnels
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Smart Marketers Are<br />
              <span className="text-foreground">Switching from ClickFunnels</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground">
              Get everything ClickFunnels offers PLUS advanced CRM, email marketing, AI tools, and analytics - all for 70% less money.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90" asChild>
                <Link href="/signup">Make the Switch Today</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#comparison">See Full Comparison</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Free migration assistance
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                No setup fees
              </div>
            </div>
          </div>
        </section>

        {/* Quick Comparison */}
        <section className="py-20 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                 The Numbers Don&apos;t Lie              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                See how HighLaunchPad compares to ClickFunnels on price and features.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* ClickFunnels */}
              <Card className="border-red-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">CF</span>
                  </div>
                  <CardTitle className="text-2xl">ClickFunnels</CardTitle>
                  <div className="text-3xl font-bold text-red-600">$97-$297/mo</div>
                  <p className="text-sm text-muted-foreground">Plus additional costs for email, CRM, analytics</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Funnel Builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Advanced Email Marketing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Full CRM System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>AI Content Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Advanced Analytics</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-red-600 font-medium">Total with add-ons: $400+/month</p>
                  </div>
                </CardContent>
              </Card>

              {/* HighLaunchPad */}
              <Card className="border-primary/50 border-2 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </div>
                </div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Image
                      src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
                      alt="HighLaunchPad"
                      width={32}
                      height={32}
                      className="rounded-md"
                    />
                  </div>
                  <CardTitle className="text-2xl">HighLaunchPad</CardTitle>
                  <div className="text-3xl font-bold text-primary">$29/mo</div>
                  <p className="text-sm text-green-600 font-medium">Everything included, no hidden costs</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Advanced Funnel Builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Advanced Email Marketing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Full CRM System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>AI Content Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Advanced Analytics</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-green-600 font-medium">Save $371/month vs ClickFunnels</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Detailed Comparison */}
        <section id="comparison" className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Feature-by-Feature Comparison
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                See exactly how HighLaunchPad stacks up against ClickFunnels in every category.
              </p>
            </div>
            
            <div className="space-y-8">
              {comparisonFeatures.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Feature</th>
                            <th className="text-center py-2 font-medium">ClickFunnels</th>
                            <th className="text-center py-2 font-medium">HighLaunchPad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.features.map((feature) => (
                            <tr key={feature.name} className="border-b">
                              <td className="py-3 font-medium">{feature.name}</td>
                              <td className="py-3 text-center">
                                <FeatureIcon available={feature.clickfunnels} />
                              </td>
                              <td className="py-3 text-center">
                                <FeatureIcon available={feature.highlaunchpad} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Breakdown */}
        <section className="py-20 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                True Cost Comparison
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                ClickFunnels looks cheaper until you add the features you actually need.
              </p>
            </div>
            
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-semibold">Feature</th>
                        <th className="text-center py-3 font-semibold">ClickFunnels</th>
                        <th className="text-center py-3 font-semibold">HighLaunchPad</th>
                        <th className="text-center py-3 font-semibold text-green-600">Your Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingComparison.map((item) => (
                        <tr key={item.feature} className="border-b">
                          <td className="py-3 font-medium">{item.feature}</td>
                          <td className="py-3 text-center text-red-600">{item.clickfunnels}</td>
                          <td className="py-3 text-center text-green-600">{item.highlaunchpad}</td>
                          <td className="py-3 text-center font-semibold text-green-600">{item.savings}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-primary">
                        <td className="py-4 font-bold text-lg">Total Monthly Cost</td>
                        <td className="py-4 text-center font-bold text-lg text-red-600">$400+</td>
                        <td className="py-4 text-center font-bold text-lg text-green-600">$29</td>
                        <td className="py-4 text-center font-bold text-lg text-green-600">$371+/month</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Migration Testimonials */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                What ClickFunnels Users Say About Switching
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Real stories from marketers who made the switch to HighLaunchPad.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {migrationTestimonials.map((testimonial) => (
                <Card key={testimonial.name} className="flex flex-col">
                  <CardContent className="pt-6 flex-1">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                    </div>
                     <p className="italic text-muted-foreground mb-4">&quot;{testimonial.quote}&quot;</p>                  </CardContent>
                  <CardHeader className="flex-row items-center gap-4 pt-2">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      <p className="text-xs text-blue-600 font-medium">{testimonial.previousTool}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Migration Support */}
        <section className="py-20 bg-gray-900 text-gray-200">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-3 py-1 rounded-full mb-4 font-medium">
                <Shield className="h-5 w-5" />
                Migration Support
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                 We&apos;ll Help You Switch (For Free)              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Our migration team will help you move your funnels, contacts, and campaigns from ClickFunnels to HighLaunchPad at no extra cost.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Filter className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Funnel Migration</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                   We&apos;ll recreate your funnels in HighLaunchPad, often with better performance and features.                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Users className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Contact Import</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  Import all your contacts, tags, and segments seamlessly into our advanced CRM system.
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Mail className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Email Setup</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  Recreate your email sequences and automations with our more powerful email marketing tools.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-primary/90 text-primary-foreground">
          <div className="container flex flex-col items-center py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Make the Switch?
            </h2>
            <p className="mt-4 max-w-xl text-lg opacity-90">
               Join thousands of marketers who&apos;ve already switched from ClickFunnels to HighLaunchPad and are saving money while getting better results.            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/signup">Start Your Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/for-affiliate-marketers">For Affiliate Marketers</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm opacity-80">30-day free trial • Free migration • No setup fees • Cancel anytime</p>
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
            <p className="text-muted-foreground">The smart alternative to ClickFunnels.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Comparisons</h4>
            <Link href="/vs-clickfunnels" className="block text-muted-foreground hover:text-foreground">vs ClickFunnels</Link>
            <Link href="/for-course-creators" className="block text-muted-foreground hover:text-foreground">For Course Creators</Link>
            <Link href="/for-affiliate-marketers" className="block text-muted-foreground hover:text-foreground">For Affiliate Marketers</Link>
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