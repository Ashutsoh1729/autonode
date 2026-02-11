"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Blocks } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Automate Your Workflows with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Build powerful automation pipelines visually. Connect specialized nodes, integrate APIs, and let AI handle the complexity.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-11 px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="h-11 px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-3 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Blocks className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Visual Builder</h3>
              <p className="text-muted-foreground">
                Drag-and-drop interface to create complex workflows without writing code.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure & Private</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with self-hosted options. Your data stays yours.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Extensible</h3>
              <p className="text-muted-foreground">
                Connect to any API or service. Extend functionality with custom nodes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
