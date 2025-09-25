declare module 'contentlayer/generated' {
  export interface Post {
    _id: string
    _raw: {
      flattenedPath: string
    }
    slug: string
    slugAsParams: string
    title: string
    description?: string
    date: string
    published?: boolean
    image: string
    authors: string[]
    readingTime?: number
    body: {
      raw: string
      code: string
    }
  }

  export interface Author {
    _id: string
    slug: string
    slugAsParams: string
    title: string
    description?: string
    avatar: string
    twitter: string
  }

  export interface Page {
    slug: string
    slugAsParams: string
    title: string
    description?: string
  }

  export const allPosts: Post[]
  export const allAuthors: Author[]
  export const allPages: Page[]
}
