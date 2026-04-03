/**
 * Utility for resolving variable references in strings.
 * Supports references like {{variableName.property.nestedProperty}}
 * and handles undefined references gracefully.
 */

export type WorkflowData = Record<string, unknown>;

/**
 * Resolves variable references in a string using workflow data.
 * 
 * @param template - String containing variable references like {{variableName.property}}
 * @param workflowData - Object containing all node outputs keyed by variable name
 * @returns String with all variable references replaced with their values
 * 
 * @example
 * const workflowData = {
 *   httpNode: { status: 200, data: { message: "hello" } }
 * };
 * resolveVariables("Status: {{httpNode.status}}", workflowData);
 * // Returns: "Status: 200"
 */
export function resolveVariables(template: string, workflowData: WorkflowData): string {
  if (!template) return '';

  console.log('[Variable Resolution] Template:', template);
  console.log('[Variable Resolution] WorkflowData keys:', Object.keys(workflowData));
  console.log('[Variable Resolution] WorkflowData:', JSON.stringify(workflowData, null, 2));

  // Check if template contains {{ pattern
  if (!template.includes('{{')) {
    console.log('[Variable Resolution] No {{ pattern found in template');
    return template;
  }

  // Regex to match {{variable.reference.path}} patterns
  const variableRegex = /{{\s*([^}]+?)\s*}}/g;
  
  const result = template.replace(variableRegex, (match, variablePath) => {
    console.log('[Variable Resolution] Found pattern:', match, 'path:', variablePath);
    
    try {
      // Split the path by dots and traverse the workflowData
      const pathParts = variablePath.trim().split('.');
      console.log('[Variable Resolution] Resolving path:', pathParts);
      
      let current: unknown = workflowData;
      
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        console.log(`[Variable Resolution] Step ${i}: part="${part}", current type:`, typeof current);
        
        if (current === null || current === undefined) {
          console.log('[Variable Resolution] Current is null/undefined at step', i);
          return ''; // Return empty string for undefined path
        }
        
        // Handle array indices like items[0]
        if (part.includes('[') && part.endsWith(']')) {
          const arrayPart = part.substring(0, part.indexOf('['));
          const indexPart = part.substring(part.indexOf('[') + 1, part.length - 1);
          const index = parseInt(indexPart, 10);
          
          if (isNaN(index)) {
            console.log('[Variable Resolution] Invalid array index:', indexPart);
            return ''; // Invalid index
          }
          
          if (Array.isArray(current) && current[arrayPart as keyof typeof current] !== undefined) {
            current = current[arrayPart as keyof typeof current][index];
          } else {
            console.log('[Variable Resolution] Array or property not found:', arrayPart);
            return ''; // Array or property not found
          }
        } else {
          // Regular property access
          if (typeof current === 'object' && current !== null) {
            current = (current as Record<string, unknown>)[part];
            console.log('[Variable Resolution] After property access:', current);
          } else {
            console.log('[Variable Resolution] Cannot access property on non-object');
            return ''; // Property not found on non-object
          }
        }
      }
      
      // Handle the final value
      if (current === null || current === undefined) {
        console.log('[Variable Resolution] Final value is null/undefined');
        return '';
      }
      
      // If it's an object, we might want to stringify it for use in prompts
      if (typeof current === 'object') {
        console.log('[Variable Resolution] Final value is object, stringify:', typeof current);
        return JSON.stringify(current);
      }
      
      console.log('[Variable Resolution] Final value:', current);
      return String(current);
    } catch (error) {
      // If anything goes wrong, return empty string to avoid breaking the prompt
      console.warn('Failed to resolve variable reference:', variablePath, error);
      return '';
    }
  });

  console.log('[Variable Resolution] Result:', result);
  return result;
}

/**
 * Escapes literal {{ and }} sequences in a string so they aren't treated as variable references.
 * 
 * @param input - String that may contain literal {{ or }} sequences
 * @returns String with literal sequences escaped
 */
export function escapeVariableReferences(input: string): string {
  return input
    .replace(/{{/g, '{{{{')
    .replace(/}}/g, '}}}}');
}

/**
 * Unescapes previously escaped {{ and }} sequences.
 * 
 * @param input - String with escaped {{ or }} sequences
 * @returns String with original sequences restored
 */
export function unescapeVariableReferences(input: string): string {
  return input
    .replace(/{{{{/g, '{{')
    .replace(/}}}}/g, '}}');
}