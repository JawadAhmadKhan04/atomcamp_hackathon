import { StateGraph, START, END } from '@langchain/langgraph';
import { ComplaintState } from './state.js';
import { retrieveNode } from './nodes/retrieveNode.js';
import { classifyNode } from './nodes/classifyNode.js';
import { routeAndDraftNode } from './nodes/routeAndDraftNode.js';
import { draftRejectionNode } from './nodes/draftRejectionNode.js';
import { verifyNode } from './nodes/verifyNode.js';

/**
 * Branch after classification:
 * - "admit"     -> route + draft forward email to the Agency
 * - "reject"    -> draft rejection letter (Form A-I)
 * - "uncertain" -> skip both drafting steps, go straight to verify (which
 *                  will flag it for mandatory human review anyway)
 */
function routeAfterClassify(state) {
  const decision = state.admissibilityDecision?.decision;
  if (decision === 'admit') return 'routeAndDraft';
  if (decision === 'reject') return 'draftRejection';
  return 'verify';
}

const graph = new StateGraph(ComplaintState)
  .addNode('retrieve', retrieveNode)
  .addNode('classify', classifyNode)
  .addNode('routeAndDraft', routeAndDraftNode)
  .addNode('draftRejection', draftRejectionNode)
  .addNode('verify', verifyNode)
  .addEdge(START, 'retrieve')
  .addEdge('retrieve', 'classify')
  .addConditionalEdges('classify', routeAfterClassify, {
    routeAndDraft: 'routeAndDraft',
    draftRejection: 'draftRejection',
    verify: 'verify',
  })
  .addEdge('routeAndDraft', 'verify')
  .addEdge('draftRejection', 'verify')
  .addEdge('verify', END);

export const complaintAgentGraph = graph.compile();

/**
 * Run the full agentic pipeline for a single complaint.
 * @param {object} complaint - a row from register_complaints (camelCase or
 *   snake_case fields both supported by the nodes)
 * @returns {Promise<object>} full final state
 */
export async function runComplaintAgent(complaint) {
  const result = await complaintAgentGraph.invoke({ complaint });
  return result;
}
