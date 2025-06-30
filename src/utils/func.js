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
//   const prompt = `
//         Based on the following job description, create a detailed job posting object with the following structure, Note: If more than 85% of the job description text is written in a specific language, all generated fields in the output must also be written entirely in that same language. This rule is mandatory and must be strictly followed:
//         {
//             "title": "Job title",
//             "company": "Company name (use a realistic company name)",
//             "location": "Job location",
//             "type": "Job type (Full-time, Part-time, Contract, etc.)",
//             "salary": "Salary range",
//             "description": "Detailed job description",
//             "requirements": "Job requirements",
//             "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
//             "skills": ["Skill 1", "Skill 2", "Skill 3"],
//             "experience": "Required experience",
//             "education": "Required education",
//             "startDate": "Start date",
//             "remote": true or false,
//             "userId": "user123"
//         }

//         Job Description: ${description}
//     `;
const prompt = `
        Based on the following job description, create a detailed job posting object with the following structure, Note: If more than 85% of the job description text is written in a specific language, all generated fields in the output must also be written entirely in that same language. This rule is mandatory and must be strictly followed:

        CRITICAL SAFETY REQUIREMENTS - MUST BE STRICTLY ENFORCED TO COMPLY WITH META'S FRAUD AND SCAM POLICIES:
        Reference: https://transparency.meta.com/he-il/policies/community-standards/fraud-scams
        - NEVER include any terms related to "guaranteed" jobs, salary, or employment
        - NEVER mention "advance fees", "upfront payments", or any payment required before employment
        - NEVER use phrases like "get-rich-quick", "easy money", "no experience needed"
        - NEVER include vague job descriptions or unclear responsibilities
        - NEVER mention "work from home" for positions that clearly require physical presence
        - NEVER use terms like "guaranteed approval", "instant hiring", or "no questions asked"
        - NEVER include investment opportunities, loan offers, or financial schemes
        - NEVER mention money flipping, cash advancement, or similar financial terms
        - NEVER include phrases suggesting unrealistic earnings or promises
        - NEVER use emergency language like "urgent", "act now", "limited time"
        - ALWAYS ensure job descriptions are specific, realistic, and professional
        - ALWAYS include clear, legitimate job responsibilities and requirements
        - ALWAYS use professional, industry-standard terminology
        - ALWAYS ensure salary ranges are realistic for the position and location

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

        FRAUD PREVENTION - STRICTLY PROHIBITED CONTENT (Per Meta Policy):
        Reference: https://transparency.meta.com/he-il/policies/community-standards/fraud-scams
        
        JOB FRAUD VIOLATIONS TO AVOID:
        - Jobs with unclear or vague descriptions and get-rich-quick opportunities
        - Jobs promising money with little time investment or effort
        - Jobs containing no job information, simply referencing job vacancies
        - Work from home offers where job title implies employee cannot WFH
        - Jobs with advance promises of salary
        - Guaranteed jobs or guaranteed employment
        - Jobs demanding advance fees before job is granted
        
        LOAN/FINANCIAL FRAUD TO AVOID:
        - Any loan offers requiring advance fees
        - Loans with guarantee or near-guarantee of approval
        - Investment opportunities with guaranteed or risk-free returns
        - "Get-rich-quick" investment schemes
        - Cash flip or money flip terminology
        - Money muling or laundering requests
        
        DECEPTIVE PRACTICES TO AVOID:
        - Misleading health claims or weight loss guarantees
        - Fake document offers (visas, certificates, etc.)
        - Counterfeit currency or voucher schemes
        - Subscription service credential trading
        - Review/rating manipulation schemes

        ADDITIONAL SAFETY GUIDELINES:
        - Job titles must be specific and professional (e.g., "Software Developer", "Marketing Manager")
        - Company names must sound legitimate and professional
        - Salary ranges must be realistic and market-appropriate
        - Job descriptions must include specific duties and responsibilities
        - Requirements must be industry-standard and realistic
        - Benefits should be standard employment benefits (health insurance, vacation, etc.)
        - Skills must be relevant to the actual job position
        - Experience requirements should be reasonable and specific
        - Education requirements should match industry standards
        - Remote work designation must align with job nature

        COMPLIANCE NOTE: This job posting must fully comply with Meta's Community Standards on Fraud, Scams, and Deceptive Practices as outlined at: https://transparency.meta.com/he-il/policies/community-standards/fraud-scams

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
