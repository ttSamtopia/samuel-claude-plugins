import type { Register } from 'claude-code'

const EDIT_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit']
const REMINDER = 'Unsaved changes in this session - /wrap saves them'

// One toast per stretch of edits; /wrap or a reload starts over.
let isNagged = false

const WRAP_TEXT =
  'Wrap up this session. Use the remember skill (remember:remember), then the revise-claude-md skill (claude-md-management:revise-claude-md), then save anything worth keeping to auto memory. Keep it short.'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'wrap',
      description: 'Save this session: remember, revise CLAUDE.md, then auto memory',
    })

    return next(e)
  })

  on('command.run', { command: 'wrap' }, async $ => {
    isNagged = false
    // Sent after this command returns, so the session is idle and it becomes its own turn.
    $.clock.after(300, () => void $.prompt.submit({ text: WRAP_TEXT, asUser: true }))

    return { text: 'Wrapping up this session.' }
  })

  // A short toast after the first edit; it uses no band or status slot.
  on('tool.call', async ($, e, next) => {
    if (!isNagged && EDIT_TOOLS.includes(e.tool as string)) {
      isNagged = true
      $.ui.toast(REMINDER, { timeoutMs: 8000 })
    }

    return next(e)
  })

  // A hand-typed /remember also counts as saving.
  on('prompt.submit', async ($, e, next) => {
    if (/^\/remember\b/.test(e.text.trim())) {
      isNagged = false
    }

    return next(e)
  })
}
