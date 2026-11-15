/**
 * OmniSkill - Perplexity AI Generator
 *
 * Generates instructions optimized for Perplexity Collections,
 * Search Profiles, and Perplexity API (Sonar & Sonar Pro).
 */

export function generatePerplexitySkill(skill) {
  let collectionPrompt = `# Role: ${skill.metadata.displayName}\n\n`;
  collectionPrompt += `## Core Objective\n${skill.metadata.description}\n\n`;
  collectionPrompt += `## Search & Research Directives\n`;
  collectionPrompt += `${skill.instructions.systemPrompt}\n\n`;

  // Tailor for Perplexity web-grounded research
  collectionPrompt += `## Perplexity Research Guidelines\n`;
  collectionPrompt += `- Synthesize search results with direct inline citations [1], [2].\n`;
  collectionPrompt += `- Prioritize primary sources, official documentation, and recent data.\n`;
  collectionPrompt += `- When uncertainty exists in search hits, highlight conflicting information objectively.\n`;

  if (skill.instructions.guidelines && skill.instructions.guidelines.length > 0) {
    collectionPrompt += `\n## Domain Rules\n`;
    for (const g of skill.instructions.guidelines) {
      collectionPrompt += `- ${g}\n`;
    }
  }

  // Perplexity Sonar API payload format
  const sonarConfig = {
    model: 'sonar-pro',
    messages: [
      {
        role: 'system',
        content: collectionPrompt.trim()
      }
    ],
    temperature: 0.2,
    top_p: 0.9,
    search_recency_filter: 'month',
    stream: false
  };

  const files = [
    {
      path: 'perplexity_collection.md',
      content: collectionPrompt.trim(),
      description: 'Perplexity AI Collection & Search Profile System Prompt'
    },
    {
      path: 'sonar_api_config.json',
      content: JSON.stringify(sonarConfig, null, 2),
      description: 'Perplexity Sonar / Sonar Pro API Request Config'
    }
  ];

  return {
    platform: 'perplexity',
    mainFile: 'perplexity_collection.md',
    content: collectionPrompt.trim(),
    files
  };
}
