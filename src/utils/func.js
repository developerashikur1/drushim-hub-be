import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Configure OpenAI with API key
const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
};

export const isValidArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0 ? arr : [];
};

// Helper function to generate job post using AI
export async function generateJobPost(description) {
  const prompt = `
        Based on the following job description, create a detailed job posting object with the following structure:
        {
            "title": "Job title",
            "company": "Company name (use a realistic company name)",
            "location": "Job location",
            "type": "Job type (Full-time, Part-time, Contract, etc.)",
            "salary": "Salary range",
            "description": "Detailed job description",
            "requirements": "Job requirements",
            "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
            "skills": ["Skill 1", "Skill 2", "Skill 3"],
            "experience": "Required experience",
            "education": "Required education",
            "startDate": "Start date",
            "remote": true or false,
            "userId": "user123"
        }

        Job Description: ${description}
    `;

  try {
    const { text } = await generateText({
      model: openai('gpt-4o', openaiConfig), // Pass the config here
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Clean and parse the response
    let cleanedResponse = text
      .trim()
      .replace(/```json|```/g, '')
      .trim();
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }

    const jobPost = JSON.parse(cleanedResponse);
    return jobPost;
  } catch (error) {
    console.error('Error generating job post:', error);
    throw new Error('Failed to generate job post. Please try again.');
  }
}
