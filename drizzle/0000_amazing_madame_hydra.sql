CREATE TABLE "roast_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"opponent_riot_game_name" text NOT NULL,
	"opponent_riot_tag_line" text NOT NULL,
	"challenge_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delete_token_hash" text NOT NULL,
	"request_idempotency_key_hash" text,
	"dedupe_key" text NOT NULL,
	"riot_game_name" text NOT NULL,
	"riot_tag_line" text NOT NULL,
	"region" text,
	"case_no" text NOT NULL,
	"headshot_percentage" integer NOT NULL,
	"winrate_percentage" integer NOT NULL,
	"average_combat_score" integer NOT NULL,
	"most_used_agent" text NOT NULL,
	"last_match_results" text[] NOT NULL,
	"verdict" text NOT NULL,
	"roast_text" text NOT NULL,
	"badge_name" text NOT NULL,
	"badge_glyph" text NOT NULL,
	"badge_description" text NOT NULL,
	"roast_intensity" text,
	"stats_source_provider" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roasts_headshot_percentage_range" CHECK ("roasts"."headshot_percentage" between 0 and 100),
	CONSTRAINT "roasts_winrate_percentage_range" CHECK ("roasts"."winrate_percentage" between 0 and 100),
	CONSTRAINT "roasts_last_match_results_valid" CHECK (cardinality("roasts"."last_match_results") <= 5 and "roasts"."last_match_results" <@ array['W', 'L']::text[])
);
--> statement-breakpoint
ALTER TABLE "roast_challenges" ADD CONSTRAINT "roast_challenges_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "roast_challenges_roast_id_idx" ON "roast_challenges" USING btree ("roast_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roasts_request_idempotency_key_hash_idx" ON "roasts" USING btree ("request_idempotency_key_hash");--> statement-breakpoint
CREATE INDEX "roasts_dedupe_key_created_at_idx" ON "roasts" USING btree ("dedupe_key","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "roasts_created_at_idx" ON "roasts" USING btree ("created_at");