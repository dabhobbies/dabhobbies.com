
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { CartSheet } from "./cart/CartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { SearchComponent } from "./SearchComponent";

const navLinks = [
  { href: "/shop", label: "Shop" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0" prefetch={true}>
          <Image src="https://res.cloudinary.com/dui1k0xfz/image/upload/v1761549162/logo-dabhobbies_ji1j8s.webp" alt="Dab Hobbies logo" width={120} height={40} className="object-contain" />
        </Link>
        
        {/* Advanced Search Component for desktop */}
        <div className="hidden sm:flex flex-1 justify-center">
            <div className="w-full max-w-md">
                <SearchComponent />
            </div>
        </div>

        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <CartSheet />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-transparent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 border-white/20">
                 <div className="p-2">
                    <SearchComponent />
                 </div>
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      prefetch={true}
                      className="font-headline uppercase"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
