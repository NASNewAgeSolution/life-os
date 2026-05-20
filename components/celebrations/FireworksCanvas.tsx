'use client'

import { useEffect, useRef } from 'react'

interface FireworksCanvasProps {
  trigger: string | null
}

function launchFireworks(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const colors = ['#fbbf24','#34d399','#60a5fa','#c084fc','#fb923c','#22d3ee','#f87171','#fff']

  interface Particle {
    x: number; y: number
    vx: number; vy: number
    life: number; decay: number
    size: number; color: string
    trail: { x: number; y: number; life: number }[]
  }

  let particles: Particle[] = []

  function createBurst(x: number, y: number) {
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80
      const speed = 2 + Math.random() * 6
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.008,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      })
    }
  }

  let frame = 0
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (frame % 30 === 0 && frame < 180) {
      createBurst(
        100 + Math.random() * (canvas.width - 200),
        50 + Math.random() * (canvas.height * 0.5)
      )
    }
    particles = particles.filter(p => p.life > 0)
    particles.forEach(p => {
      p.trail.push({ x: p.x, y: p.y, life: p.life })
      if (p.trail.length > 8) p.trail.shift()
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.12
      p.vx *= 0.99
      p.life -= p.decay
      p.trail.forEach((t, i) => {
        ctx.beginPath()
        ctx.arc(t.x, t.y, p.size * (i / p.trail.length) * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(t.life * 80).toString(16).padStart(2, '0')
        ctx.fill()
      })
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.shadowBlur = 8
      ctx.shadowColor = p.color
      ctx.fill()
      ctx.shadowBlur = 0
    })
    frame++
    if (frame < 300) requestAnimationFrame(animate)
    else ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  animate()
}

export default function FireworksCanvas({ trigger }: FireworksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (trigger && canvasRef.current) {
      launchFireworks(canvasRef.current)
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}
    />
  )
}
