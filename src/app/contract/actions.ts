"use server";

import { signContract as signContractPersist } from "@/lib/contract/persist";
import type {
  SignContractPayload,
  SignContractResult,
} from "@/lib/contract/types";

export async function signContract(
  payload: SignContractPayload,
): Promise<SignContractResult> {
  return signContractPersist(payload);
}
