import { createFileRoute } from "@tanstack/react-router";
import { listLibrary, publishTask, removePublished } from "@/lib/github-library.server";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export const Route = createFileRoute("/api/library")({
  server: {
    handlers: {
      GET: async () => json(await listLibrary()),
      POST: async ({ request }) => {
        let body: { spec?: unknown; sha?: unknown } = {};
        try {
          body = (await request.json()) as { spec?: unknown; sha?: unknown };
        } catch {
          return json({ message: "That request is not valid." }, 400);
        }
        const sha = typeof body.sha === "string" ? body.sha : undefined;
        const result = await publishTask(body.spec, sha);
        if (!result.ok) return json({ message: result.message }, result.status);
        return json({ task: result.task, ...(await listLibrary()) });
      },
      DELETE: async ({ request }) => {
        let body: { slug?: unknown; sha?: unknown } = {};
        try {
          body = (await request.json()) as { slug?: unknown; sha?: unknown };
        } catch {
          return json({ message: "That request is not valid." }, 400);
        }
        const slug = typeof body.slug === "string" ? body.slug : "";
        const sha = typeof body.sha === "string" ? body.sha : "";
        const result = await removePublished(slug, sha);
        if (!result.ok) return json({ message: result.message }, result.status);
        return json(await listLibrary());
      },
    },
  },
});
