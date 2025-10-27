import Link from "next/link";
import { Github, Twitter, Facebook, Send } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-xl">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-3">
             <Link href="/" className="inline-block mb-4">
                <Image src="https://res.cloudinary.com/dui1k0xfz/image/upload/v1761549162/logo-dabhobbies_ji1j8s.webp" alt="Dab Hobbies logo" width={140} height={45} className="object-contain"/>
             </Link>
            <p className="text-sm text-muted-foreground mt-2">Your one-stop shop for premium motorcycle apparel.</p>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-headline uppercase font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop/category/helmets" className="text-sm text-muted-foreground hover:text-primary">Helmets</Link></li>
              <li><Link href="/shop/category/jackets" className="text-sm text-muted-foreground hover:text-primary">Jackets</Link></li>
              <li><Link href="/shop/category/gloves" className="text-sm text-muted-foreground hover:text-primary">Gloves</Link></li>
              <li><Link href="/shop/category/boots" className="text-sm text-muted-foreground hover:text-primary">Boots</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-headline uppercase font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="/orders/12345" className="text-sm text-muted-foreground hover:text-primary">Track Order</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Returns</Link></li>
            </ul>
          </div>

          <div className="md:col-span-5">
            <h4 className="font-headline uppercase font-semibold mb-4">Subscribe to our newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Get the latest updates on new products and upcoming sales.</p>
            <form className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-transparent" />
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex items-center gap-4 mt-6">
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
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Dab Hobbies. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
