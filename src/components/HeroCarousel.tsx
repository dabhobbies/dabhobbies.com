'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface HeroSlide {
    title: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    buttonText: string;
    buttonLink: string;
}

interface HeroCarouselProps {
    slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
    return (
        <section className="relative h-[85vh] w-full text-white">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                        stopOnInteraction: true,
                    }),
                ]}
                className="w-full h-full"
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full h-[85vh]">
                                <Image
                                    src={slide.imageUrl}
                                    alt={slide.description}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    data-ai-hint={slide.imageHint}
                                />
                                <div className="absolute inset-0 bg-black/50" />
                                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8 max-w-3xl mx-auto">
                                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase drop-shadow-lg">
                                        {slide.title}
                                    </h1>
                                    <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
                                        {slide.description}
                                    </p>
                                    <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg uppercase">
                                        <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                                    </Button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white border-white/30 hover:bg-black/50" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white border-white/30 hover:bg-black/50" />
            </Carousel>
        </section>
    );
}
