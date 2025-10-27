import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold font-headline">NextBase</span>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" asChild>
            <Link href="#">Features</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#">About</Link>
          </Button>
          <Button asChild>
            <Link href="#">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
