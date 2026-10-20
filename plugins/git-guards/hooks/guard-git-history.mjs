// PreToolUse hook for Bash. Denies git commands that mention Claude or AI,
// and asks before commit, push, tag, rebase, reset, merge or cherry-pick.
let raw = "";
process.stdin.on("data", d => (raw += d));
process.stdin.on("end", () => {
  let input;
  try { input = JSON.parse(raw); } catch { process.stdout.write("{}"); return; }
  const cmd = (input.tool_input && input.tool_input.command) || "";

  if (!/\bgit\b[^|;&\n]*\b(commit|push|tag|rebase|reset|merge|cherry-pick)\b/.test(cmd)) {
    process.stdout.write("{}");
    return;
  }

  const out = (decision, reason) => process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: decision,
      permissionDecisionReason: reason,
    },
  }));

  if (/Claude-Session|Co-Authored-By|Generated with|claude\.ai\/code|noreply@anthropic|\bClaude\b/i.test(cmd)) {
    out("deny", "Blocked: this git command mentions Claude/AI (trailer, co-author, session URL, or similar). Commit messages must never reveal AI use. Remove it and retry.");
    return;
  }

  const isCommit = /\bgit\b[^|;&\n]*\bcommit\b/.test(cmd);
  out("ask", "Git commit/push/history change: confirm the user asked for this exact action." + (isCommit ? " Reminder: have you reviewed the diff? Ask for a review first if not." : ""));
});
