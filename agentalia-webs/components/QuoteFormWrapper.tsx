"use client";

import { useState } from "react";
import Planes from "./Planes";
import QuoteForm from "./QuoteForm";

export default function QuoteFormWrapper() {
  const [selectedPlan, setSelectedPlan] = useState("");

  return (
    <>
      <Planes onSelectPlan={setSelectedPlan} />
      <QuoteForm selectedPlan={selectedPlan} />
    </>
  );
}
