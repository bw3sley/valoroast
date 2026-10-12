import type { Metadata } from "next";
import { z } from "zod";

import { HomeScreen } from "@/components/home-screen";
import { SITE_NAME } from "@/constants/site";
import { findRoastById } from "@/db/queries/find-roast-by-id";

export async function generateMetadata({
  searchParams,
}: PageProps<"/">): Promise<Metadata> {
  const id = z.uuid().safeParse((await searchParams).r);

  if (!id.success) {
    return {};
  }

  const roast = await findRoastById(id.data).catch(() => null);

  if (!roast) {
    return {};
  }

  const name = `${roast.riot_game_name}#${roast.riot_tag_line}`;
  const title = `${name} got roasted: ${roast.verdict}`;
  const description = `${roast.roast_text.slice(0, 140).trimEnd()}...`;
  const url = `/?r=${id.data}`;
  const image = `/api/og/${id.data}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // User-generated pages stay out of search results.
    robots: { index: false, follow: true },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function Home() {
  return <HomeScreen />;
}
