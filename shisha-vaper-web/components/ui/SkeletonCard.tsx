"use client";

interface SkeletonCardProps {
  className?: string;
}

export default function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`skeleton-card ${className}`}>
      {/* Imagen placeholder */}
      <div className="skeleton-block h-52 w-full rounded-sm mb-3" />
      {/* Badge */}
      <div className="skeleton-block h-4 w-20 rounded-full mb-2" />
      {/* Título */}
      <div className="skeleton-block h-5 w-3/4 rounded mb-1" />
      <div className="skeleton-block h-4 w-1/2 rounded mb-3" />
      {/* Precio */}
      <div className="skeleton-block h-6 w-24 rounded" />
    </div>
  );
}
