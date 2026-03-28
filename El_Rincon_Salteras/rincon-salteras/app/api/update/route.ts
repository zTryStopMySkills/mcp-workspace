import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json')

export async function GET() {
  try {
    const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'))
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'Could not read content' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const current = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'))
    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    }
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(updated, null, 2), 'utf-8')
    revalidatePath('/')
    return NextResponse.json({ ok: true, updatedAt: updated.updatedAt })
  } catch {
    return NextResponse.json({ error: 'Could not update content' }, { status: 500 })
  }
}
