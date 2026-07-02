import { Suspense } from "react";
import CarteContent from "./CarteContent";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#0a0a0a",
          }}
        />
      }
    >
      <CarteContent />
    </Suspense>
  );
}