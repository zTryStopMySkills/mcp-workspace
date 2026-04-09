'use client'

const items = [
  '🎂 Cumpleaños',
  '♻️ ECOfriendly',
  '🌿 Naturaleza',
  '⭐ 5 Estrellas',
  '🎨 Creatividad',
  '🤝 Valores',
  '🌍 Sostenible',
  '🏆 Diversión',
  '🎉 Celebraciones',
  '🌱 Talleres',
]

export default function MarqueeSection() {
  const doubled = [...items, ...items]
  return (
    <div className="bg-[#1A3020] py-5 overflow-hidden" aria-hidden="true">
      <div className="flex animate-marquee whitespace-nowrap gap-0">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-[family-name:var(--font-fredoka)] text-[#F0CE55] text-xl font-bold px-8 flex-none"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
