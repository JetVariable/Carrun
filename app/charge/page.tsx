import { Suspense } from "react";
import ChargeContent from "./ChargeContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ChargeContent />
    </Suspense>
  );
}