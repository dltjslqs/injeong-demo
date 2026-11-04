import type { Metadata } from "next";
import { ColumnFactoryCost, factoryCost } from "@/components/sites/injeong/ColumnFactoryCost";
import { CtaBand } from "@/components/sites/injeong/CtaBand";

export const metadata: Metadata = { title: factoryCost.title, description: factoryCost.text };

export default function FactoryCostPage() {
  return (
    <>
      <ColumnFactoryCost />
      <CtaBand />
    </>
  );
}
