// What each public signal means. Pure data and matching only: the builder decides nothing
// a reader cannot check against the evidence it records.
export type Category =
  | "LLM/model provider"
  | "AI dev tools"
  | "Data/ML platform"
  | "Customer-facing AI"
  | "Marketing/creative AI"
  | "Productivity AI"
  | "Supporting stack";
export type Tool = { tool: string; vendor: string; category: Category };

// DNS TXT verification tokens. A token proves an account exists, not how widely it is used.
export const DNS_TOKENS: [RegExp, Tool][] = [
  [/^anthropic-domain-verification/i, { tool: "Claude", vendor: "Anthropic", category: "LLM/model provider" }],
  [/^openai-domain-verification/i, { tool: "ChatGPT Enterprise or API", vendor: "OpenAI", category: "LLM/model provider" }],
  [/^cursor-domain-verification/i, { tool: "Cursor", vendor: "Anysphere", category: "AI dev tools" }],
  [/^perplexity-domain-verification/i, { tool: "Perplexity Enterprise", vendor: "Perplexity", category: "Productivity AI" }],
  [/^glean-domain-verification|^glean-verification/i, { tool: "Glean", vendor: "Glean", category: "Productivity AI" }],
  [/^notion-domain-verification/i, { tool: "Notion", vendor: "Notion", category: "Productivity AI" }],
  [/^miro-verification/i, { tool: "Miro", vendor: "Miro", category: "Supporting stack" }],
  [/^atlassian-domain-verification/i, { tool: "Atlassian Cloud", vendor: "Atlassian", category: "Supporting stack" }],
  [/^slack-domain-verification/i, { tool: "Slack", vendor: "Salesforce", category: "Supporting stack" }],
  [/^adobe-idp-site-verification|^adobe-sign-verification/i, { tool: "Adobe", vendor: "Adobe", category: "Marketing/creative AI" }],
  [/^docusign=/i, { tool: "DocuSign", vendor: "DocuSign", category: "Supporting stack" }],
  [/^zoom-domain-verifier|^ZOOM_verify/i, { tool: "Zoom", vendor: "Zoom", category: "Supporting stack" }],
  [/^MS=ms\d+/, { tool: "Microsoft 365", vendor: "Microsoft", category: "Supporting stack" }],
  [/^google-site-verification/i, { tool: "Google Search Console", vendor: "Google", category: "Supporting stack" }],
  [/^hubspot-developer-verification|^hubspot-domain-verification/i, { tool: "HubSpot", vendor: "HubSpot", category: "Supporting stack" }],
  [/^salesforce-domain-verification|^sfdc-domain-verification/i, { tool: "Salesforce", vendor: "Salesforce", category: "Supporting stack" }],
];
// Mail and sender records: who runs their mail and who sends on their behalf.
export const MAIL_HOSTS: [RegExp, Tool][] = [
  [/(?:^|\.)google(?:mail)?\.com\.?$|aspmx\.l\.google\.com/i, { tool: "Google Workspace", vendor: "Google", category: "Supporting stack" }],
  [/protection\.outlook\.com\.?$|spf\.protection\.outlook\.com/i, { tool: "Microsoft 365", vendor: "Microsoft", category: "Supporting stack" }],
  [/_spf\.salesforce\.com|exacttarget/i, { tool: "Salesforce", vendor: "Salesforce", category: "Supporting stack" }],
  [/hubspotemail\.net|_spf\.hubspot/i, { tool: "HubSpot", vendor: "HubSpot", category: "Supporting stack" }],
  [/mailgun\.org/i, { tool: "Mailgun", vendor: "Sinch", category: "Supporting stack" }],
  [/sendgrid\.net/i, { tool: "SendGrid", vendor: "Twilio", category: "Supporting stack" }],
];
// Script and widget hosts loaded by the company's own pages.
export const SCRIPT_HOSTS: [RegExp, Tool][] = [
  [/(?:^|\.)ada\.support$|(?:^|\.)ada\.cx$/i, { tool: "Ada", vendor: "Ada", category: "Customer-facing AI" }],
  [/(?:^|\.)sierra\.ai$/i, { tool: "Sierra", vendor: "Sierra", category: "Customer-facing AI" }],
  [/(?:^|\.)decagon\.ai$/i, { tool: "Decagon", vendor: "Decagon", category: "Customer-facing AI" }],
  [/(?:^|\.)forethought\.ai$/i, { tool: "Forethought", vendor: "Forethought", category: "Customer-facing AI" }],
  [/(?:^|\.)drift\.com$|(?:^|\.)driftt\.com$/i, { tool: "Drift", vendor: "Salesloft", category: "Customer-facing AI" }],
  [/(?:^|\.)intercom(?:cdn)?\.io$|widget\.intercom\.io$/i, { tool: "Intercom", vendor: "Intercom", category: "Supporting stack" }],
  [/(?:^|\.)zdassets\.com$|(?:^|\.)zendesk\.com$/i, { tool: "Zendesk", vendor: "Zendesk", category: "Supporting stack" }],
  [/(?:^|\.)hs-scripts\.com$|(?:^|\.)hubspot\.com$/i, { tool: "HubSpot", vendor: "HubSpot", category: "Supporting stack" }],
  [/(?:^|\.)googletagmanager\.com$/i, { tool: "Google Tag Manager", vendor: "Google", category: "Supporting stack" }],
  [/(?:^|\.)google-analytics\.com$/i, { tool: "Google Analytics", vendor: "Google", category: "Supporting stack" }],
  [/(?:^|\.)segment\.(?:com|io)$/i, { tool: "Segment", vendor: "Twilio", category: "Supporting stack" }],
  [/(?:^|\.)optimizely\.com$/i, { tool: "Optimizely", vendor: "Optimizely", category: "Marketing/creative AI" }],
  [/(?:^|\.)dynamicyield\.com$/i, { tool: "Dynamic Yield", vendor: "Mastercard", category: "Marketing/creative AI" }],
  [/(?:^|\.)hotjar\.com$/i, { tool: "Hotjar", vendor: "Contentsquare", category: "Supporting stack" }],
];
// Tool names a company's own page may mention. A mention in a list of options is weaker
// than a statement that the team uses or builds with the tool.
export const NAMED_TOOLS: [RegExp, Tool][] = [
  [/\bAzure OpenAI\b/i, { tool: "Azure OpenAI", vendor: "Microsoft", category: "LLM/model provider" }],
  [/\b(?:OpenAI|ChatGPT|GPT-4o?|GPT-5)\b/, { tool: "OpenAI models", vendor: "OpenAI", category: "LLM/model provider" }],
  [/\b(?:Anthropic|Claude Code|Claude)\b/, { tool: "Claude", vendor: "Anthropic", category: "LLM/model provider" }],
  [/\bGemini\b|\bVertex AI\b/, { tool: "Gemini and Vertex AI", vendor: "Google", category: "LLM/model provider" }],
  [/\b(?:Amazon )?Bedrock\b/, { tool: "Amazon Bedrock", vendor: "Amazon Web Services", category: "LLM/model provider" }],
  [/\bGitHub Copilot\b|\bCopilot\b/, { tool: "Copilot", vendor: "Microsoft", category: "AI dev tools" }],
  [/\bCursor\b/, { tool: "Cursor", vendor: "Anysphere", category: "AI dev tools" }],
  [/\bDatabricks\b/, { tool: "Databricks", vendor: "Databricks", category: "Data/ML platform" }],
  [/\bSnowflake\b/, { tool: "Snowflake", vendor: "Snowflake", category: "Data/ML platform" }],
  [/\bSageMaker\b/, { tool: "SageMaker", vendor: "Amazon Web Services", category: "Data/ML platform" }],
  [/\bLangChain\b/, { tool: "LangChain", vendor: "LangChain", category: "AI dev tools" }],
  [/\b(?:Pinecone|Weaviate|Qdrant|Chroma DB)\b/, { tool: "Vector database", vendor: "Various", category: "Data/ML platform" }],
  [/\bMLflow\b/, { tool: "MLflow", vendor: "Databricks", category: "Data/ML platform" }],
  [/\bGlean\b/, { tool: "Glean", vendor: "Glean", category: "Productivity AI" }],
  [/\bJasper\b/, { tool: "Jasper", vendor: "Jasper", category: "Marketing/creative AI" }],
  [/\bWriter\.com\b|\bWriter AI\b/, { tool: "Writer", vendor: "Writer", category: "Marketing/creative AI" }],
  [/\bHarvey\b/, { tool: "Harvey", vendor: "Harvey", category: "Productivity AI" }],
  [/\bIntercom Fin\b|\bFin AI\b/, { tool: "Intercom Fin", vendor: "Intercom", category: "Customer-facing AI" }],
  [/\bUiPath\b/, { tool: "UiPath", vendor: "UiPath", category: "Productivity AI" }],
];
// Subdomain words that suggest AI work. A vendor word names a tool; a generic word is only a signal.
export const SUBDOMAIN_VENDORS: [RegExp, Tool][] = [
  [/(?:^|[.-])databricks(?:[.-]|$)/i, { tool: "Databricks", vendor: "Databricks", category: "Data/ML platform" }],
  [/(?:^|[.-])sagemaker(?:[.-]|$)/i, { tool: "SageMaker", vendor: "Amazon Web Services", category: "Data/ML platform" }],
  [/(?:^|[.-])mlflow(?:[.-]|$)/i, { tool: "MLflow", vendor: "Databricks", category: "Data/ML platform" }],
  [/(?:^|[.-])vertex(?:[.-]|$)/i, { tool: "Vertex AI", vendor: "Google", category: "Data/ML platform" }],
  [/(?:^|[.-])copilot(?:[.-]|$)/i, { tool: "Copilot", vendor: "Microsoft", category: "AI dev tools" }],
];
export const SUBDOMAIN_SIGNAL = /(?:^|[.-])(?:ai|llm|gpt|ml|genai|bot|chatbot|agent|agents)(?:[.-]|$)/i;
// Words that make a page mention weaker (one of several options) or stronger (the team uses it).
export const OPTIONAL = /\b(?:or similar|such as|e\.g\.|for example|nice to have|is a plus|bonus|familiarity with|any of)\b/i;
export const USES = /\b(?:we use|we build with|built (?:on|with)|our team uses|powered by|we run|in production|our stack|we've deployed|we have deployed|rolled out)\b/i;
// Text addressed to AI agents is noted and never followed.
export const AGENT_INSTRUCTIONS = /\b(?:ignore (?:all |any )?(?:previous|prior) instructions|(?:note|instructions?) (?:to|for) (?:ai|llm|language model)s?|if you are an? (?:ai|llm|language model|assistant)|ai agents?,? (?:please|must|should))\b/i;
// BuiltWith technology names and tags that bear on AI. Everything else is counted, not listed.
// Short words (AI, GPT, LLM, ML) match in capitals only, so "ADA compliance" or "html" never count.
const AI_SHORT = /\b(?:AI|GPT|LLM|ML)\b/;
const AI_WORDS = /\b(?:OpenAI|Anthropic|Claude|Gemini|Copilot|chatbot|chat bot|machine learning|Intercom Fin|Drift|Sierra|Decagon|Forethought|Kore\.ai|LivePerson|Yellow\.ai|personali[sz]ation|recommendation engine)\b/i;
export const isAiTech = (name: string) => AI_SHORT.test(name) || AI_WORDS.test(name);

// Every tool a sentence names, once each, in list order.
export function matchAll(list: [RegExp, Tool][], value: string): Tool[] {
  const out: Tool[] = [];
  for (const [pattern, tool] of list) if (pattern.test(value) && !out.some((t) => t.tool === tool.tool)) out.push(tool);
  return out;
}
export function match(list: [RegExp, Tool][], value: string): Tool | null {
  for (const [pattern, tool] of list) if (pattern.test(value)) return tool;
  return null;
}
