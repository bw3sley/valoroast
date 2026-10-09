"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CompareRow } from "@/components/compare-row";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow } from "@/components/ui/eyebrow";
import { InputControl, InputError, InputRoot } from "@/components/ui/input";
import { useRoastFlow } from "@/contexts/roast-flow-context";
import { riotIdSchema } from "@/http/schemas/riot-id";

const challengeSchema = z.object({ rivalId: riotIdSchema });

type ChallengeValues = z.infer<typeof challengeSchema>;

export function ChallengeFriendDialog() {
  const {
    roast,
    rival,
    rivalPending,
    compareOpen,
    setCompareOpen,
    challenge,
    copyLink,
    downloadCard,
  } = useRoastFlow();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChallengeValues>({
    resolver: zodResolver(challengeSchema),
    defaultValues: { rivalId: "" },
  });

  function onSubmit({ rivalId }: ChallengeValues) {
    challenge(rivalId);
  }

  const error = errors.rivalId?.message;

  return (
    <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
      <DialogContent size="md">
        <DialogHeader>
          <Eyebrow variant="primary">1v1 case comparison</Eyebrow>
          <DialogTitle>Challenge a rival</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Type any Riot ID. We pull their file and put it next to yours. Fair
          warning: it rarely goes your way.
        </DialogDescription>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-4 flex flex-wrap gap-2"
        >
          <InputRoot variant="sunken" size="md" className="min-w-44 flex-1">
            <InputControl
              placeholder="Rival#TAG"
              aria-label="Rival Riot ID"
              aria-invalid={error ? true : undefined}
              {...register("rivalId")}
            />
          </InputRoot>

          <Button
            type="submit"
            size="md"
            disabled={rivalPending}
            data-testid="challenge-submit-button"
          >
            {rivalPending ? "Pulling file…" : "Challenge"}
          </Button>

          {error && <InputError className="w-full">{error}</InputError>}
        </form>

        {roast && rival && (
          <div className="mt-5 animate-in">
            <div className="flex justify-between font-condensed text-muted-foreground text-sm uppercase tracking-wider">
              <span>{roast.name.toUpperCase()}</span>
              <span className="text-success">
                {rival.rival.name.toUpperCase()}
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {rival.rows.map((row) => (
                <CompareRow key={row.label} row={row} />
              ))}
            </div>
            <Card variant="success" size="sm" className="mt-4">
              <div className="font-display text-success text-xl uppercase">
                {rival.outcome.winner.toUpperCase()} wins
              </div>
              <div className="mt-1 text-muted-foreground text-sm leading-normal">
                {rival.outcome.taunt}
              </div>
            </Card>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="inverse" size="sm" onClick={downloadCard}>
                Download 1v1 card
              </Button>
              <Button variant="secondary" size="sm" onClick={copyLink}>
                Copy link
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
