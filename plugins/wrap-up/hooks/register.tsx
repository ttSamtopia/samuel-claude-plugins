import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

// Files changed since the last wrap-up, and whether the band is hidden.
const changed = atom({ plugin: 'wrap-up', key: 'changed' } as const, false)
const isHidden = atom({ plugin: 'wrap-up', key: 'isHidden' } as const, false)

const EDIT_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit']

const WRAP_TEXT =
  'Wrap up this session. Run /remember, then /revise-claude-md, then save anything worth keeping to auto memory. Keep it short.'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'wrap',
      description: 'Save this session: /remember, /revise-claude-md, then auto memory',
    })

    return next(e)
  })

  on('command.run', { command: 'wrap' }, async $ => {
    await update($, changed, () => false)
    await update($, isHidden, () => false)
    void $.prompt.submit({ text: WRAP_TEXT, asUser: true })

    return { text: 'Wrapping up this session.' }
  })

  on('tool.call', async ($, e, next) => {
    if (EDIT_TOOLS.includes(e.tool as string)) {
      await update($, changed, () => true)
    }

    return next(e)
  })

  // A hand-typed /remember or /wrap also counts as saving.
  on('prompt.submit', async ($, e, next) => {
    if (/^\/(remember|wrap)\b/.test(e.text.trim())) {
      await update($, changed, () => false)
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const isQuiet = e.props.hasSurvey || !(await read($, changed)) || (await read($, isHidden))

    if (isQuiet) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>Session not saved </Text>
        <Button
          key="wrap"
          label="Wrap up"
          onPress={async () => {
            await update($, changed, () => false)
            void $.prompt.submit({ text: WRAP_TEXT, asUser: true })
          }}
        />
        <Text> </Text>
        <Button key="hide" label="Hide" onPress={() => update($, isHidden, () => true)} />
      </Box>
    )
  })
}
