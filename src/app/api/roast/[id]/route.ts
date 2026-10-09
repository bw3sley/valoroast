import { z } from "zod";

import { findRoastById } from "@/db/queries/find-roast-by-id";
import { errorResponse } from "@/http/error-response";
import { InvalidRequestError } from "@/http/errors/invalid-request-error";
import { toRoastResponse } from "@/http/functions/to-roast-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = z.uuid().safeParse((await params).id);
    if (!id.success) {
      throw new InvalidRequestError("Roast not found");
    }

    const roast = await findRoastById(id.data);
    if (!roast) {
      throw new InvalidRequestError("Roast not found");
    }

    return Response.json(toRoastResponse(roast));
  } catch (error) {
    return errorResponse(error);
  }
}
