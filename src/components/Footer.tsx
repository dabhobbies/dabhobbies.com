import Link from "next/link";
import { Github, Twitter, Facebook } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-xl">
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
             <Link href="/" className="inline-block mb-4">
                <Image src="https://res.cloudinary.com/dui1k0xfz/image/upload/v1761549162/logo-dabhobbies_ji1j8s.webp" alt="Dab Hobbies logo" width={120} height={40} className="object-contain"/>
             </Link>
            <p className="text-sm text-muted-foreground">Your one-stop shop for premium motorcycle apparel.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop/category/helmets" className="text-sm text-muted-foreground hover:text-primary">Helmets</Link></li>
              <li><Link href="/shop/category/jackets" className="text-sm text-muted-foreground hover:text-primary">Jackets</Link></li>
              <li><Link href="/shop/category/gloves" className="text-sm text-muted-foreground hover:text-primary">Gloves</Link></li>
              <li><Link href="/shop/category/boots" className="text-sm text-muted-foreground hover:text-primary">Boots</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="/orders/12345" className="text-sm text-muted-foreground hover:text-primary">Track Order</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Returns</Link></li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex items-center gap-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="#" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Dab Hobbies. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
