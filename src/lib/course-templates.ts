
import type { Component } from './types';
import { LessonContentType, type LessonContent } from './course-types';

export interface TemplateLesson {
  title: string;
  contentType: LessonContentType;
  content: LessonContent;
  estimatedDurationMinutes?: number;
}

export interface TemplateModule {
  title: string;
  description?: string;
  lessons: TemplateLesson[];
}

export interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  aiInsight: string;
  instructor: string;
  lessonsCount: number;
  hours: number;
  modules?: TemplateModule[];
}

export const courseTemplates: CourseTemplate[] = [
    {
        id: 'ai-for-beginners',
        title: 'AI for Beginners',
        description: 'A comprehensive introduction to artificial intelligence and its practical applications.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        hint: 'artificial intelligence brain',
        aiInsight: 'Perfect for beginners. The structured modules and practical examples make complex AI concepts easy to understand.',
        instructor: 'Jane Doe',
        lessonsCount: 24,
        hours: 8,
        modules: [
            {
                title: 'Introduction to AI',
                description: 'Understanding the fundamentals of artificial intelligence',
                lessons: [
                    {
                        title: 'What is Artificial Intelligence?',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. This lesson covers the basic definition, history, and types of AI systems.' },
                        estimatedDurationMinutes: 15
                    },
                    {
                        title: 'History of AI Development',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'From the Turing Test to modern deep learning, explore the key milestones in AI development and how we arrived at today\'s AI capabilities.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Types of AI Systems',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn about narrow AI, general AI, and superintelligence. Understand the differences between reactive machines, limited memory, theory of mind, and self-aware AI.' },
                        estimatedDurationMinutes: 25
                    }
                ]
            },
            {
                title: 'Machine Learning Basics',
                description: 'Core concepts of machine learning and how computers learn',
                lessons: [
                    {
                        title: 'What is Machine Learning?',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. Discover the three main types: supervised, unsupervised, and reinforcement learning.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Supervised Learning Explained',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Dive deep into supervised learning algorithms including linear regression, decision trees, and neural networks. Learn how training data is used to make predictions.' },
                        estimatedDurationMinutes: 30
                    },
                    {
                        title: 'Unsupervised Learning Methods',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Explore clustering, association rules, and dimensionality reduction. Understand how machines find hidden patterns in data without labeled examples.' },
                        estimatedDurationMinutes: 25
                    }
                ]
            },
            {
                title: 'Neural Networks & Deep Learning',
                description: 'Understanding how artificial neural networks work',
                lessons: [
                    {
                        title: 'Introduction to Neural Networks',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn how artificial neural networks mimic the human brain. Understand neurons, weights, biases, and activation functions.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Deep Learning Fundamentals',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Explore deep neural networks with multiple hidden layers. Learn about backpropagation, gradient descent, and how deep learning powers modern AI.' },
                        estimatedDurationMinutes: 30
                    },
                    {
                        title: 'Convolutional Neural Networks',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Discover how CNNs revolutionized computer vision. Learn about convolution layers, pooling, and how they detect features in images.' },
                        estimatedDurationMinutes: 35
                    }
                ]
            },
            {
                title: 'AI Applications & Tools',
                description: 'Real-world applications and getting started with AI tools',
                lessons: [
                    {
                        title: 'AI in Business and Industry',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Explore how AI is transforming healthcare, finance, transportation, and entertainment. Learn about chatbots, recommendation systems, and autonomous vehicles.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Popular AI Tools and Platforms',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Get hands-on with TensorFlow, PyTorch, and cloud AI services. Learn about no-code AI platforms and how to start building your first AI project.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Ethics and Future of AI',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Understand the ethical implications of AI, including bias, privacy, and job displacement. Explore the future possibilities and challenges of artificial intelligence.' },
                        estimatedDurationMinutes: 20
                    }
                ]
            }
        ]
    },
    {
        id: 'affiliate-marketing-masterclass',
        title: 'Affiliate Marketing Masterclass',
        description: 'Learn the secrets to building a profitable affiliate marketing business from scratch.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        hint: 'marketing analytics chart',
        aiInsight: 'Comprehensive course with proven strategies. The step-by-step approach helps students achieve real results.',
        instructor: 'John Smith',
        lessonsCount: 45,
        hours: 15,
        modules: [
            {
                title: 'Affiliate Marketing Fundamentals',
                description: 'Master the basics of affiliate marketing',
                lessons: [
                    {
                        title: 'What is Affiliate Marketing?',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Affiliate marketing is a performance-based marketing strategy where you earn commissions by promoting other companies\' products. Learn the key players: merchants, affiliates, networks, and customers.' },
                        estimatedDurationMinutes: 15
                    },
                    {
                        title: 'How Affiliate Marketing Works',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Understand the affiliate marketing ecosystem, tracking systems, cookies, and commission structures. Learn about different payment models: CPA, CPC, and CPM.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Choosing Your Niche',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Discover how to select a profitable niche that aligns with your interests and expertise. Learn niche research techniques and validation methods.' },
                        estimatedDurationMinutes: 25
                    }
                ]
            },
            {
                title: 'Finding Profitable Products',
                description: 'Research and select high-converting affiliate products',
                lessons: [
                    {
                        title: 'Affiliate Network Research',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Explore major affiliate networks like Amazon Associates, ClickBank, ShareASale, and Commission Junction. Learn how to evaluate and join programs.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Product Research Strategies',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Master techniques for finding high-converting products. Learn to analyze gravity scores, commission rates, and competition levels.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Evaluating Commission Structures',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Understand different commission models and how to calculate potential earnings. Learn about recurring commissions vs. one-time payments.' },
                        estimatedDurationMinutes: 15
                    }
                ]
            },
            {
                title: 'Building Your Platform',
                description: 'Create websites and content that convert',
                lessons: [
                    {
                        title: 'Website Setup and Design',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn to build a professional affiliate website using WordPress. Understand hosting, domains, and essential plugins for affiliate marketers.' },
                        estimatedDurationMinutes: 30
                    },
                    {
                        title: 'Content Creation Strategies',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Master the art of creating compelling product reviews, comparison posts, and buying guides that drive conversions.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'SEO for Affiliate Sites',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Optimize your content for search engines. Learn keyword research, on-page SEO, and link building strategies specific to affiliate marketing.' },
                        estimatedDurationMinutes: 35
                    }
                ]
            },
            {
                title: 'Traffic Generation',
                description: 'Drive targeted traffic to your affiliate offers',
                lessons: [
                    {
                        title: 'Organic Traffic Strategies',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Master SEO, content marketing, and social media strategies to generate free, targeted traffic to your affiliate offers.' },
                        estimatedDurationMinutes: 30
                    },
                    {
                        title: 'Paid Advertising Methods',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn Google Ads, Facebook Ads, and other paid traffic sources. Understand campaign setup, targeting, and optimization for affiliate offers.' },
                        estimatedDurationMinutes: 35
                    },
                    {
                        title: 'Email Marketing for Affiliates',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Build an email list and create automated sequences that nurture leads and drive affiliate sales. Learn about lead magnets and email automation.' },
                        estimatedDurationMinutes: 25
                    }
                ]
            },
            {
                title: 'Conversion Optimization',
                description: 'Maximize your affiliate earnings through optimization',
                lessons: [
                    {
                        title: 'Landing Page Optimization',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Create high-converting landing pages that bridge the gap between traffic and affiliate offers. Learn about headlines, CTAs, and trust signals.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'A/B Testing Strategies',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Master split testing to improve conversion rates. Learn what to test, how to set up tests, and how to interpret results.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Analytics and Tracking',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Set up proper tracking to measure your success. Learn Google Analytics, affiliate tracking, and key metrics to monitor.' },
                        estimatedDurationMinutes: 30
                    }
                ]
            },
            {
                title: 'Scaling Your Business',
                description: 'Grow your affiliate marketing empire',
                lessons: [
                    {
                        title: 'Automation and Outsourcing',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn how to automate processes and outsource tasks to scale your affiliate business. Discover tools and team building strategies.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Multiple Income Streams',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Diversify your affiliate income by promoting multiple products and exploring different monetization methods like courses and coaching.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Legal and Compliance',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Understand FTC guidelines, disclosure requirements, and legal considerations for affiliate marketers. Stay compliant while maximizing earnings.' },
                        estimatedDurationMinutes: 15
                    }
                ]
            }
        ]
    },
    {
        id: 'youtube-creator-academy',
        title: 'YouTube Creator Academy',
        description: 'Go from zero to 100,000 subscribers with this proven blueprint for YouTube success.',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
        hint: 'youtube play button',
        aiInsight: 'Excellent for aspiring YouTubers. The practical strategies and real examples accelerate channel growth.',
        instructor: 'Alex Johnson',
        lessonsCount: 30,
        hours: 12,
        modules: [
            {
                title: 'YouTube Fundamentals',
                description: 'Master the basics of YouTube content creation',
                lessons: [
                    {
                        title: 'Understanding the YouTube Algorithm',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn how YouTube\'s algorithm works and what factors influence video recommendations. Understand watch time, click-through rates, and engagement signals.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Finding Your Niche and Audience',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Discover how to identify your target audience and choose a profitable niche. Learn audience research techniques and competitor analysis.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Setting Up Your Channel for Success',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Optimize your channel art, about section, and playlists. Learn how to create a compelling channel trailer and organize your content effectively.' },
                        estimatedDurationMinutes: 30
                    }
                ]
            },
            {
                title: 'Content Creation Mastery',
                description: 'Create engaging videos that keep viewers watching',
                lessons: [
                    {
                        title: 'Video Planning and Scripting',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn how to plan engaging videos and write scripts that hook viewers from the first second. Master storytelling techniques for YouTube.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Filming Techniques and Equipment',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Discover essential filming techniques and equipment for creating professional-looking videos on any budget. Learn about lighting, audio, and camera setup.' },
                        estimatedDurationMinutes: 30
                    },
                    {
                        title: 'Video Editing Fundamentals',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Master video editing basics using free and paid software. Learn about cuts, transitions, color correction, and audio editing.' },
                        estimatedDurationMinutes: 35
                    }
                ]
            },
            {
                title: 'YouTube SEO and Optimization',
                description: 'Get your videos discovered by more viewers',
                lessons: [
                    {
                        title: 'Keyword Research for YouTube',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn how to find the right keywords for your videos using YouTube\'s search suggest, TubeBuddy, and other tools.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Optimizing Titles and Descriptions',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Craft compelling titles that get clicks and write descriptions that help with discovery. Learn about tags and their impact on visibility.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Creating Eye-Catching Thumbnails',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Design thumbnails that stand out in search results and suggested videos. Learn design principles and tools for creating professional thumbnails.' },
                        estimatedDurationMinutes: 30
                    }
                ]
            },
            {
                title: 'Growing Your Audience',
                description: 'Build a loyal subscriber base and community',
                lessons: [
                    {
                        title: 'Engagement Strategies',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn how to increase likes, comments, and shares. Master community building and responding to your audience effectively.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Collaboration and Networking',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Discover how to collaborate with other creators and build relationships in your niche. Learn about guest appearances and cross-promotion.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Consistency and Upload Schedules',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Develop a sustainable content creation schedule. Learn how consistency impacts growth and how to batch create content efficiently.' },
                        estimatedDurationMinutes: 15
                    }
                ]
            },
            {
                title: 'Monetization Strategies',
                description: 'Turn your YouTube channel into a profitable business',
                lessons: [
                    {
                        title: 'YouTube Partner Program',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Understand the requirements for monetization and how to maximize ad revenue. Learn about CPM, RPM, and factors that affect earnings.' },
                        estimatedDurationMinutes: 20
                    },
                    {
                        title: 'Sponsorships and Brand Deals',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Learn how to attract sponsors and negotiate fair deals. Understand FTC guidelines and how to maintain authenticity while promoting products.' },
                        estimatedDurationMinutes: 25
                    },
                    {
                        title: 'Alternative Revenue Streams',
                        contentType: LessonContentType.TEXT,
                        content: { text: 'Explore merchandise, courses, coaching, and other ways to monetize your audience beyond ad revenue and sponsorships.' },
                        estimatedDurationMinutes: 30
                    }
                ]
            }
        ]
    }
];

export const defaultCourseTemplate: CourseTemplate = {
    id: 'default',
    title: 'New Blank Course',
    description: 'Start creating your new course.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    hint: 'blank canvas',
    aiInsight: 'Start with a clean slate and build your course exactly how you envision it.',
    instructor: 'You',
    lessonsCount: 0,
    hours: 0,
};

export const getCourseTemplateById = (id: string | undefined): CourseTemplate => {
  if (!id) return defaultCourseTemplate;
  return courseTemplates.find(t => t.id === id) || defaultCourseTemplate;
};
