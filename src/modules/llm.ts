import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

// Instantiate a ChatOpenAI object to call GPT
const openai = new ChatOpenAI({
  modelName: 'gpt-4', // Specify the model name
  apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key from environment variables
  temperature: 1
});

// Define a function to call GPT for a joke
export async function getJoke(): Promise<string> {
  try {
    const response = await openai.invoke("Tell me a joke.");
    return response.text;
  } catch (error) {
    console.error('Error fetching joke:', error);
    throw new Error('Failed to fetch a joke.');
  }
}