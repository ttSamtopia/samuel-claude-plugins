import { existsSync } from 'node:fs'
import { join } from 'node:path'

let raw = ''
process.stdin.on('data', d => (raw += d))
process.stdin.on('end', () => {
  let input
  try { input = JSON.parse(raw) } catch { return process.stdout.write('{}') }

  const file = input.tool_input?.file_path ?? ''
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || ''

  // Only repos that carry the toolbox-check skill (the TOP repos).
  if (!root || !existsSync(join(root, '.claude', 'skills', 'toolbox-check', 'SKILL.md'))) return process.stdout.write('{}')
  if (/(^|[\\/])(dist|node_modules)[\\/]/.test(file)) return process.stdout.write('{}')
  if (!/(\.(js|html|css)|[\\/]package\.json)$/.test(file)) return process.stdout.write('{}')

  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: `Before considering this edit to ${file} done, run the /toolbox-check skill on it to verify every construct used is covered in the relevant Toolbox file(s) (Toolbox - HTML / Toolbox - CSS / Toolbox - JavaScript, including its ES modules, package.json and webpack sections).`,
  }))
})
