import type { Roast } from "@/types/roast";

const SIZE = 1080;

function cssVar(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  let line = "";
  let cursor = y;
  for (const word of text.split(" ")) {
    const next = `${line}${word} `;
    if (ctx.measureText(next).width > maxWidth) {
      ctx.fillText(line, x, cursor);
      cursor += lineHeight;
      line = `${word} `;
    } else {
      line = next;
    }
  }
  ctx.fillText(line, x, cursor);
}

export async function downloadRoastCard(roast: Roast) {
  await document.fonts.ready;

  const display = cssVar("--font-display");
  const condensed = cssVar("--font-condensed");
  const background = cssVar("--background");
  const foreground = cssVar("--foreground");
  const primary = cssVar("--primary");
  const success = cssVar("--success");
  const faint = cssVar("--faint-foreground");
  const border = cssVar("--border");

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, SIZE, 10);

  ctx.font = `700 34px ${condensed}`;
  ctx.fillText("VALOROAST", 72, 110);
  ctx.fillStyle = faint;
  ctx.font = `600 26px ${condensed}`;
  ctx.fillText(roast.caseNo, 72, 152);

  ctx.fillStyle = foreground;
  ctx.font = `60px ${display}`;
  ctx.fillText(roast.name.toUpperCase(), 72, 240);
  ctx.font = `52px ${display}`;
  wrapText(ctx, roast.roast, 72, 380, 930, 64);

  const stats: [string, string | number][] = [
    ["HS%", `${roast.hs}%`],
    ["WR", `${roast.wr}%`],
    ["ACS", roast.acs],
    ["AGENT", roast.agent.toUpperCase()],
  ];
  stats.forEach(([label, value], i) => {
    const x = 72 + i * 242;
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 800, 222, 120);
    ctx.fillStyle = faint;
    ctx.font = `600 22px ${condensed}`;
    ctx.fillText(label, x + 20, 838);
    ctx.fillStyle = foreground;
    ctx.font = `46px ${display}`;
    ctx.fillText(String(value), x + 20, 896);
  });

  ctx.fillStyle = success;
  ctx.font = `600 26px ${condensed}`;
  ctx.fillText(`BADGE: ${roast.badge.name.toUpperCase()}`, 72, 990);
  ctx.fillStyle = faint;
  ctx.font = `600 22px ${condensed}`;
  ctx.fillText("valoroast.gg — get yours", 72, 1032);

  const link = document.createElement("a");
  link.download = "valoroast.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
