# Human-in-the-Loop

Human-in-the-loop (HITL) is a design pattern where AI systems operate autonomously but pause at critical decision points for human review and approval. In agentic coding, HITL defines the boundary between what the AI handles independently and what requires human judgment — balancing speed with safety.

> *In the 5-concept stack, HITL gates are typically implemented at the **Harness** layer (approval prompts, permission hooks, dangerous-tool blocks) and configured into specific **Agents** through their role and scope. See [AI Agents vs Harnesses](./agents-vs-harnesses) for the full stack.*

## Why HITL Matters

AI agents are powerful but imperfect. They can:
- Write code with subtle security vulnerabilities
- Make architectural decisions that create technical debt
- Misinterpret ambiguous requirements
- Take irreversible actions (deploying, deleting, publishing)

HITL ensures humans remain in control of high-stakes decisions while letting AI handle routine execution.

## The HITL Spectrum

```
Full Manual ←——————————————————→ Full Autonomous
     │         │         │         │         │
  Human does   Human     Human     Human     AI does
  everything   guides    reviews   monitors  everything
               AI        AI work   AI work
```

Most effective AI workflows sit in the "Human reviews" to "Human monitors" range.

## Common HITL Checkpoints

### In Agentic Coding
- **Before committing**: Review generated code changes
- **Before deploying**: Approve production deployments
- **Before external calls**: Approve API calls to third-party services
- **Before destructive actions**: Confirm file deletions, database migrations, force pushes
- **Architecture decisions**: Approve new dependencies, patterns, or structural changes

### In Business Operations
- **Customer-facing content**: Review AI-generated emails, support responses, blog posts
- **Financial transactions**: Approve payments, refunds, pricing changes
- **Data access**: Approve queries that touch sensitive data
- **Hiring**: Review AI-screened candidates before interviews

## Implementing HITL in Code

### Permission-Based Execution
```typescript
// Agent asks for approval before dangerous operations
const actions = {
  readFile: { requiresApproval: false },
  writeFile: { requiresApproval: false },
  runTests: { requiresApproval: false },
  deleteFile: { requiresApproval: true },
  gitPush: { requiresApproval: true },
  deploy: { requiresApproval: true },
  runMigration: { requiresApproval: true },
};
```

### Confidence-Based Escalation
```typescript
// AI escalates to human when uncertain
if (agent.confidence < 0.7) {
  await requestHumanReview({
    context: agent.currentTask,
    options: agent.proposedActions,
    reason: "Low confidence in approach"
  });
}
```

## HITL Design Principles

- **Minimize interruptions**: Only pause for genuinely high-stakes decisions. Too many checkpoints defeat the purpose of automation.
- **Provide context**: When requesting human input, show what the AI did, why, and what it proposes next.
- **Make review easy**: Present diffs, summaries, and impact assessments — don't make humans read through everything.
- **Learn from overrides**: When a human rejects an AI decision, feed that back to improve future behavior.
- **Fail safe**: If the human is unavailable, the system should wait or take the safer default action — never proceed with risky operations.

## HITL in AI Coding Tools

| Tool | HITL Implementation |
|------|-------------------|
| **Claude Code** | Permission prompts for file writes, commands, and network access |
| **Cursor** | Accept/reject per-change in diff view |
| **GitHub Copilot** | Tab to accept, Esc to reject suggestions |
| **Devin** | Slack-based review and approval workflow |

## Anti-Patterns

- **Rubber stamping**: Approving everything without reading — defeats the purpose
- **Over-gating**: Requiring approval for every minor action — kills productivity
- **Missing context**: Showing a "Proceed? Y/N" prompt without explaining what's happening
- **No escalation path**: Agent gets stuck with no way to request human help

## How It's Used in VibeReference

The VibeReference workflow embeds HITL at natural review points. After each day's AI-generated work, founders review and approve before moving forward. Day 1 ends with reviewing the prototype. Day 2 incorporates human feedback. Day 3 includes testing and review gates before features are considered complete. Day 5's launch checklist ensures a human verifies everything before going live. This structure gives founders the speed of AI execution with the safety of human judgment at every critical juncture.
