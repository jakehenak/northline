export type AgentEvent =
  | { type: "status"; label: string }
  | { type: "text"; delta: string }
  | { type: "source"; url: string; title: string }
  | { type: "done" }
  | { type: "error"; message: string };

export type AgentRequestMessage = {
  role: "user" | "assistant";
  content: string;
};
