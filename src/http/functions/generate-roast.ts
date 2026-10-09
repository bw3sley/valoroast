import "server-only";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";

import {
  DEFAULT_OPENAI_MODEL,
  ROAST_MAX_OUTPUT_TOKENS,
  ROAST_SYSTEM_PROMPT,
} from "@/constants/openai";
import { UpstreamError } from "@/http/errors/upstream-error";
import { roastOutputSchema } from "@/http/schemas/roast-output";
import type { PlayerStats } from "@/types/roast";

function buildCaseNumber(riotId: string) {
  let h = 7;
  for (const char of riotId.toLowerCase()) {
    h = (h * 31 + char.charCodeAt(0)) >>> 0;
  }
  return `CASE #${String(h % 99999).padStart(5, "0")}`;
}

function describeStreak(form: PlayerStats["form"]) {
  const [latest] = form;
  const length = form.findIndex((result) => result !== latest);
  const count = length === -1 ? form.length : length;
  return `${latest === "W" ? "won" : "lost"} the ${count === 1 ? "latest match" : `latest ${count} matches in a row`}`;
}

export async function generateRoast(riotId: string, stats: PlayerStats) {
  try {
    const { output } = await generateText({
      model: openai(process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL),
      output: Output.object({ schema: roastOutputSchema }),
      system: ROAST_SYSTEM_PROMPT,
      maxOutputTokens: ROAST_MAX_OUTPUT_TOKENS,
      prompt: [
        `<player>${riotId}</player>`,
        `<stats>Headshot %: ${stats.hs} | Winrate %: ${stats.wr} | ACS: ${stats.acs} | K/D: ${stats.kd} | Agent: ${stats.agent} | Last ${stats.form.length} (newest first): ${stats.form.join(" ")} | Current streak: ${describeStreak(stats.form)}</stats>`,
      ].join("\n"),
    });

    return { ...output, caseNo: buildCaseNumber(riotId) };
  } catch (error) {
    console.error(error);
    throw new UpstreamError("Roast generation failed");
  }
}
