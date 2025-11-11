import { prisma } from '../config/prisma';

/**
 * Enumeration of available prompt types for different AI processing operations
 */
const promptTypes = {
  ANSWER_KEY: 'answer_key',
  EVALUATE: 'evaluation',
  QUESTION_PAPER: 'question_paper',
  STUDENT_ANSWER: 'student_answer'
} as const;

/**
 * Configuration object containing LLM model specifications and pricing
 * Maps model names to their respective costs and configurations
 */
const llmModels: Record<
  string,
  { inputTokenCost: number; modelName: string; outputTokenCost: number }
> = {
  'gemini-2.5-flash': {
    inputTokenCost: 0.3, // $0.30 per 1M input tokens
    modelName: 'gemini-2.5-flash',
    outputTokenCost: 0.6 // $0.60 per 1M output tokens
  },
  'gemini-2.5-pro': {
    inputTokenCost: 1.25, // $1.25 per 1M input tokens
    modelName: 'gemini-2.5-pro',
    outputTokenCost: 10.0 // $10.00 per 1M output tokens
  },
  'gpt-4o': {
    inputTokenCost: 2.5, // $2.50 per 1M input tokens
    modelName: 'gpt-4o',
    outputTokenCost: 10.0 // $10.00 per 1M output tokens
  },
  'gpt-4o-mini': {
    inputTokenCost: 0.15, // $0.15 per 1M input tokens
    modelName: 'gpt-4o-mini',
    outputTokenCost: 0.6 // $0.60 per 1M output tokens
  }
};

/**
 * Calculates the total cost for LLM token usage based on input and output tokens
 * Converts pricing from "per 1M tokens" to actual USD cost
 *
 * @param modelName - The name of the LLM model used
 * @param inputTokens - Number of input tokens consumed
 * @param outputTokens - Number of output tokens generated
 * @returns Object containing input cost, output cost, and total cost in USD
 */
const calculateLLMTokenCost = (modelName: string, inputTokens: number, outputTokens: number) => {
  const model = llmModels[modelName];

  // Convert costs from "per 1M tokens" to "per token" and calculate actual USD
  const inputCostPerToken = model.inputTokenCost / 1_000_000;
  const outputCostPerToken = model.outputTokenCost / 1_000_000;

  const inputTokenCostUSD = inputCostPerToken * inputTokens;
  const outputTokenCostUSD = outputCostPerToken * outputTokens;
  const totalCostUSD = inputTokenCostUSD + outputTokenCostUSD;

  return {
    currency: 'USD',
    formattedTotal: `$${totalCostUSD.toFixed(6)}`,
    inputTokenCost: inputTokenCostUSD,
    outputTokenCost: outputTokenCostUSD,
    totalCost: totalCostUSD
  };
};

/**
 * Configuration for LLM models used in different extraction operations
 * Specifies which model and temperature to use for each type of document processing
 */
const llmModelsForExtraction: Record<string, { modelName: string; temperature: number }> = {
  ANSWER_KEY_EXTRACTION: {
    modelName: 'gemini-2.5-pro',
    temperature: 0.1
  },
  EVALUATION: {
    modelName: 'gemini-2.5-pro',
    temperature: 0.2
  },
  QUESTION_PAPER_EXTRACTION: {
    modelName: 'gemini-2.5-pro',
    temperature: 0.1
  },
  STUDENT_ANSWER_EXTRACTION: {
    modelName: 'gemini-2.5-pro',
    temperature: 0.1
  }
};

/**
 * Retrieves the LLM prompt configuration from the database for a given prompt type
 * Fetches the stored prompt template that will be used for AI processing
 *
 * @param type - The prompt type identifier (e.g., 'evaluate', 'answer_key', etc.)
 * @returns Promise resolving to the LLM prompt string, or undefined if not found
 */
const getLLMPrompt = async (type: string) => {
  const prompt = await prisma.prompt.findFirst({
    where: {
      name: type
    }
  });
  return prompt?.llmPrompt;
};

export { calculateLLMTokenCost, getLLMPrompt, llmModelsForExtraction, promptTypes };
