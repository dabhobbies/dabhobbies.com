import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle2, Layers, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: 'Organized Components',
    description:
      'Reusable and well-structured components for rapid development.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Basic Page Routing',
    description: 'Effortless navigation setup with Next.js App Router.',
  },
  {
    icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
    title: 'Environment Ready',
    description:
      'Pre-configured for environment variables for a seamless setup.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline animate-fade-in-up">
                Build on a Solid Foundation
              </h1>
              <p
                className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                NextBase provides the essential building blocks for your Next.js
                application, so you can focus on creating, not configuring.
              </p>
            </div>
            <div
              className="space-x-4 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <Button size="lg" asChild>
                <Link href="#">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Core Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Everything You Need
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A perfect starting point for any modern web application.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="grid gap-1 text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Visually Appealing by Default
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Styled with a modern and clean design system using Tailwind CSS
              and ShadCN UI. It's responsive, accessible, and looks great on
              all devices.
            </p>
            <Button asChild>
              <Link href="#">View Components</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-lg"
                data-ai-hint={heroImage.imageHint}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
