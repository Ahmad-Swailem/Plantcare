import { Link } from "wouter";
import { Home, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Link href="/">
            <a className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </a>
          </Link>
          <div className="flex-1" />
          <Link href="/add">
            <a className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Add Plant</span>
            </a>
          </Link>
        </div>
      </nav>
      <main className="container pb-20 pt-4">{children}</main>
    </div>
  );
}
