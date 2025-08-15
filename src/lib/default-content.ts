import type { ComponentType, ComponentContent } from './types'; // or wherever your types are defined

export const defaultContent: Record<ComponentType, Partial<ComponentContent>> = {
    hero: { title: 'Your Big Idea', subtitle: 'A catchy tagline to grab attention.', cta: { primary: 'Get Started Now' } },
    features: {
        title: 'Amazing Features',
        features: [
            { title: 'Feature One', description: 'Description for feature one.' },
            { title: 'Feature Two', description: 'Description for feature two.' },
            { title: 'Feature Three', description: 'Description for feature three.' },
        ]
    },
    testimonials: {
        title: 'What Our Customers Say',
        testimonials: [
            { quote: 'This is the best product ever!', author: 'Happy Customer' },
            { quote: 'I can\'t believe how much it helped me.', author: 'Another Happy Customer' },
        ]
    },
    pricing: {
        title: 'Pricing Plans',
        tiers: [
            { title: 'Basic', price: '$19', frequency: '/mo', description: 'For individuals and small teams.', features: ['10 Projects', '5GB Storage', 'Basic Support'], cta: 'Choose Plan' },
            { title: 'Pro', price: '$49', frequency: '/mo', description: 'For growing businesses.', features: ['Unlimited Projects', '50GB Storage', 'Priority Support'], cta: 'Choose Plan', featured: true },
            { title: 'Enterprise', price: 'Contact Us', frequency: '', description: 'For large organizations.', features: ['Unlimited Everything', 'Dedicated Support', 'Custom Integrations'], cta: 'Contact Sales' },
        ]
    },
    faq: {
        title: 'Frequently Asked Questions',
        faqs: [
            { question: 'What is included in the free plan?', answer: 'Our free plan includes access to basic features for up to 5 users. You can create up to 3 projects and get community support.' },
            { question: 'Can I change my plan later?', answer: 'Yes, you can upgrade or downgrade your plan at any time from your account settings. Prorated charges or credits will be applied.' },
            { question: 'Do you offer a non-profit discount?', answer: 'Yes, we offer a 50% discount for registered non-profit organizations. Please contact our support team with your documentation to apply.' },
        ]
    },
    contact: {
        title: 'Get In Touch',
        description: 'Have a question? Fill out the form below and we\'ll get back to you as soon as possible.',
        formId: null,
    },
    authorBox: {
        name: 'Jane Doe',
        bio: 'Jane is a leading expert in digital marketing with over 10 years of experience.',
        avatarSrc: '/images/placeholder.jpg',
        avatarHint: 'author avatar',
    },
    header: {
        title: 'Your Brand',
        links: [
            { label: 'Home', href: '#' },
            { label: 'About', href: '#' },
            { label: 'Contact', href: '#' },
        ],
    },
    image: {
        src: '/images/placeholder.jpg',
        alt: 'Placeholder image',
        hint: 'abstract scenery'
    },
    video: {
        title: 'Watch Our Story',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    text: {
        text: 'This is a block of text. You can edit it to add your own content. You can even use multiple lines.'
    },
    button: {
        text: 'Click Here',
        href: '#',
        variant: 'default',
    },
    customHtml: {
        html: `<div style="padding: 2rem; margin: 1rem; border: 2px dashed #374151; border-radius: 0.5rem; text-align: center; color: #F9FAFB">
    <h3 style="font-size: 1.25rem; font-weight: 600;">Custom HTML Block</h3>
    <p style="margin-top: 0.5rem; opacity: 0.8;">Click the edit icon to add your own HTML.</p>
    <p style="margin-top: 0.25rem; font-size: 0.75rem; opacity: 0.6;">Note: Scripts may not execute in this preview.</p>
</div>`
    },
    footer: {
        copyright: '© 2025 Your Brand. All rights reserved.',
        links: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
        ],
    },
    countdown: {
        title: 'Limited Time Offer Ends In:',
        targetDate: '2025-12-31T23:59:59.000Z',
    },
    socials: {
        title: 'Follow Us On Social Media',
        links: [
            { label: 'Twitter', href: '#' },
            { label: 'Facebook', href: '#' },
            { label: 'Instagram', href: '#' },
        ]
    },
    optinForm: {
        title: 'Subscribe to Our Newsletter',
        description: 'Get the latest news and updates delivered straight to your inbox.',
        cta: 'Subscribe',
        formId: null,
    },
    gallery: {
        title: 'Our Gallery',
        subtitle: 'Explore our latest work and projects',
        images: [
            { src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=entropy&auto=format', alt: 'Gallery Image 1', caption: 'Project Alpha' },
            { src: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=entropy&auto=format', alt: 'Gallery Image 2', caption: 'Project Beta' },
            { src: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop&crop=entropy&auto=format', alt: 'Gallery Image 3', caption: 'Project Gamma' },
            { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=entropy&auto=format', alt: 'Gallery Image 4', caption: 'Project Delta' },
            { src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=entropy&auto=format', alt: 'Gallery Image 5', caption: 'Project Epsilon' },
            { src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop&crop=entropy&auto=format', alt: 'Gallery Image 6', caption: 'Project Zeta' }
        ]
    },
    counter: {
        title: 'Our Achievements',
        subtitle: 'Numbers that speak for themselves',
        counters: [
            { number: '1000+', label: 'Happy Clients', suffix: '' },
            { number: '50+', label: 'Projects Completed', suffix: '' },
            { number: '99', label: 'Success Rate', suffix: '%' },
            { number: '24/7', label: 'Support Available', suffix: '' }
        ]
    },
    timeline: {
        title: 'Our Journey',
        subtitle: 'Key milestones in our growth story',
        events: [
            { year: '2020', title: 'Company Founded', description: 'Started with a vision to transform digital experiences' },
            { year: '2021', title: 'First Major Client', description: 'Secured our first enterprise partnership' },
            { year: '2022', title: 'Team Expansion', description: 'Grew to 25+ talented professionals' },
            { year: '2023', title: 'International Growth', description: 'Expanded operations to 5 countries' },
            { year: '2024', title: 'Innovation Award', description: 'Recognized for outstanding innovation in tech' }
        ]
    },
    team: {
        title: 'Meet Our Team',
        subtitle: 'The talented people behind our success',
        members: [
            { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face', bio: 'Visionary leader with 15+ years in tech' },
            { name: 'Michael Chen', role: 'CTO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', bio: 'Tech innovator and problem solver' },
            { name: 'Emily Rodriguez', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', bio: 'Creative designer with an eye for detail' },
            { name: 'David Kim', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', bio: 'Full-stack developer and mentor' }
        ]
    },
    stats: {
        title: 'By the Numbers',
        subtitle: 'Our impact in measurable terms',
        stats: [
            { value: '10M+', label: 'Users Served', icon: 'users' },
            { value: '$50M+', label: 'Revenue Generated', icon: 'dollar' },
            { value: '99.9%', label: 'Uptime', icon: 'shield' },
            { value: '150+', label: 'Countries', icon: 'globe' }
        ]
    },
    cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of satisfied customers and transform your business today',
        primaryCta: 'Start Free Trial',
        secondaryCta: 'Schedule Demo',
        features: ['No credit card required', '14-day free trial', 'Cancel anytime']
    },
    newsletter: {
        title: 'Stay Updated',
        subtitle: 'Get the latest news, tips, and exclusive offers delivered to your inbox',
        placeholder: 'Enter your email address',
        cta: 'Subscribe Now',
        privacy: 'We respect your privacy. Unsubscribe at any time.'
    },
    map: {
        title: 'Find Us',
        subtitle: 'Visit our office or get in touch',
        address: '123 Business Street, Suite 100, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'contact@company.com',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1!2d-74.0059!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuM1JX!5e0!3m2!1sen!2sus!4v1234567890'
    },
    tabs: {
        title: 'Our Services',
        subtitle: 'Comprehensive solutions for your business needs',
        tabs: [
            { id: 'design', label: 'Design', content: 'Beautiful, user-centered designs that convert visitors into customers.' },
            { id: 'development', label: 'Development', content: 'Robust, scalable applications built with modern technologies.' },
            { id: 'marketing', label: 'Marketing', content: 'Data-driven marketing strategies that drive growth and ROI.' },
            { id: 'support', label: 'Support', content: '24/7 dedicated support to keep your business running smoothly.' }
        ]
    },
    accordion: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about our services',
        items: [
            { question: 'What services do you offer?', answer: 'We offer comprehensive digital solutions including web design, development, marketing, and ongoing support.' },
            { question: 'How long does a typical project take?', answer: 'Project timelines vary based on scope and complexity, typically ranging from 2-12 weeks.' },
            { question: 'Do you provide ongoing support?', answer: 'Yes, we offer various support packages to ensure your digital presence continues to perform optimally.' },
            { question: 'What is your pricing structure?', answer: 'Our pricing is project-based and depends on your specific requirements. Contact us for a custom quote.' }
        ]
    },
    portfolio: {
        title: 'Our Work',
        subtitle: 'Showcasing our best projects and client success stories',
        projects: [
            { title: 'E-commerce Platform', category: 'Web Development', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', description: 'Modern e-commerce solution with advanced features' },
            { title: 'Brand Identity', category: 'Design', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop', description: 'Complete brand redesign and identity system' },
            { title: 'Mobile App', category: 'Development', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop', description: 'Cross-platform mobile application' },
            { title: 'Marketing Campaign', category: 'Marketing', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', description: 'Integrated digital marketing campaign' }
        ]
    },
    process: {
        title: 'Our Process',
        subtitle: 'How we deliver exceptional results',
        steps: [
            { number: '01', title: 'Discovery', description: 'We start by understanding your goals, challenges, and requirements' },
            { number: '02', title: 'Strategy', description: 'Develop a comprehensive strategy tailored to your specific needs' },
            { number: '03', title: 'Design', description: 'Create beautiful, functional designs that align with your brand' },
            { number: '04', title: 'Development', description: 'Build robust solutions using the latest technologies and best practices' },
            { number: '05', title: 'Launch', description: 'Deploy your solution and ensure everything works perfectly' },
            { number: '06', title: 'Support', description: 'Provide ongoing support and optimization for continued success' }
        ]
    },
    brands: {
        title: 'Trusted by Leading Brands',
        subtitle: 'Join the companies that trust us with their digital presence',
        brands: [
            { name: 'TechCorp', logo: 'https://via.placeholder.com/150x60/4F46E5/FFFFFF?text=TechCorp' },
            { name: 'InnovateLabs', logo: 'https://via.placeholder.com/150x60/059669/FFFFFF?text=InnovateLabs' },
            { name: 'GlobalSoft', logo: 'https://via.placeholder.com/150x60/DC2626/FFFFFF?text=GlobalSoft' },
            { name: 'FutureWorks', logo: 'https://via.placeholder.com/150x60/7C2D12/FFFFFF?text=FutureWorks' },
            { name: 'NextGen', logo: 'https://via.placeholder.com/150x60/1E40AF/FFFFFF?text=NextGen' },
            { name: 'ProSolutions', logo: 'https://via.placeholder.com/150x60/7C3AED/FFFFFF?text=ProSolutions' }
        ]
    },
    reviews: {
        title: 'Customer Reviews',
        subtitle: 'What our customers are saying',
        reviews: [
            { rating: 5, text: 'Excellent service and support!', author: 'John Doe', company: 'Tech Corp' },
            { rating: 5, text: 'Highly recommend to anyone looking for quality.', author: 'Jane Smith', company: 'Design Studio' },
            { rating: 4, text: 'Great experience overall, very satisfied.', author: 'Mike Johnson', company: 'Startup Inc' }
        ]
    },
    products: {
        title: 'Our Products',
        subtitle: 'Discover our amazing product lineup',
        products: [
            { id: '1', name: 'Product One', price: 99, image: '/images/product-1.jpg', description: 'Amazing product description' },
            { id: '2', name: 'Product Two', price: 149, image: '/images/product-2.jpg', description: 'Another great product' }
        ]
    },
    collections: {
        title: 'Featured Collections',
        subtitle: 'Curated product collections',
        plans: [
            { name: 'Summer Collection', priceRange: '$50 - $200', description: 'Fresh styles for the season', features: ['New arrivals', 'Limited edition', 'Free shipping'], cta: 'Shop Now' }
        ]
    },
    metrics: {
        title: 'Performance Metrics',
        subtitle: 'Track our success',
        counters: [
            { number: '99%', label: 'Customer Satisfaction' },
            { number: '24/7', label: 'Support Available' }
        ]
    },
    cart: {
        title: 'Shopping Cart',
        items: [],
        total: 0
    },
    checkout: {
        title: 'Checkout',
        steps: ['Shipping', 'Payment', 'Review']
    },
    popup: {
        title: 'Special Offer',
        content: 'Get 20% off your first order!',
        cta: 'Claim Offer'
    },
    banner: {
        title: 'Important Notice',
        content: 'Free shipping on all orders over $50',
        cta: 'Shop Now'
    },
    socialProof: {
        title: 'Join thousands of satisfied customers',
        count: '10,000+',
        action: 'customers trust us'
    },
    quiz: {
        title: 'Interactive Quiz',
        subtitle: 'Answer a few questions to get personalized results',
        questions: [
            {
                question: 'What is your primary goal?',
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
            }
        ]
    },
    media: {
        title: 'As Featured In',
        subtitle: 'Recognized by leading publications',
        mediaLogos: [
            { name: 'Publication 1', logo: 'https://via.placeholder.com/150x60/4F46E5/FFFFFF?text=Media1' },
            { name: 'Publication 2', logo: 'https://via.placeholder.com/150x60/059669/FFFFFF?text=Media2' }
        ]
    },
    about: {
        title: 'About Us',
        subtitle: 'Learn more about our story and mission',
        bio: 'We are a team of passionate professionals dedicated to delivering exceptional results.',
        credentials: [
            'Industry expertise',
            'Proven track record',
            'Award-winning team'
        ],
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
    },
    case_studies: {
        title: 'Case Studies',
        subtitle: 'Real results from our clients',
        cases: [
            {
                company: 'Example Company',
                industry: 'Technology',
                challenge: 'Needed to improve efficiency',
                solution: 'Implemented our proven methodology',
                results: '50% improvement in productivity',
                image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
            }
        ]
    },
    guarantee: {
        title: 'Money-Back Guarantee',
        subtitle: 'Try our service risk-free',
        description: 'If you\'re not completely satisfied, we\'ll refund your money. No questions asked.',
        badgeText: '100% Risk-Free'
    },
    consultation: {
        title: 'Schedule a Consultation',
        subtitle: 'Get expert advice tailored to your needs',
        consultationType: 'Strategy Session',
        duration: '60 minutes',
        price: 'Free',
        description: 'Book a complimentary consultation to discuss your goals and how we can help.',
        included: [
            'Personalized assessment',
            'Custom recommendations',
            'Action plan',
            'Resource suggestions'
        ],
        nextAvailable: 'Next week',
        note: 'Limited availability - book now to secure your spot.'
    },
    demo: {
        title: 'See It in Action',
        subtitle: 'Watch how our solution works',
        description: 'Experience our platform through an interactive demonstration',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        features: [
            'Live demonstration',
            'Interactive walkthrough',
            'Q&A session',
            'Personalized setup'
        ],
        cta: 'Schedule Demo',
        duration: '30 minutes'
    },
    before_after: {
        title: 'Before & After',
        subtitle: 'See the transformation',
        description: 'Real results from our customers',
        beforeImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        beforeLabel: 'Before',
        afterLabel: 'After',
        metrics: [
            { label: 'Efficiency', before: '40%', after: '95%' },
            { label: 'Time Saved', before: '0 hours', after: '20 hours/week' }
        ]
    },
    transformation: {
        title: 'Your Transformation Journey',
        subtitle: 'See how you\'ll progress step by step',
        description: 'A clear roadmap to your success',
        phases: [
            { phase: 'Week 1-2', title: 'Foundation', description: 'Build the basics and establish habits' },
            { phase: 'Week 3-6', title: 'Growth', description: 'Accelerate progress and see results' },
            { phase: 'Week 7-12', title: 'Mastery', description: 'Achieve your goals and maintain success' }
        ],
        timeline: '90 days',
        successRate: '94%'
    },
    program_details: {
        title: 'Program Details',
        subtitle: 'Everything you need to know',
        description: 'Comprehensive program information',
        modules: [
            { title: 'Module 1', description: 'Foundation concepts', duration: '2 weeks' },
            { title: 'Module 2', description: 'Advanced techniques', duration: '3 weeks' },
            { title: 'Module 3', description: 'Implementation', duration: '2 weeks' }
        ],
        totalDuration: '7 weeks',
        format: 'Online',
        support: '24/7 access'
    },
    about_coach: {
        title: 'Meet Your Coach',
        subtitle: 'Expert guidance for your journey',
        description: 'Learn about your transformation guide',
        name: 'Expert Coach',
        bio: 'Experienced professional with proven results',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
        credentials: [
            'Certified Professional',
            '10+ years experience',
            '1000+ successful clients'
        ],
        achievements: [
            'Industry recognition',
            'Published author',
            'Featured speaker'
        ]
    },
    application: {
        title: 'Apply Now',
        subtitle: 'Start your journey today',
        description: 'Submit your application to get started',
        formFields: [
            { label: 'Full Name', type: 'text', required: true },
            { label: 'Email', type: 'email', required: true },
            { label: 'Phone', type: 'tel', required: false },
            { label: 'Tell us about your goals', type: 'textarea', required: true }
        ],
        submitText: 'Submit Application',
        processingTime: '24-48 hours',
        nextSteps: 'You will receive a confirmation email with next steps'
    },
    problem_agitation: {
        title: 'Are You Still Struggling With...?',
        subtitle: 'It\'s not your fault, but it is your responsibility.',
        problems: [
            { text: 'Trying everything with no results?' },
            { text: 'Feeling stuck and overwhelmed?' },
            { text: 'Wasting time and money on solutions that don\'t work?' },
        ],
        solution: 'There is a better way.'
    },

    transformation_journey: {
        title: 'The Journey from Frustration to Freedom',
        subtitle: 'Follow this proven path to achieve your desired outcome.',
        steps: [
            { title: 'Step 1: The Foundation', description: 'Lay the groundwork for lasting success.' },
            { title: 'Step 2: The Breakthrough', description: 'Overcome key obstacles and accelerate your progress.' },
            { title: 'Step 3: The Mastery', description: 'Integrate your new skills and maintain momentum for life.' },
        ],
        cta: { primary: 'Start My Transformation' }
    },

    program_curriculum: {
        title: 'What\'s Inside the Program?',
        subtitle: 'A week-by-week breakdown of what you will learn and achieve.',
        modules: [
            { title: 'Module 1: Getting Started', description: 'Unlock the core principles and set yourself up for success.' },
            { title: 'Module 2: Advanced Strategies', description: 'Dive deep into the techniques that get real results.' },
            { title: 'Module 3: Implementation & Growth', description: 'Put your knowledge into practice and scale your success.' },
        ]
    },

    success_stories: {
        title: 'Don\'t Just Take Our Word For It',
        subtitle: 'See what our successful students have accomplished.',
        stories: [
            { quote: 'This program completely changed my life. I achieved my goal in half the time I expected.', author: 'Alex Johnson', result: 'Achieved 200% Growth' },
            { quote: 'I was skeptical at first, but the results speak for themselves. Highly recommended.', author: 'Samantha Lee', result: 'Landed Dream Job' },
        ]
    },

    coach_authority: {
        title: 'Why Learn From Me?',
        subtitle: 'I\'ve been where you are, and I know the way out.',
        image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=300&h=300&fit=crop&crop=face',
        credentials: [
            { text: '10+ years of experience in the field' },
            { text: 'Helped over 1,000 clients achieve their goals' },
            { text: 'Featured in Forbes and Entrepreneur Magazine' },
        ]
    },

    application_process: {
        title: 'How to Apply',
        subtitle: 'This program is by application only to ensure a high-quality peer group.',
        steps: [
            { title: 'Step 1: Submit Your Application', description: 'Fill out the short form below. It takes less than 5 minutes.' },
            { title: 'Step 2: Discovery Call', description: 'If your application is a good fit, we\'ll schedule a brief call to discuss your goals.' },
            { title: 'Step 3: Invitation to Join', description: 'Successful applicants will receive a personal invitation to enroll.' },
        ],
        cta: { primary: 'Apply Now' }
    },

    investment_breakdown: {
        title: 'Your Investment',
        subtitle: 'An investment in yourself is the best investment you can make.',
        options: [
            {
                plan: 'Pay in Full',
                price: '$2,997',
                description: 'The best value. Get started immediately.',
                cta: 'Enroll Now'
            },
            {
                plan: 'Payment Plan',
                price: '3x $1,197',
                description: 'Flexible payments to fit your budget.',
                cta: 'Choose Payment Plan'
            },
        ],
        guarantee: 'Includes a 30-Day Money-Back Guarantee.'
    },

    problem_breakdown: {
    title: 'Breaking Down the Problem'
  },
  leaderboard: {
    title: 'Leaderboard'
  },
  achievement: {
    title: 'Achievement Unlocked'
  },
  challenges: {
    title: 'Daily Challenges'
  },
  engagement_rewards: {
    title: 'Engagement Rewards'
  }
};