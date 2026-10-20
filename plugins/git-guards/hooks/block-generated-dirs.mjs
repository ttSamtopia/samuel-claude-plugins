// PreToolUse hook for Write, Edit and MultiEdit. Blocks edits inside generated
// folders (dist, build, .next) and installed packages (node_modules).
let raw = "";
process.stdin.on("data", d => (raw += d));
process.stdin.on("end", () => {
  let input;
  try { input = JSON.parse(raw); } catch { process.stdout.write("{}"); return; }
  const ti = input.tool_input || {};
  const file = String(ti.file_path || ti.notebook_path || "").replace(/\\/g, "/");

  // Only look inside the project, so a parent folder named "build" doesn't trigger it.
  const base = String(input.cwd || process.env.CLAUDE_PROJECT_DIR || "").replace(/\\/g, "/").replace(/\/+$/, "");
  const rel = base && file.startsWith(base + "/") ? file.slice(base.length + 1) : file;

  const hit = /(^|\/)(dist|build|node_modules|\.next)\//.exec(rel);
  if (!hit) { process.stdout.write("{}"); return; }

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Blocked: " + file + " is inside " + hit[2] + "/. dist/, build/ and .next/ are build output and node_modules/ holds installed packages; both are overwritten on the next build or install. Change the source or the config instead.",
    },
  }));
});
