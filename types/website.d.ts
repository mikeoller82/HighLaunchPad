// Website builder types

export interface WebsiteComponent {
  id: string
  type: string
  content: Record<string, any>
  styles?: Record<string, any>
  children?: WebsiteComponent[]
}

export interface WebsitePage {
  id: string
  title: string
  slug: string
  components: WebsiteComponent[]
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Website {
  id: string
  name: string
  domain?: string
  subdomain: string
  pages: WebsitePage[]
  settings: {
    theme: string
    primaryColor: string
    secondaryColor: string
    font: string
    logo?: string
    favicon?: string
  }
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface TemplateData {
  id: string
  name: string
  category: string
  preview: string
  components: WebsiteComponent[]
  settings: Record<string, any>
}

export {};