import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;
    if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded-sm bg-subtle px-1 font-mono text-sm text-fg">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-medium">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const linked = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(token);
      if (linked) {
        nodes.push(
          <a
            key={key}
            href={linked[2]}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-border-strong underline-offset-4 hover:decoration-fg"
          >
            {linked[1]}
          </a>,
        );
      }
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Prose({ text }: { text: string }) {
  const chunks = text.split(/```/);
  return (
    <div className="space-y-3 text-base leading-normal text-fg">
      {chunks.map((chunk, chunkIndex) => {
        if (chunkIndex % 2 === 1) {
          const code = chunk.replace(/^\w+\n/, "");
          return (
            <pre
              key={chunkIndex}
              className="overflow-x-auto rounded-md bg-subtle p-3 font-mono text-sm leading-normal text-fg"
            >
              {code.replace(/\n$/, "")}
            </pre>
          );
        }
        return chunk
          .split(/\n{2,}/)
          .filter((block) => block.trim())
          .map((block, blockIndex) => {
            const lines = block.split("\n").filter((line) => line.trim());
            const isList = lines.length > 0 && lines.every((line) => /^[-\u2013]\s+/.test(line.trim()));
            if (isList) {
              return (
                <ul key={`${chunkIndex}-${blockIndex}`} className="space-y-1 pl-5">
                  {lines.map((line, lineIndex) => (
                    <li key={lineIndex} className="list-disc">
                      {inline(line.trim().replace(/^[-\u2013]\s+/, ""), `${chunkIndex}-${blockIndex}-${lineIndex}`)}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={`${chunkIndex}-${blockIndex}`}>
                {inline(block.replace(/\n/g, " "), `${chunkIndex}-${blockIndex}`)}
              </p>
            );
          });
      })}
    </div>
  );
}
