import "server-only";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";

import { DEFAULT_OPENAI_MODEL, ROAST_SYSTEM_PROMPT } from "@/constants/openai";
import { UpstreamError } from "@/http/errors/upstream-error";
import { roastOutputSchema } from "@/http/schemas/roast-output";
import type { PlayerStats, RoastResponse } from "@/types/roast";
import { buildCaseNumber } from "@/utils/case-number";

export async function generateRoast(
  id: string,
  stats: PlayerStats,
): Promise<RoastResponse> {
  try {
    const { output } = await generateText({
      model: openai(process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL),
      output: Output.object({ schema: roastOutputSchema }),
      system: ROAST_SYSTEM_PROMPT,
      prompt: [
        `Headshot %: ${stats.hs}`,
        `Winrate %: ${stats.wr}`,
        `ACS (average combat score): ${stats.acs}`,
        `Most played agent: ${stats.agent}`,
        `Last ${stats.form.length} matches (newest first): ${stats.form.join(" ")}`,
      ].join("\n"),
    });

    return { ...stats, id, ...output, caseNo: buildCaseNumber(id) };
  } catch (error) {
    console.error(error);
    throw new UpstreamError("Roast generation failed");
  }
}
