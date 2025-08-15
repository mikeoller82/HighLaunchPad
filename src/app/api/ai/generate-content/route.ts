import { NextRequest, NextResponse } from 'next/server';

// Fallback AI generation function
async function generateContent(prompt: string, type: string): Promise<{ generatedCopy: string; editedText?: string }> {
  // This is a fallback implementation - replace with actual AI service
  const templates = {
    hero: `Generated Hero Title\nGenerated Hero Subtitle\nGet Started`,
    text: `Generated text content based on: ${prompt}`,
    header: `Generated Header Title`,
    features: `Enhanced functionality\nImproved performance\nBetter user experience`,
    default: `Generated content for ${type}: ${prompt}`
  };
  
  return {
    generatedCopy: templates[type as keyof typeof templates] || templates.default,
    editedText: templates[type as keyof typeof templates] || templates.default
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, componentType, currentContent } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let generatedContent;

    // Generate content based on component type and prompt
    switch (componentType) {
      case 'hero':
        generatedContent = await generateContent(prompt, 'hero');
        
        const heroLines = generatedContent.generatedCopy.split('\n');
        return NextResponse.json({
          content: {
            title: heroLines[0] || 'Generated Title',
            subtitle: heroLines[1] || 'Generated Subtitle',
            cta: heroLines[2] || 'Get Started'
          }
        });

      case 'text':
        generatedContent = await generateContent(prompt, 'text');
        
        return NextResponse.json({
          content: {
            text: generatedContent.editedText || generatedContent.generatedCopy || 'Generated text content'
          }
        });

      case 'header':
        generatedContent = await generateContent(`Create a compelling header title: ${prompt}`, 'header');
        
        return NextResponse.json({
          content: {
            title: generatedContent.editedText || generatedContent.generatedCopy || 'Generated Header',
            links: currentContent.links || [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' }
            ]
          }
        });

      case 'features':
        generatedContent = await generateContent(prompt, 'features');
        
        const features = generatedContent.generatedCopy?.split('\n').filter(line => line.trim()).slice(0, 3) || [];
        
        return NextResponse.json({
          content: {
            title: 'Key Features',
            features: [
              {
                title: 'Feature 1',
                description: features[0] || 'Enhanced functionality'
              },
              {
                title: 'Feature 2', 
                description: features[1] || 'Improved performance'
              },
              {
                title: 'Feature 3',
                description: features[2] || 'Better user experience'
              }
            ]
          }
        });

      case 'testimonials':
        return NextResponse.json({
          content: {
            title: 'What Our Customers Say',
            testimonials: [
              {
                name: 'John Smith',
                role: 'CEO, Tech Corp',
                content: `This solution has transformed our business. ${prompt}`,
                rating: 5
              },
              {
                name: 'Sarah Johnson',
                role: 'Marketing Director',
                content: 'Incredible results and outstanding support team.',
                rating: 5
              }
            ]
          }
        });

      case 'pricing':
        return NextResponse.json({
          content: {
            title: 'Choose Your Plan',
            plans: [
              {
                name: 'Starter',
                price: '$29',
                period: '/month',
                features: ['Basic features', 'Email support', '5 projects'],
                cta: 'Get Started'
              },
              {
                name: 'Professional',
                price: '$99',
                period: '/month',
                features: ['All features', 'Priority support', 'Unlimited projects'],
                cta: 'Upgrade Now',
                popular: true
              }
            ]
          }
        });

      case 'contact':
        return NextResponse.json({
          content: {
            title: 'Get In Touch',
            subtitle: 'Ready to get started? Contact us today.',
            email: 'hello@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Business St, City, State 12345'
          }
        });

      case 'footer':
        return NextResponse.json({
          content: {
            copyright: '© 2024 Your Company. All rights reserved.',
            links: [
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Contact', href: '/contact' }
            ]
          }
        });

      case 'image':
        return NextResponse.json({
          content: {
            src: currentContent.src || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
            alt: prompt || 'Generated image description',
            caption: `Image: ${prompt}`
          }
        });

      case 'video':
        return NextResponse.json({
          content: {
            title: prompt || 'Video Title',
            embedUrl: currentContent.embedUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: `Video about: ${prompt}`
          }
        });

      default:
        // For unknown types, use general text editing
        generatedContent = await generateContent(prompt, 'default');
        
        return NextResponse.json({
          content: {
            text: generatedContent.editedText || generatedContent.generatedCopy || 'Generated content'
          }
        });
    }

  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}