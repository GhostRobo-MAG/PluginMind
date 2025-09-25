import { type Feature } from "@/types"

export const features: Feature[] = [
  {
    title: "Generic AI Processing",
    description:
      "Multi-use-case AI workflows supporting document analysis, chat processing, SEO content generation, crypto analysis, and custom processing types with configurable prompt templates.",
    image: "/images/features/ai-processing.png",
  },
  {
    title: "Plugin Service Registry",
    description:
      "Extensible plugin architecture with AI service registry supporting OpenAI, Grok, and custom providers with automatic service discovery and health monitoring.",
    image: "/images/features/plugin-registry.png",
  },
  {
    title: "Production Infrastructure",
    description:
      "Complete production setup with Docker multi-stage builds, Alembic migrations, CI/CD pipelines, and 107+ automated tests for reliable deployments.",
    image: "/images/features/infrastructure.png",
  },
  {
    title: "Authentication & Security",
    description:
      "Google OAuth integration with JWT validation, rate limiting, CORS configuration, and production-ready security headers for enterprise-grade protection.",
    image: "/images/features/security.png",
  },
  {
    title: "FastAPI Backend",
    description:
      "High-performance async FastAPI backend with comprehensive error handling, request validation, background job processing, and extensive API documentation.",
    image: "/images/features/backend.png",
  },
  {
    title: "Dockerized Deployment",
    description:
      "Complete Docker setup with multi-stage builds, Docker Compose orchestration, and production-ready containerization. Includes optimized images, health checks, and seamless scaling capabilities for cloud deployment.",
    image: "/images/features/docker-deployment.png",
  },
  {
    title: "User Dashboard",
    description:
      "Comprehensive user dashboard with account management, service usage analytics, billing integration, and real-time monitoring. Features responsive design, interactive charts, and intuitive controls for managing AI services.",
    image: "/images/features/user-dashboard.png",
  },
]
