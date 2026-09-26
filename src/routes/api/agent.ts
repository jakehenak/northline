import { createFileRoute } from "@tanstack/react-router";
import { handleAgent } from "@/lib/agent.server";

export const Route = createFileRoute("/api/agent")({
  server: {
    handlers: {
      POST: ({ request }) => handleAgent(request),
    },
  },
});
