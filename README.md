# Valoroast

<a href="https://github.com/bw3sley/valoroast/blob/main/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"/>
</a>

</br>

![Preview Screen](./assets/cover.png)

## 💻 About this project

Valoroast turns a Valorant player's stats into a joke verdict. Enter a Riot ID, and the app pulls recent match data, then writes a short, exaggerated roast you can send to the friend who keeps dying first on site. Every roast is saved with a share link and can be downloaded as a card, and you can put two players against each other to see who is the bigger disappointment. [Try Valoroast](https://valoroast.com/).

It started as a side project to roast my Valorant friends. It makes no attempt at serious analysis. The point is a laugh and a link to share.

I'll be happy if you could send me any feedback about the project, code, structure or anything that you can report that could make me better as a developer!

And you can use this project as you wish!

## :octocat: Cloning repo

```bash
$ git clone https://github.com/bw3sley/valoroast.git

$ cd valoroast

$ npm install

$ cp .env.example .env.local

$ npm run db:migrate

$ npm run dev
```

Fill `.env.local` first with `OPENAI_API_KEY`, `HENRIKDEV_API_KEY` and `DATABASE_URL`. The app runs at http://localhost:3000.

## 🚀 Built with

This project was built with:

- Next.js 16 and TypeScript
- Tailwind CSS v4
- Radix UI
- Vercel AI SDK with OpenAI
- Neon Postgres and Drizzle ORM
- TanStack Query
- Biome

## ⚠️ Disclaimer

Valoroast isn't endorsed by Riot Games and doesn't reflect the views of Riot Games or anyone officially involved in producing or managing Riot Games properties. Player data comes from an unofficial third-party API and may break.

## 📩 Reach me out

You can reach me at bw3sley@gmail.com or connect with me at [LinkedIn](https://www.linkedin.com/in/bw3sley)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
