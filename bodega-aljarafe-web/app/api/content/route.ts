import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import type { ContentData } from '@/types'

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json')

export async function GET() {
  try {
    const raw = await fs.readFile(CONTENT_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({ error: 'No se pudo leer el contenido' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body: Partial<ContentData> = await request.json()

    const current = JSON.parse(await fs.readFile(CONTENT_PATH, 'utf-8')) as ContentData
    const updated: ContentData = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    await fs.writeFile(CONTENT_PATH, JSON.stringify(updated, null, 2), 'utf-8')
    revalidatePath('/')

    return NextResponse.json({ ok: true, updatedAt: updated.updatedAt })
  } catch (err) {
    console.error('Admin save error:', err)
    return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 })
  }
}
