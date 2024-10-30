export function fillPrompt(prompt: string, placeholders: Record<string, string>) {
  return prompt.replace(/\{\{([^}]+)}}/g, (match, key) => {
    return placeholders[key] || match;
  });
}
