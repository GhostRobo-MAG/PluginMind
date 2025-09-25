"use client"

import * as React from "react"
import Image from "next/image"
import { type Feature } from "@/types"
import Balancer from "react-wrap-balancer"

import { features } from "@/data/features"
import { useContentValue } from "@/providers/content-provider"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronRight, Code, Database, Shield, Zap, Container, BarChart3, ArrowRight, CheckCircle, GitBranch, Lock, Server, Activity } from "lucide-react"

const featureIcons = {
  "Generic AI Processing": Zap,
  "Plugin Service Registry": Code,
  "Production Infrastructure": Database,
  "Authentication & Security": Shield,
  "FastAPI Backend": Code,
  "Dockerized Deployment": Container,
  "User Dashboard": BarChart3,
}

const featureCategories = {
  "AI & Processing": ["Generic AI Processing", "Plugin Service Registry"],
  "Infrastructure": ["Production Infrastructure", "FastAPI Backend", "Dockerized Deployment"],
  "Security & UI": ["Authentication & Security", "User Dashboard"],
}

function renderFeatureVisualization(featureTitle: string): JSX.Element {
  switch (featureTitle) {
    case "Generic AI Processing":
      return (
        <div className="p-8 h-full flex flex-col justify-center">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-2">4-D Prompt Engine</h4>
            <p className="text-sm text-muted-foreground">Deconstruct → Diagnose → Develop → Deliver</p>
          </div>
          <div className="space-y-4">
            {[
              { step: "1. Deconstruct", desc: "Parse user input", icon: Zap },
              { step: "2. Diagnose", desc: "Validate & route", icon: CheckCircle },
              { step: "3. Develop", desc: "AI processing", icon: Code },
              { step: "4. Deliver", desc: "Structured response", icon: ArrowRight }
            ].map(({ step, desc, icon: Icon }, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">{step}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case "Plugin Service Registry":
      return (
        <div className="p-8 h-full flex flex-col justify-center">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-2">AI Service Architecture</h4>
            <p className="text-sm text-muted-foreground">Multi-provider orchestration</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">OpenAI</span>
                </div>
                <div className="text-xs text-muted-foreground">Prompt optimization</div>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg border-2 border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Grok</span>
                </div>
                <div className="text-xs text-muted-foreground">Analysis & sentiment</div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="h-4 w-4" />
                  <span className="text-sm font-medium">Registry</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">Service discovery</div>
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case "Production Infrastructure":
      return (
        <div className="p-8 h-full flex flex-col justify-center">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-2">Production Stack</h4>
            <p className="text-sm text-muted-foreground">107+ automated tests</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border-l-2 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Docker builds</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border-l-2 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">CI/CD pipelines</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border-l-2 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Database migrations</span>
              </div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-sm font-medium mb-2">Test Coverage</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <div className="text-xs text-muted-foreground">94% coverage</div>
            </div>
          </div>
        </div>
      )

    case "Authentication & Security":
      return (
        <div className="p-8 h-full flex flex-col justify-center">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-2">Security Flow</h4>
            <p className="text-sm text-muted-foreground">Enterprise-grade authentication</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div>Google OAuth</div>
              <div>JWT Validation</div>
              <div>Session Cookie</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-sm font-medium mb-1">Security Features</div>
              <div className="text-xs text-muted-foreground">Rate limiting • CORS • Security headers</div>
            </div>
          </div>
        </div>
      )

    case "FastAPI Backend":
      return (
        <div className="p-8 h-full flex flex-col justify-center">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-2">API Architecture</h4>
            <p className="text-sm text-muted-foreground">High-performance async backend</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">FastAPI</span>
                </div>
                <div className="text-xs text-muted-foreground">Async + OpenAPI docs</div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Health</span>
                </div>
                <div className="text-xs text-green-500">All systems operational</div>
              </div>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-sm font-medium mb-2">API Endpoints</div>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-green-600">GET /health</div>
                <div className="text-blue-600">POST /process</div>
                <div className="text-purple-600">GET /services/health</div>
              </div>
            </div>
          </div>
        </div>
      )

    case "Dockerized Deployment":
      return (
        <div className="p-8 h-full flex flex-col justify-center">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-2">Container Architecture</h4>
            <p className="text-sm text-muted-foreground">Multi-stage optimized builds</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Container className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Frontend</span>
                </div>
                <div className="text-xs text-muted-foreground">Next.js container</div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Container className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Backend</span>
                </div>
                <div className="text-xs text-muted-foreground">FastAPI container</div>
              </div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-sm font-medium mb-2">Docker Compose</div>
              <div className="text-xs text-muted-foreground">Orchestrated services with health checks</div>
            </div>
          </div>
        </div>
      )

    case "User Dashboard":
      return (
        <div className="p-8 h-full flex flex-col justify-center">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-2">Dashboard Interface</h4>
            <p className="text-sm text-muted-foreground">Real-time analytics & controls</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Analytics</span>
                </div>
                <div className="text-xs text-muted-foreground">Usage metrics</div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Monitoring</span>
                </div>
                <div className="text-xs text-muted-foreground">Real-time status</div>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border">
              <div className="text-sm font-medium mb-2">Account Management</div>
              <div className="text-xs text-muted-foreground">Billing • Subscriptions • Service controls</div>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center space-y-4">
            <Zap className="h-16 w-16 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Feature Visualization</p>
          </div>
        </div>
      )
  }
}

function getFeatureDetails(featureTitle: string): string[] {
  const details: Record<string, string[]> = {
    "Generic AI Processing": [
      "Multi-use-case AI workflows for document analysis, chat processing, SEO generation",
      "Configurable prompt templates for different processing types",
      "Support for multiple AI providers with automatic fallback",
      "Background job processing with status tracking"
    ],
    "Plugin Service Registry": [
      "Extensible plugin architecture for AI service integration",
      "Automatic service discovery and health monitoring",
      "Support for OpenAI, Grok, and custom providers",
      "Hot-swappable services with zero downtime"
    ],
    "Production Infrastructure": [
      "Complete Docker multi-stage build setup",
      "Alembic database migrations with proper versioning",
      "CI/CD pipelines ready for deployment",
      "107+ automated tests ensuring reliability"
    ],
    "Authentication & Security": [
      "Google OAuth integration with JWT validation",
      "Rate limiting with configurable capacity and refill rates",
      "CORS configuration for secure cross-origin requests",
      "Production-ready security headers and session management"
    ],
    "FastAPI Backend": [
      "High-performance async API with comprehensive error handling",
      "Request validation and serialization",
      "Background job processing capabilities",
      "Extensive API documentation with OpenAPI"
    ],
    "Dockerized Deployment": [
      "Multi-stage Docker builds for optimized images",
      "Docker Compose orchestration for development and production",
      "Health checks and container monitoring",
      "Seamless scaling capabilities for cloud deployment"
    ],
    "User Dashboard": [
      "Comprehensive account management interface",
      "Real-time service usage analytics and monitoring",
      "Billing integration with subscription management",
      "Responsive design with interactive charts and controls"
    ]
  }

  return details[featureTitle] || []
}

export function FeaturesSection() {
  const heading = useContentValue('landing.features.heading', 'Production-Ready')
  const highlight = useContentValue('landing.features.highlight', 'AI SaaS Features')
  const subheading = useContentValue('landing.features.subheading', 'Everything you need to build, deploy, and scale your AI SaaS application. From authentication to AI processing, we have got you covered.')
  const featureItems = useContentValue('landing.features.items', features)

  const [activeCategory, setActiveCategory] = React.useState<string>("AI & Processing")
  const [activeFeature, setActiveFeature] = React.useState<Feature | null>(featureItems?.[0] || null)

  return (
    <section
      id="features-section"
      aria-label="features section"
      className="w-full py-16"
    >
      <div className="container relative">
        {/* Header */}
        <div className="flex w-full flex-col items-center gap-6 text-center mb-16">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              {heading} <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {highlight}
              </span>
            </Balancer>
          </h2>
          <h3 className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              {subheading}
            </Balancer>
          </h3>
        </div>

        {/* Feature Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-16">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(featureCategories).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(featureCategories).map(([category, categoryFeatures]) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featureItems
                  .filter((feature) => categoryFeatures.includes(feature.title))
                  .map((feature) => {
                    const IconComponent = featureIcons[feature.title as keyof typeof featureIcons]
                    return (
                      <Card
                        key={feature.title}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-lg hover:scale-105",
                          activeFeature?.title === feature.title && "ring-2 ring-primary"
                        )}
                        onClick={() => setActiveFeature(feature)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm leading-6">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Feature Detail View */}
        {activeFeature && (
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{Object.keys(featureCategories).find(cat =>
                  featureCategories[cat as keyof typeof featureCategories].includes(activeFeature.title)
                )}</Badge>
              </div>
              <h3 className="text-3xl font-bold mb-4">{activeFeature.title}</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-8">
                {activeFeature.description}
              </p>

              {/* Feature highlights */}
              <div className="space-y-3 mb-6">
                {getFeatureDetails(activeFeature.title).map((detail, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button>
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">
                  View Documentation
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border shadow-2xl bg-gradient-to-br from-background to-secondary/20">
                {/* Feature visualization based on title */}
                {renderFeatureVisualization(activeFeature.title)}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
