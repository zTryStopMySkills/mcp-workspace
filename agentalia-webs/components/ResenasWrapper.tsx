"use client";

import Resenas from "./Resenas";

interface Review {
  id: string;
  author_name: string;
  business_name?: string;
  location?: string;
  rating: number;
  content: string;
  created_at: string;
}

export default function ResenasWrapper({ reviews }: { reviews: Review[] }) {
  return <Resenas reviews={reviews} />;
}
