
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

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex-shrink-0" prefetch={true}>
          <Image src="https://res.cloudinary.com/dui1k0xfz/image/upload/v1761549162/logo-dabhobbies_ji1j8s.webp" alt="Dab Hobbies logo" width={120} height={40} className="object-contain" />
        </Link>
        
        {/* Advanced Search Component for desktop */}
        <div className="hidden sm:flex flex-1 justify-center px-4">
          <SearchComponent />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
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
                  <DropdownMenuItem asChild>
                    <Link
                      href="/shop"
                      prefetch={true}
                      className="font-headline uppercase"
                    >
                      Shop
                    </Link>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
