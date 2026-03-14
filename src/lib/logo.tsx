import Image from "next/image";

const PROVIDER_LOGO: Record<string, string> = {
  OPENAI: "/logo/OpenAI/OpenAI_Symbol_0.svg",
  ANTHROPIC: "/logo/Claude/Claude_Logo_0.svg",
  GEMINI: "/logo/Google/Google_Symbol_0.svg",
};

interface ProviderLogoProps {
  provider: "OPENAI" | "ANTHROPIC" | "GEMINI" | null;
  size?: number;
}

export const ProviderLogo = ({ provider, size = 24 }: ProviderLogoProps) => {
  if (!provider || !PROVIDER_LOGO[provider]) return null;

  return (
    <Image
      src={PROVIDER_LOGO[provider]}
      alt={provider}
      width={size}
      height={size}
    />
  );
};
