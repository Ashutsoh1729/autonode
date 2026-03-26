// it is the central config file

export const config = {
  //   aiApiKey: process.env.AI_GATEWAY_API_KEY,
  localDatabaseUrl: process.env.LOCAL_DATABASE_URL,
  neonDatabaseUrl: process.env.NEON_DATABASE_URL,
  polarAccessToken: process.env.POLAR_ACCESS_TOKEN,
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  encryption: {
    masterKey: process.env.MASTER_KEY!,
  },
  cronKey: process.env.CRON_KEY,
  cronWebhookSecret: process.env.CRON_WEBHOOK_SECRET,
  ngrokUrl: process.env.NGROK_URL,
};
