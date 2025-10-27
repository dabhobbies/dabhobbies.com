
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Phone, Mail, MapPin, MessageSquare, ExternalLink } from "lucide-react";

export default function ContactUsPage() {
  const contactImage = PlaceHolderImages.find((p) => p.id === "contact-us-hero");

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center text-center text-white">
        {contactImage && (
            <Image
                src={contactImage.imageUrl}
                alt={contactImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={contactImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-8 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase drop-shadow-lg">
            Hubungi Kami
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            
            {/* Contact Details */}
            <div className="glass-card p-8 md:p-10 space-y-6">
              <h2 className="text-3xl font-bold mb-6 uppercase">Detail Kontak</h2>
              
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Panggilan & Pesan</h3>
                  <p className="text-muted-foreground">Call: 0813 8686 5559</p>
                  <p className="text-muted-foreground">SMS/WA: +62 813 8686 5559</p>
                  <p className="text-muted-foreground">Telp (Jogja): (0274) 560524</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <a href="mailto:dab.hobbiesshop@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">dab.hobbiesshop@gmail.com</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">BBM</h3>
                  <p className="text-muted-foreground">58427D61</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Alamat</h3>
                  <p className="text-muted-foreground">Jalan Bumijo Tengah 21A, Yogyakarta</p>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
                <div className="w-full h-64 md:h-full rounded-lg overflow-hidden relative">
                     <Image
                        src="https://res.cloudinary.com/dui1k0xfz/image/upload/v1761549429/map-dabhobbies_e9p1b3.webp"
                        alt="Lokasi Dab Hobbies di Peta"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </div>
                 <Button asChild className="mt-6 uppercase font-bold w-full">
                    <a href="https://www.google.co.id/maps/dir/''/Dab+Hobbieshop" target="_blank" rel="noopener noreferrer">
                        Buka di Google Maps <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
