'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  shape: 'circle' | 'star' | 'leaf'
}

const COLORS = ['#F0CE55', '#E87838', '#8CC840', '#FFFFFF', '#F5F5C0']

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
    const ri = i === 0 ? r : r * 0.45
    ctx[i === 0 ? 'moveTo' : 'lineTo'](x + Math.cos(angle) * r, y + Math.sin(angle) * r)
    const a2 = angle + (2 * Math.PI) / 5 / 2
    ctx.lineTo(x + Math.cos(a2) * ri, y + Math.sin(a2) * ri)
  }
  ctx.closePath()
  ctx.fill()
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Crear partículas iniciales
    const shapes: Particle['shape'][] = ['circle', 'star', 'leaf']
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 5 + 2,
        opacity: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        // Mover
        p.x += p.vx
        p.y += p.vy
        p.opacity -= 0.0008

        // Reset cuando sale por arriba o se desvanece
        if (p.y < -20 || p.opacity <= 0) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + 10
          p.opacity = Math.random() * 0.4 + 0.1
          p.vy = -Math.random() * 0.5 - 0.2
          p.vx = (Math.random() - 0.5) * 0.4
        }

        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.size)
        } else {
          // Leaf: elipse rotada
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.vx * 10)
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size, p.size * 1.8, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
