import fs from "node:fs/promises"
import path from "node:path"
import dynamic from "next/dynamic"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkFrontmatter from "remark-frontmatter"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import React from "react"
import { visit } from "unist-util-visit"

const CodeBlock = dynamic(() => import("@/components/docs/CodeBlock"), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
      Loading code snippet…
    </div>
  ),
})

const MermaidDiagram = dynamic(() => import("@/components/docs/Mermaid"), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
      Rendering diagram…
    </div>
  ),
})

export type DocFrontmatter = {
  title: string
  description?: string
  order?: number
  section?: string
  sidebarLabel?: string
  toc?: boolean
  hideInSidebar?: boolean
}

export type Heading = {
  id: string
  title: string
  level: number
}

export type CompiledDoc = {
  slug: string[]
  filePath: string
  frontmatter: DocFrontmatter
  content: React.ReactNode
  headings: Heading[]
}

const DOCS_ROOT = path.resolve(process.cwd(), "src", "app", "docs", "content")

const DOC_EXTENSIONS = [".md", ".mdx"] as const

type DocFileRecord = {
  absolutePath: string
  relativePath: string
  routeSegments: string[]
  originalSegments: string[]
}

let docFilesCache: DocFileRecord[] | null = null


function createHeadingCollector(headings: Heading[]) {
  return () => (tree: unknown) => {
    visit(tree as any, "element", (node: Record<string, any>) => {
      if (!node || !node.tagName) return

      const level = Number(String(node.tagName).replace("h", ""))
      if (![2, 3, 4].includes(level)) return

      node.properties = node.properties ?? {}

      const existingClassName = node.properties.className
      const classList = new Set<string>(
        Array.isArray(existingClassName)
          ? existingClassName
          : existingClassName
            ? String(existingClassName).split(" ")
            : [],
      )
      classList.add("group")
      classList.add("scroll-mt-28")
      node.properties.className = Array.from(classList)

      const id = node.properties?.id as string | undefined
      if (!id) return

      const title = getNodeText(node)
      if (!title) return

      headings.push({ id, title, level })
    })
  }
}

function getNodeText(node: any): string {
  if (!node) return ""

  if (typeof node.value === "string") {
    return node.value
  }

  if (Array.isArray(node.children)) {
    return node.children.map((child: any) => getNodeText(child)).join("")
  }

  return ""
}

async function findDocPath(slug: string[]): Promise<string> {
  const files = await findAllDocFiles()
  const target = slug.join("/")

  const match = files.find((file) => file.routeSegments.join("/") === target)

  if (!match) {
    throw new Error(`Doc for slug "${slug.join("/")}" was not found under ${DOCS_ROOT}`)
  }

  return match.absolutePath
}

const InlineCode = (props: React.HTMLAttributes<HTMLElement>) => (
  <code
    {...props}
    className={[
      "rounded bg-muted px-1.5 py-0.5 font-mono text-sm",
      props.className,
    ]
      .filter(Boolean)
      .join(" ")}
  />
)

export async function compileDoc(slug: string[]): Promise<CompiledDoc> {
  const filePath = await findDocPath(slug)
  const source = await fs.readFile(filePath, "utf8")

  const headings: Heading[] = []

  const { content, frontmatter } = await compileMDX<DocFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: [
                  "ml-2 inline-flex h-5 w-5 items-center justify-center rounded text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100",
                ],
                "aria-hidden": "true",
                tabIndex: -1,
              },
            },
          ],
          createHeadingCollector(headings),
        ],
      },
    },
    components: {
      pre: (props) => {
        const child = React.Children.toArray(props.children)[0] as React.ReactElement | undefined

        if (child && child.props) {
          const language = typeof child.props.className === "string"
            ? child.props.className.replace("language-", "").trim()
            : undefined
          const code =
            typeof child.props.children === "string"
              ? child.props.children.trimEnd()
              : Array.isArray(child.props.children)
                ? child.props.children.join("")
                : ""

          if (language === "mermaid") {
            return <MermaidDiagram definition={code} />
          }

          return <CodeBlock code={code} language={language} />
        }

        return <pre {...props} />
      },
      code: InlineCode,
    },
  })

  const normalizedFrontmatter: DocFrontmatter = {
    ...frontmatter,
    title: frontmatter.title ?? fallbackTitle(slug[slug.length - 1]),
  }

  return {
    slug,
    filePath,
    frontmatter: normalizedFrontmatter,
    content,
    headings,
  }
}

export async function readDocFrontmatter(slug: string[]): Promise<DocFrontmatter> {
  const filePath = await findDocPath(slug)
  const raw = await fs.readFile(filePath, "utf8")
  const { data } = matter(raw)

  const frontmatter = data as Partial<DocFrontmatter>

  return {
    title: frontmatter.title ?? fallbackTitle(slug[slug.length - 1]),
    description: frontmatter.description,
    order: frontmatter.order,
    section: frontmatter.section,
    sidebarLabel: frontmatter.sidebarLabel,
    toc: frontmatter.toc,
    hideInSidebar: frontmatter.hideInSidebar,
  }
}

export async function getAllDocEntries(): Promise<{
  slug: string[]
  frontmatter: DocFrontmatter
  originalSegments: string[]
}[]> {
  const files = await findAllDocFiles()

  return Promise.all(
    files.map(async (file) => {
      const frontmatter = await readDocFrontmatter(file.routeSegments)
      return {
        slug: file.routeSegments,
        originalSegments: file.originalSegments,
        frontmatter,
      }
    }),
  )
}

export async function getAllDocSlugs(): Promise<string[][]> {
  const files = await findAllDocFiles()
  return files.map((file) => file.routeSegments)
}

async function findAllDocFiles(): Promise<DocFileRecord[]> {
  if (docFilesCache) return docFilesCache

  const results: DocFileRecord[] = []

  async function walk(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(absolutePath)
        continue
      }

      if (!DOC_EXTENSIONS.some((extension) => entry.name.endsWith(extension))) {
        continue
      }

      const relativePath = path.relative(DOCS_ROOT, absolutePath)
      const originalSegments = toOriginalSegments(relativePath)
      const routeSegments = toRouteSegments(relativePath)

      results.push({
        absolutePath,
        relativePath,
        originalSegments,
        routeSegments,
      })
    }
  }

  await walk(DOCS_ROOT)

  docFilesCache = results.sort((a, b) => a.relativePath.localeCompare(b.relativePath))

  return docFilesCache
}

function toOriginalSegments(relativePath: string): string[] {
  const withoutExt = removeExtension(relativePath)
  return withoutExt.split(path.sep)
}

function toRouteSegments(relativePath: string): string[] {
  return toOriginalSegments(relativePath).map(slugifySegment)
}

function removeExtension(relativePath: string): string {
  for (const extension of DOC_EXTENSIONS) {
    if (relativePath.endsWith(extension)) {
      return relativePath.slice(0, -extension.length)
    }
  }
  return relativePath
}

function slugifySegment(segment: string): string {
  const normalized = segment
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return normalized.length > 0 ? normalized : segment.toLowerCase()
}

function fallbackTitle(segment?: string): string {
  if (!segment) return "Untitled"

  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export const docsRoot = DOCS_ROOT
