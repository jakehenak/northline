export const PROVIDERS = [
  {
    id: "grok",
    name: "Grok",
    blurb: "Built in. Can search, read X, and run code.",
  },
  {
    id: "openai",
    name: "ChatGPT",
    blurb: "Your OpenAI key, over chat completions.",
  },
  {
    id: "compatible",
    name: "Compatible",
    blurb: "Any server that speaks the OpenAI chat API.",
  },
] as const;

export type ProviderId = (typeof PROVIDERS)[number]["id"];

export const SKILLS = [
  {
    id: "plan",
    name: "Plan",
    blurb: "Splits the job into steps, then hands them on.",
    tool: null,
    maxTokens: 280,
  },
  {
    id: "research",
    name: "Research",
    blurb: "Looks up the web. Live on Grok.",
    tool: "web_search" as const,
    maxTokens: 480,
  },
  {
    id: "scout",
    name: "Scout",
    blurb: "Reads posts on X. Live on Grok.",
    tool: "x_search" as const,
    maxTokens: 480,
  },
  {
    id: "calculate",
    name: "Calculate",
    blurb: "Checks the math. Sandbox on Grok.",
    tool: "code_interpreter" as const,
    maxTokens: 480,
  },
  {
    id: "write",
    name: "Write",
    blurb: "Writes the answer from the nodes before it.",
    tool: null,
    maxTokens: 640,
  },
  {
    id: "review",
    name: "Review",
    blurb: "Checks that answer and rewrites it.",
    tool: null,
    maxTokens: 640,
  },
  {
    id: "specify",
    name: "Specify",
    blurb: "Writes a reusable task: trigger, inputs, outputs, and errors.",
    tool: null,
    maxTokens: 900,
  },
] as const;

export type SkillId = (typeof SKILLS)[number]["id"];
export type SkillTool = "web_search" | "x_search" | "code_interpreter";

export function getProvider(id: string) {
  return PROVIDERS.find((provider) => provider.id === id) ?? PROVIDERS[0];
}

export function getSkill(id: string) {
  return SKILLS.find((skill) => skill.id === id) ?? SKILLS[4];
}

export function chainOf(ids: readonly string[]) {
  const picked = new Set(ids);
  return SKILLS.filter((skill) => picked.has(skill.id));
}

export const PRESETS: { label: string; text: string; skills: SkillId[] }[] = [
  {
    label: "Write",
    skills: ["write"],
    text: "Plan a Saturday in Nashville: one walk, one meal, and a backup if it rains.",
  },
  {
    label: "Research",
    skills: ["research", "write"],
    text: "What should someone in Nashville know about the weather this weekend?",
  },
  {
    label: "Scout",
    skills: ["scout", "write"],
    text: "What are people on X saying about Grok this week? Give the range of takes, not one post.",
  },
  {
    label: "Calculate",
    skills: ["calculate", "write"],
    text: "Three 12-foot cedar boards at $4.80 a linear foot, plus 8% tax. What is the total?",
  },
];
