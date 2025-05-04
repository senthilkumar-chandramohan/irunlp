import { DataSource } from 'typeorm';
import { ChatOpenAI } from '@langchain/openai';
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains/sql_db";
import dotenv from 'dotenv';

dotenv.config();

// Instantiate a ChatOpenAI object to call GPT
const llm = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo', // Specify the model name
  apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key from environment variables
  temperature: 0
});

// Define your PostgreSQL connection string
const connectionString = process.env.DATABASE_URL;

// Initialize the DataSource
const dataSource = new DataSource({
  type: 'postgres',
  url: connectionString,
  synchronize: false, // Set to true if you want TypeORM to auto-create database schema
  logging: false,
  ssl: {
    rejectUnauthorized: false, // Set to true if you want to reject unauthorized SSL certificates
  }
});

let chain:SqlDatabaseChain;

// Function to initialize the database connection
async function initializeDatabase() {
  try {
    // Initialize the DataSource
    await dataSource.initialize();

    // Create an instance of SqlDatabase using fromDataSourceParams
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: dataSource,
    });

    chain = new SqlDatabaseChain({
      llm,
      database: db,
      verbose: true,
  });

    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
}
  
initializeDatabase();

// Define a function to call GPT for a joke
export async function getJoke(): Promise<string> {
  try {
    const response = await llm.invoke("Write a poem about a cat in the style of Shakespeare.");
    return response.text;
  } catch (error) {
    console.error('Error fetching joke:', error);
    throw new Error('Failed to fetch a joke.');
  }
}

export async function queryDB(query:string): Promise<string> {
    try {
      const response = await chain.run(query);
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data.');
    }
}
  