# Valoroast

![Cover](./assets/cover.png)

## Idea

Valoroast is a fun side project made to roast my Valorant friends using their in-game style and performance.

The goal is not serious analysis. It is to turn match stats and player habits into exaggerated, funny, shareable insults that make playing with friends more entertaining.

## Main experience

- Enter a Riot ID and generate a joke verdict
- Turn player stats into roast-style feedback
- Share funny results with friends
- Compare players in a rivalry-driven flow
- Make Valorant sessions more social and entertaining

## Tech

- Next.js 16 (App Router), React 19, Tailwind CSS v4
- Vercel `ai` SDK + OpenAI for the roast text
- TanStack Query for calling our API routes
- HenrikDev unofficial Valorant API for player stats
- Neon Postgres + Drizzle ORM for storing roasts and challenges

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `OPENAI_API_KEY`, `HENRIKDEV_API_KEY` and `DATABASE_URL` (Neon) (free key at https://api.henrikdev.xyz/dashboard/).
3. `npm run db:migrate`
4. `npm run dev`

## Disclaimer

Valoroast isn't endorsed by Riot Games and doesn't reflect the views of Riot Games or anyone officially involved in producing or managing Riot Games properties. Player data comes from an unofficial third-party API and may break.
