import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">Autonode</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {/* Add links here later */}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm">Sign In</Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
