/**
 * Testimonial Manager
 *
 * Manages fetching, filtering, and displaying testimonials and case studies.
 * This manager will handle:
 * - A collection of testimonials and case studies.
 * - Filtering testimonials based on user characteristics (e.g., industry).
 * - Providing relevant testimonials to be displayed dynamically.
 */

export interface Testimonial {
  id: string;
  author: string;
  company: string;
  industry: string;
  content: string;
  tags: string[];
}

class TestimonialManager {
  private testimonials: Testimonial[] = [
    {
      id: '1',
      author: 'John Doe',
      company: 'Acme Inc.',
      industry: 'tech',
      content: 'This product is amazing!',
      tags: ['tech', 'startup'],
    },
    {
      id: '2',
      author: 'Jane Smith',
      company: 'HealthCo',
      industry: 'health',
      content: 'A must-have for the health industry.',
      tags: ['health', 'enterprise'],
    },
    {
        id: '3',
        author: 'Peter Jones',
        company: 'Finance Corp.',
        industry: 'finance',
        content: 'Transformed our financial reporting.',
        tags: ['finance', 'enterprise'],
    },
  ];

  constructor() {}

  /**
   * Get testimonials filtered by user characteristics.
   * @param characteristics An object containing user characteristics (e.g., { industry: 'tech' }).
   */
  getTestimonials(characteristics: { [key: string]: string }): Testimonial[] {
    return this.testimonials.filter(testimonial => {
      return Object.keys(characteristics).every(key => {
        return testimonial[key as keyof Testimonial] === characteristics[key];
      });
    });
  }
}

const testimonialManager = new TestimonialManager();
export default testimonialManager;