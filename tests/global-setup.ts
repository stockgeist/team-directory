import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { TestProject } from 'vitest/node'

// Starts `vite dev` on its own port with a fresh database, so tests never
// touch data/app.db and can run while you have `npm run dev` open.
const PORT = Number(process.env.TEST_PORT ?? 3100)

declare module 'vitest' {
  export interface ProvidedContext {
    baseUrl: string
  }
}

export default async function setup(project: TestProject) {
  const dataDir = mkdtempSync(join(tmpdir(), 'team-directory-test-'))
  const server = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', 'dev', '--port', String(PORT), '--strictPort'],
    {
      env: { ...process.env, DATABASE_PATH: join(dataDir, 'test.db') },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  let output = ''
  server.stdout.on('data', (chunk) => (output += chunk))
  server.stderr.on('data', (chunk) => (output += chunk))

  const baseUrl = `http://localhost:${PORT}`
  try {
    await waitUntilReady(baseUrl, () => server.exitCode !== null)
  } catch (error) {
    server.kill()
    throw new Error(`Test server did not start (${error}).\n\n${output}`)
  }
  project.provide('baseUrl', baseUrl)

  return () => {
    server.kill()
    rmSync(dataDir, { recursive: true, force: true })
  }
}

async function waitUntilReady(baseUrl: string, hasExited: () => boolean) {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    if (hasExited()) throw new Error('server process exited')
    try {
      const res = await fetch(`${baseUrl}/api/health`)
      if (res.ok) {
        await fetch(`${baseUrl}/`) // warm up SSR so the first test isn't slow
        return
      }
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('timed out after 60s')
}
