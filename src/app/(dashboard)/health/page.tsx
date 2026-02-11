"use client";

import { api } from "@/trpc/react";

export default function HealthPage() {
    const { data, isLoading, error } = api.health.check.useQuery();

    if (isLoading) return <div className="p-8">Loading health status...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">System Health</h1>
            <div className="p-4 bg-muted rounded-lg border">
                <p><strong>Status:</strong> {data?.status}</p>
                <p><strong>Timestamp:</strong> {data?.timestamp.toString()}</p>
            </div>
        </div>
    );
}
