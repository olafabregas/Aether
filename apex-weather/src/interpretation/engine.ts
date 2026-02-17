// ============================================================================
// INTERPRETATION ENGINE
// Rule evaluation engine - first match wins
// ============================================================================

import type { InterpretationRule, Interpretation } from '../types/interpretation.types';

/**
 * Evaluate rules sequentially, return first match
 * @param snapshot - Weather snapshot to evaluate
 * @param rules - Array of rules (most specific first)
 * @returns Interpretation result from first matching rule
 */
export function evaluateRules<T>(
  snapshot: T,
  rules: InterpretationRule<T>[]
): Interpretation {
  for (const rule of rules) {
    if (rule.condition(snapshot)) {
      return {
        message: rule.message,
        details: rule.details,
        advice: rule.advice
      };
    }
  }
  
  // Fallback (should never reach here if rules include catch-all)
  return {
    message: 'Data available',
    details: 'Weather conditions monitored.',
    advice: 'Check current conditions regularly.'
  };
}
