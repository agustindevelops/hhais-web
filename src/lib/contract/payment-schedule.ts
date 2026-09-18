import { parseFee, type IntakePaymentPlan } from "@/lib/intake/types";

export type PaymentInstallment = {
  label: string;
  amount: number;
};

export type PaymentSchedule = {
  plan: IntakePaymentPlan | null;
  total: number | null;
  installments: PaymentInstallment[];
};

const MONTHLY_DEPOSIT = 100;
const MONTHLY_INSTALLMENTS = 4;

function toCents(amount: number) {
  return Math.round(amount * 100);
}

function fromCents(cents: number) {
  return cents / 100;
}

function splitCents(totalCents: number, parts: number): number[] {
  if (parts <= 0) {
    return [];
  }

  const base = Math.floor(totalCents / parts);
  const remainder = totalCents - base * parts;
  return Array.from(
    { length: parts },
    (_, index) => base + (index < remainder ? 1 : 0),
  );
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function buildPaymentSchedule(
  fee: string,
  paymentPlanId: string,
  paymentPlans: IntakePaymentPlan[],
): PaymentSchedule {
  const total = parseFee(fee);
  const plan =
    paymentPlans.find((item) => item.id === paymentPlanId) ?? null;

  if (total == null || !plan) {
    return { plan, total, installments: [] };
  }

  const totalCents = toCents(total);

  switch (plan.slug) {
    case "pay_in_full":
      return {
        plan,
        total,
        installments: [
          { label: "Due upon signing this agreement", amount: total },
        ],
      };
    case "pay_half": {
      const [first, second] = splitCents(totalCents, 2);
      return {
        plan,
        total,
        installments: [
          {
            label: "Due upon signing this agreement",
            amount: fromCents(first),
          },
          {
            label: "Due upon project completion",
            amount: fromCents(second),
          },
        ],
      };
    }
    case "pay_monthly": {
      const depositCents = Math.min(toCents(MONTHLY_DEPOSIT), totalCents);
      const remainingCents = totalCents - depositCents;
      const months = splitCents(remainingCents, MONTHLY_INSTALLMENTS);

      return {
        plan,
        total,
        installments: [
          {
            label: "Deposit due upon signing this agreement",
            amount: fromCents(depositCents),
          },
          ...months.map((cents, index) => ({
            label: `Monthly payment ${index + 1} of ${MONTHLY_INSTALLMENTS}`,
            amount: fromCents(cents),
          })),
        ],
      };
    }
    default:
      return { plan, total, installments: [] };
  }
}
