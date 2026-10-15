"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  InputAddon,
  InputControl,
  InputDescription,
  InputError,
  InputRoot,
} from "@/components/ui/input";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useRoastFlow } from "@/contexts/roast-flow-context";
import { riotIdSchema } from "@/http/schemas/riot-id";
import { trackEvent } from "@/utils/track-event";

const roastFormSchema = z.object({ riotId: riotIdSchema });

type RoastFormValues = z.infer<typeof roastFormSchema>;

export function RoastForm() {
  const { scan, view, clearError } = useRoastFlow();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoastFormValues>({
    resolver: zodResolver(roastFormSchema),
    defaultValues: { riotId: "" },
  });
  const error = errors.riotId?.message;

  return (
    <form
      className="mt-8"
      noValidate
      onSubmit={handleSubmit(
        ({ riotId }) => scan(riotId),
        () => {
          trackEvent(ANALYTICS_EVENTS.ROAST_FORM_INVALID);
          clearError();
        },
      )}
    >
      <div className="flex flex-wrap justify-center gap-2.5">
        <InputRoot className="sm:max-w-sm" size="lg">
          <InputAddon>ID</InputAddon>
          <InputControl
            aria-invalid={error ? true : undefined}
            aria-label="Riot ID"
            autoComplete="off"
            data-testid="riot-id-input"
            placeholder="Username#TAG"
            {...register("riotId")}
          />
        </InputRoot>

        <Button
          data-testid="roast-submit-button"
          disabled={view === "scanning"}
          size="lg"
          type="submit"
        >
          Roast me
        </Button>
      </div>

      <div className="mt-3 min-h-5 text-center">
        {error ? (
          <InputError>{error}</InputError>
        ) : view === "idle" ? (
          <InputDescription>
            Public stats only · no login · takes 3 seconds
          </InputDescription>
        ) : null}
      </div>
    </form>
  );
}
