<p align="center">
  <img src="./assets/cover.png" alt="Valoroast cover" width="100%" />
</p>

# Valoroast

Valoroast turns a Valorant player's stats into a joke verdict. Enter a Riot ID, and the app pulls recent match data, then writes a short, exaggerated roast you can send to the friend who keeps dying first on site.

It started as a side project to roast my Valorant friends. It makes no attempt at serious analysis. The point is a laugh and a link to share. [Try Valoroast](https://valoroast.com/).

## What you can do

- **Roast a player.** Type a Riot ID and get a verdict written from their agents, K/D, headshot rate and habits.
- **Share the result.** Every roast is saved and gets a share link, and you can download the verdict as a card to send to the person you just roasted.
- **Start a rivalry.** Put two players against each other and let the app decide who is the bigger disappointment.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Radix UI, Tailwind Variants |
| Roast text | Vercel AI SDK with OpenAI (`gpt-4o-mini` by default) |
| Player data | HenrikDev API, an unofficial Valorant API |
| Database | Neon Postgres with Drizzle ORM |
| Client state | TanStack Query, Zustand, React Hook Form, Zod |
| Abuse protection | `rate-limiter-flexible`, per IP and for HenrikDev calls |
| Icons | Lucide React |
| Analytics | PostHog (optional) |
| Tooling | Biome, Docker |

The app logic lives in Next.js route handlers under `src/app/api`, so the OpenAI and HenrikDev keys never reach the browser. Roasts are stored in Neon so each one can be opened again from its link. Rate limits keep the OpenAI bill and the HenrikDev quota under control.

Optional PostHog analytics runs only when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is set. It records fixed-choice actions. It excludes Riot IDs, rival IDs, roast text and any free text.

## Running it locally

```bash
npm install
cp .env.example .env.local   # add OPENAI_API_KEY, HENRIKDEV_API_KEY and DATABASE_URL
npm run db:migrate
npm run dev
```

The app runs at http://localhost:3000. `OPENAI_MODEL`, `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` are optional. Run `npm run lint` and `npm run build` to check your changes. A `Dockerfile` is included for deployment.

## Disclaimer

Valoroast isn't endorsed by Riot Games and doesn't reflect the views of Riot Games or anyone officially involved in producing or managing Riot Games properties. Player data comes from an unofficial third-party API and may break.

## Feedback

Have an idea or found something that feels off? [Open an issue](https://github.com/bw3sley/valoroast/issues). If you like the project, [leave it a star](https://github.com/bw3sley/valoroast).

## License

Valoroast is available under the [MIT License](./LICENSE.md).
