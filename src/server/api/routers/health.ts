import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const healthRouter = createTRPCRouter({
    check: publicProcedure.query(({ ctx }) => {
        return { status: "ok", timestamp: new Date() };
    }),
});
