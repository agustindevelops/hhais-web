"use server";

import { persistIntake } from "@/lib/intake/persist";
import type { IntakeActionResult, IntakeSavePayload } from "@/lib/intake/types";

export async function saveIntake(
  payload: IntakeSavePayload,
): Promise<IntakeActionResult> {
  return persistIntake(payload, { submit: false });
}

export async function submitIntake(
  payload: IntakeSavePayload,
): Promise<IntakeActionResult> {
  return persistIntake(payload, { submit: true });
}
