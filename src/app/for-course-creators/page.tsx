import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, GraduationCap, Users, Mail, Video, BookText, DollarSign, Zap, Star, PlayCircle } from 'lucide-react'
import { CostCalculator } from '@/components/landing/cost-calculator'

const courseCreatorFeatures = [
  {
    icon: GraduationCap,
    title: 'Course Hosting & Delivery',
    description: 'Upload videos, PDFs, and interactive content. Create modules, lessons, and quizzes with our intuitive course builder.',
    benefits: ['Unlimited video hosting', 'Progress tracking', 'Completion certificates', 'Mobile-optimized player']
  },
  {
    icon: Users,
    title: 'Student Management',
    description: 'Track student progress, engagement, and completion rates. Send automated reminders and encouragement.',
    benefits: ['Student dashboard', 'Progress analytics', 'Automated emails', 'Discussion forums']
  },
  {
    icon: DollarSign,
    title: 'Payment & Pricing',
    description: 'Flexible pricing options including one-time payments, subscriptions, and payment plans.',
    benefits: ['Multiple payment options', 'Coupon codes', 'Affiliate program', 'Revenue analytics']
  },
  {
    icon: Mail,
    title: 'Marketing Automation',
    description: 'Nurture leads with automated email sequences. Convert prospects into paying students.',
    benefits: ['Drip campaigns', 'Behavioral triggers', 'Segmentation', 'A/B testing']
  }
];

const courseCreatorTestimonials = [
  {
    quote: "I replaced Teachable, Mailchimp, and ClickFunnels with HighLaunchPad. My course sales increased 60% in the first month because everything works together seamlessly.",
    name: "Sarah Chen",
    title: "Digital Marketing Course Creator",
    avatar: "https://i.pravatar.cc/40?img=1",
    students: "2,500+ students"
  },
  {
    quote: "The AI content tools are incredible for course creation. I can generate lesson outlines, email sequences, and sales copy in minutes instead of hours.",
    name: "Marcus Rodriguez",
    title: "Business Coach & Course Creator",
    avatar: "https://i.pravatar.cc/40?img=3",
    students: "1,800+ students"
  },
  {
    quote: "Finally, a platform that understands course creators. The student analytics help me improve my courses, and the marketing tools actually convert.",
    name: "Jennifer Walsh",
    title: "Photography Course Creator",
    avatar: "https://i.pravatar.cc/40?img=5",
    students: "3,200+ students"
  }
];

const courseCreatorStack = [
  { tool: 'Course Platform', current: 'Teachable ($39/mo)', replacement: '✓ Built-in' },
  { tool: 'Email Marketing', current: 'ConvertKit ($29/mo)', replacement: '✓ Built-in' },
  { tool: 'Landing Pages', current: 'Leadpages ($37/mo)', replacement: '✓ Built-in' },
  { tool: 'Analytics', current: 'Google Analytics Pro ($25/mo)', replacement: '✓ Built-in' },
  { tool: 'Payment Processing', current: 'Stripe fees (2.9%)', replacement: '✓ Integrated' },
  { tool: 'Affiliate Management', current: 'ReferralCandy ($47/mo)', replacement: '✓ Built-in' }
];

export default function CourseCreatorsPage() {
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
              <GraduationCap className="h-5 w-5" />
              For Course Creators & Educators
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Stop Paying $200+/Month<br />
              <span className="text-foreground">For Your Course Creation Stack</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground">
              Replace Teachable + ConvertKit + ClickFunnels + analytics tools with one powerful platform. Create, market, and sell your courses while keeping more of your revenue.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90" asChild>
                <Link href="/signup">Start Your Course Empire Today</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#demo">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
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
                Unlimited students
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                No transaction fees
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Tired of Juggling Multiple Platforms?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                 Most course creators are stuck managing 4-6 different tools that don&apos;t talk to each other.              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">The Old Way (Expensive & Complicated)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {courseCreatorStack.map((item) => (
                    <div key={item.tool} className="flex justify-between items-center">
                      <span className="font-medium">{item.tool}:</span>
                      <span className="text-muted-foreground">{item.current}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Monthly Total:</span>
                      <span className="text-destructive">$177+ / month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Plus setup headaches & integration issues</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/50 border-2">
                <CardHeader>
                  <CardTitle className="text-primary">The HighLaunchPad Way (Simple & Affordable)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {courseCreatorStack.map((item) => (
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
                    <p className="text-sm text-green-600 mt-2 font-medium">Everything works together seamlessly</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Everything You Need to Build & Scale Your Course Business
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                 From course creation to student management to marketing automation - we&apos;ve got you covered.              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {courseCreatorFeatures.map((feature) => (
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
                AI-Powered Course Creation
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Create Course Content 10x Faster with AI
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Our AI assistant helps you create course outlines, lesson scripts, marketing copy, and student emails in minutes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <BookText className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Course Outlines</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  Generate comprehensive course structures with learning objectives, modules, and lesson plans.
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Video className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Lesson Scripts</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  Create engaging video scripts and presentation outlines that keep students engaged.
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Mail className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="text-dark-blue">Marketing Copy</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  Generate sales pages, email sequences, and social media content to promote your courses.
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
                Loved by Course Creators Worldwide
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                See how other educators are growing their course businesses with HighLaunchPad.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {courseCreatorTestimonials.map((testimonial) => (
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
                      <p className="text-xs text-primary font-medium">{testimonial.students}</p>
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
              Ready to Build Your Course Empire?
            </h2>
            <p className="mt-4 max-w-xl text-lg opacity-90">
              Join thousands of course creators who trust HighLaunchPad to power their online education business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/signup">Start Your Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/for-affiliate-marketers">For Affiliate Marketers</Link>
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
            <p className="text-muted-foreground">The all-in-one platform for course creators and educators.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">For Creators</h4>
            <Link href="/for-course-creators" className="block text-muted-foreground hover:text-foreground">Course Creators</Link>
            <Link href="/for-affiliate-marketers" className="block text-muted-foreground hover:text-foreground">Affiliate Marketers</Link>
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