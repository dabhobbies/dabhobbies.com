
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ShieldCheck, UserCog, Bike } from "lucide-react";

export default function AboutUsPage() {
  const aboutImage = PlaceHolderImages.find((p) => p.id === "about-us-hero");

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center text-center text-white">
        {aboutImage && (
            <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={aboutImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-8 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase drop-shadow-lg">
            Tentang Dab Hobbies
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
            Lebih dari sekadar toko, kami adalah bagian dari gaya hidup Anda.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto glass-card p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center uppercase">
              Dab Hobbies: Motorcycle & Lifestyle Apparel Store
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-8">
              Kami lahir dari hasrat yang sama dengan Anda: kecintaan terhadap dunia roda dua. Dab Hobbies bukan hanya sekadar toko, melainkan sebuah rumah bagi para pengendara yang mengerti bahwa motor adalah bagian dari identitas dan gaya hidup.
            </p>
            <p className="text-center text-muted-foreground">
              Kami menjual segala kebutuhan untuk bermotor dan juga kebutuhan lifestyle roda dua. Kami menyediakan berbagai macam artikel produk, dari ujung kepala sampai dengan ujung kaki. Tim sales kami yang berpengalaman akan memberikan pengalaman terbaik dan saran ahli untuk membantu Anda memilih produk yang paling sesuai dengan karakter dan kebutuhan Anda. Kami percaya, setiap perjalanan harus dilalui dengan gaya, keamanan, dan kepercayaan diri.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="mt-20">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">
                  Kenapa Memilih Kami?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="glass-card p-8">
                      <Bike className="mx-auto h-12 w-12 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2 uppercase">Koleksi Lengkap</h3>
                      <p className="text-muted-foreground text-sm">Dari helm hingga boots, temukan semua perlengkapan berkendara dan lifestyle Anda di satu tempat.</p>
                  </div>
                  <div className="glass-card p-8">
                      <UserCog className="mx-auto h-12 w-12 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2 uppercase">Tim Berpengalaman</h3>
                      <p className="text-muted-foreground text-sm">Dapatkan saran terbaik dari tim kami yang juga merupakan para antusias motor sejati.</p>
                  </div>
                   <div className="glass-card p-8">
                      <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2 uppercase">Kualitas Terjamin</h3>
                      <p className="text-muted-foreground text-sm">Kami hanya menyediakan produk-produk pilihan yang telah teruji kualitas dan keamanannya.</p>
                  </div>
              </div>
          </div>

           {/* Call to Action */}
          <div className="text-center mt-20">
            <p className="text-lg mb-4">Siap untuk meningkatkan gaya berkendara Anda?</p>
            <Button asChild size="lg" className="uppercase font-bold">
              <Link href="/shop">Jelajahi Koleksi Kami</Link>
            </Button>
          </div>

        </div>
      </section>
    </div>
  );
}
