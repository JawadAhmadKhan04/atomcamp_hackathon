import { Annotation } from '@langchain/langgraph';

// Shared state threaded through every node in the graph. Each node reads
// what it needs and returns a partial update; LangGraph merges it in.
export const ComplaintState = Annotation.Root({
  // ---- input ----
  complaint: Annotation(), // raw complaint row from register_complaints

  // ---- step 1: retrieve ----
  retrievedRegulations: Annotation({
    default: () => [],
    reducer: (_prev, next) => next,
  }),

  // ---- step 2: classify ----
  admissibilityDecision: Annotation({
    default: () => null,
    reducer: (_prev, next) => next,
  }), // { decision: "admit" | "reject", reasons, citedRegulations, groundCode }

  // ---- step 3a / 3b: route or draft-rejection ----
  routingDecision: Annotation({
    default: () => null,
    reducer: (_prev, next) => next,
  }), // { office, investigatingOfficerRole, justification }

  forwardEmailDraft: Annotation({
    default: () => null,
    reducer: (_prev, next) => next,
  }), // { to, subject, body }

  rejectionLetterDraft: Annotation({
    default: () => null,
    reducer: (_prev, next) => next,
  }), // { subject, body, formReference }

  // ---- step 4: verify ----
  verification: Annotation({
    default: () => null,
    reducer: (_prev, next) => next,
  }), // { passed, confidence, issues: string[] }

  // ---- bookkeeping ----
  errors: Annotation({
    default: () => [],
    reducer: (prev, next) => prev.concat(next),
  }),
});
