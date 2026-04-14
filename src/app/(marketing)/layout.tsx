import { Navbar } from "@/components/marketing/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto">{children}</main>
      <footer className="border-t py-6">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 md:h-12 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built by Autonode. The code is available on{" "}
            <a
              href="https://github.com/Ashutsoh1729/autonode"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
