"use client";

import Button from "@/components/Elements/Button";

export default function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="print:hidden"
      onClick={() => window.print()}
    >
      Print / Save PDF
    </Button>
  );
}
