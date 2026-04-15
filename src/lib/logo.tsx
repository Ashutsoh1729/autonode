import Image from "next/image";
import { Mail } from "lucide-react";

const PROVIDER_LOGO: Record<string, string> = {
  OPENAI: "/logo/OpenAI/OpenAI_Symbol_0.svg",
  ANTHROPIC: "/logo/Claude/Claude_Logo_0.svg",
  GEMINI: "/logo/Google/Google_Symbol_0.svg",
  RESEND: "/logo/logoipsum-396.svg",
  OPENROUTER: "/logo/openrouter.svg",
};

interface ProviderLogoProps {
  provider: "OPENAI" | "ANTHROPIC" | "GEMINI" | "RESEND" | "OPENROUTER" | "SMTP" | null;
  size?: number;
}

export const ProviderLogo = ({ provider, size = 24 }: ProviderLogoProps) => {
  if (!provider) return null;
  
  if (provider === "SMTP") {
    return <Mail width={size} height={size} className="inline-block mr-2" />;
  }

  if (!PROVIDER_LOGO[provider]) return null;

  return (
    <Image
      src={PROVIDER_LOGO[provider]}
      alt={provider}
      width={size}
      height={size}
    />
  );
};
