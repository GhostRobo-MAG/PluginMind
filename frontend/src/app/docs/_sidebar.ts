export type SidebarItemConfig = {
  slug: string[]
  title?: string
}

export type SidebarSectionConfig = {
  id: string
  title: string
  description?: string
  match: string | string[]
  items?: SidebarItemConfig[]
}

export const SIDEBAR_SECTIONS: SidebarSectionConfig[] = [
  {
    id: 'overview',
    title: 'Overview',
    match: 'overview',
    items: [{ slug: ['overview'], title: 'Project Overview' }],
  },
  {
    id: 'guides',
    title: 'Guides',
    description: 'Implementation playbooks and day-to-day workflows.',
    match: 'guides',
    items: [
      { slug: ['guides', 'workflow-development'], title: 'Workflow Development' },
      { slug: ['guides', 'frontend-development'], title: 'Frontend Development' },
      { slug: ['guides', 'deployment-advanced'], title: 'Advanced Deployment' },
      { slug: ['guides', 'ai-service-integration'], title: 'AI Service Integration' },
      { slug: ['guides', 'security-hardening'], title: 'Security Hardening' },
      { slug: ['guides', 'ai-service-registry-playbook'], title: 'AI Service Registry Playbook' },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Core system topology and persistence layers.',
    match: 'architecture',
    items: [
      { slug: ['architecture', 'system-design'], title: 'System Design' },
      { slug: ['architecture', 'database-schema'], title: 'Database Schema' },
    ],
  },
  {
    id: 'api',
    title: 'API Reference',
    description: 'Authentication flows and HTTP interfaces.',
    match: 'api',
    items: [
      { slug: ['api', 'authentication'], title: 'Authentication' },
      { slug: ['api', 'endpoints'], title: 'Endpoints' },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Monitoring, testing, and incident response runbooks.',
    match: 'operations',
    items: [
      { slug: ['operations', 'monitoring'], title: 'Monitoring' },
      { slug: ['operations', 'testing'], title: 'Testing' },
      { slug: ['operations', 'troubleshooting'], title: 'Troubleshooting' },
    ],
  },
]
