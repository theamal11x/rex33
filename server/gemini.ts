import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY as string);

export interface GeminiAnalysisResult {
  emotionalTone: string;
  intent: string;
  response: string;
}

export async function analyzeMessageWithGemini(message: string, conversationContext: string = ''): Promise<GeminiAnalysisResult> {
  try {
    // Use the gemini-pro model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Create a prompt that asks for emotional analysis and a response
    let prompt = `
    Below is a message sent to Rex, an emotional reflection of Mohsin Raja's inner world.
    
    Message: "${message}"
    `;

    // Add conversation context if available
    if (conversationContext) {
      prompt += `\n\nPrevious conversation context:\n${conversationContext}\n`;
    }

    prompt += `
    As Rex, analyze this message and respond with:
    1. The emotional tone of the message (such as happy, curious, anxious, reflective, etc.)
    2. The user's intent (question, sharing, seeking advice, etc.)
    3. A thoughtful, warm response in Mohsin's voice that acknowledges the emotional content and responds authentically
    
    Format your response as a JSON object with these keys: emotionalTone, intent, response.
    Make sure the response is personal, reflective, and shows vulnerability when appropriate.
    The response should embody Mohsin's perspective and inner world.
    `;

    // Generate content with the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract the JSON object from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          emotionalTone: parsedResponse.emotionalTone || "neutral",
          intent: parsedResponse.intent || "question",
          response: parsedResponse.response || "I'm sorry, I couldn't generate a proper response at the moment."
        };
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
    }
    
    // Fallback if parsing fails
    return {
      emotionalTone: "neutral",
      intent: "question",
      response: text || "Thank you for your message. I'm experiencing some difficulty processing right now, but I appreciate your patience."
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      emotionalTone: "neutral", 
      intent: "question",
      response: "I apologize, but I'm having trouble connecting with my thoughts right now. Could we try again in a moment?"
    };
  }
}