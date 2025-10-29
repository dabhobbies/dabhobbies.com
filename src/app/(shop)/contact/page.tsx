
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Phone, Mail, MapPin, MessageSquare, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function ContactUsPage() {
  const contactImage = PlaceHolderImages.find((p) => p.id === "contact-us-hero");

  return (
    <div>
        <div className="fixed inset-0 -z-10">
            <Image 
                src="https://www.transparenttextures.com/patterns/dark-denim.png"
                alt="Background texture"
                fill
                className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a0a0a] to-background opacity-90"/>
        </div>
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
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
                <div className="w-full h-full rounded-lg overflow-hidden">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.026153311093!2d110.35832457471228!3d-7.787051692232757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5824a4bb5745%3A0xfe7dd0f02ea55806!2sDab%20Hobbies!5e0!3m2!1sen!2sid!4v1761560648323!5m2!1sen!2sid" 
                        width="100%" 
                        height="100%" 
                        style={{ border:0, minHeight: '400px' }} 
                        allowFullScreen={true}
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
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
