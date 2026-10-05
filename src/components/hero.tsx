import { Diamond } from "lucide-react";

import { RoastForm } from "@/components/roast-form";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="pt-13 md:pt-20 lg:pt-24 pb-10 text-center">
      <Badge size="md">
        <Diamond className="fill-current" />
        Case file intake
      </Badge>
      <h1 className="mt-6 font-display text-4xl leading-none tracking-wide md:text-6xl lg:text-7xl text-balance uppercase">
        Drop your Riot ID.
        <br />
        <span className="text-primary">We&apos;ll tell you the truth.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-normal md:text-lg text-muted-foreground text-pretty">
        Our AI pulls your HS%, winrate, ACS, main agent and last 5 games — then
        cooks you in front of the whole lobby. No mercy, no coaching, no
        participation trophy.
      </p>
      <RoastForm />
    </section>
  );
}
