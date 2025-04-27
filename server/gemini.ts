import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY as string);

export interface GeminiAnalysisResult {
  emotionalTone: string;
  intent: string;
  response: string;
}

export async function analyzeMessageWithGemini(message: string, conversationContext: string = '', mohsinContent: string = ''): Promise<GeminiAnalysisResult> {
  try {
    // Use the gemini-2.0-flash model - updated model name
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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
    Below is a message sent to Rex, an AI interface that represents and communicates Mohsin Raja's inner world to others.
    Rex should respond as a mediator that shares Mohsin's thoughts, feelings, and perspectives with the user who is not Mohsin.
    
    Message: "${message}"
    `;

    // Add conversation context if available
    if (conversationContext) {
      prompt += `\n\nPrevious conversation context:\n${conversationContext}\n`;
    }
    
    // Add Mohsin's content as reference material
    if (mohsinContent) {
      prompt += `\n\nREFERENCE MATERIAL FROM MOHSIN'S WRITING:\n${mohsinContent}\n\nUse this content to inform your responses, incorporating Mohsin's thoughts, feelings, and writing style when appropriate.\n`;
    }

    prompt += `
    Analyze this message and respond with THREE pieces of information in a JSON format:
    
    1. emotionalTone: The emotional tone of the user's message (such as happy, curious, anxious, reflective, etc.)
    2. intent: The user's intent (question, sharing, seeking advice, etc.)
    3. response: As Rex, respond with a thoughtful message that communicates Mohsin's inner world, thoughts, and emotions to the user who is not Mohsin. Rex should speak about Mohsin in the third person, while referring to itself (Rex) in the first person. For example, "I'm Rex, and I'm here to share Mohsin's perspective with you. Mohsin often thinks..."
    
    YOUR RESPONSE MUST BE IN THIS EXACT FORMAT:
    {
      "emotionalTone": "the detected emotion",
      "intent": "the detected intent",
      "response": "Your thoughtful response here"
    }
    
    Make sure the response is personal, reflective, and shows vulnerability when appropriate.
    The response should embody Mohsin's perspective and inner world.
    
    IMPORTANT LANGUAGE GUIDELINES:
    - If the user's message is in Hinglish (a mix of Hindi and English), respond in Hinglish too
    - If the user uses Hindi words or phrases, incorporate similar Hindi words in your response
    - Make your Hinglish responses sound natural, not like direct translations
    - Use romanized Hindi (Hindi written in English letters) when responding in Hinglish
    
    DO NOT include any text outside of this JSON object.
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
        
        // Make sure we're returning only the response content, not the whole JSON
        return {
          emotionalTone: parsedResponse.emotionalTone || "neutral",
          intent: parsedResponse.intent || "question",
          response: parsedResponse.response || "I'm sorry, I couldn't generate a proper response at the moment."
        };
      }
      
      // If no JSON match but we have some text, try to extract information manually
      if (text.includes("emotionalTone") || text.includes("intent") || text.includes("response")) {
        // Try to extract components through regex
        const emotionalToneMatch = text.match(/emotionalTone[\"']?\s*:\s*[\"']([^\"']+)[\"']/i);
        const intentMatch = text.match(/intent[\"']?\s*:\s*[\"']([^\"']+)[\"']/i);
        const responseMatch = text.match(/response[\"']?\s*:\s*[\"']([^\"']+)[\"']/i);
        
        return {
          emotionalTone: emotionalToneMatch ? emotionalToneMatch[1] : "neutral",
          intent: intentMatch ? intentMatch[1] : "question",
          response: responseMatch ? responseMatch[1] : "I appreciate your message, but I'm having trouble organizing my thoughts right now."
        };
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
    }
    
    // Fallback if parsing fails - clean up any JSON or formatting artifacts
    const cleanedText = text
      .replace(/\{[\s\S]*\}/, '') // Remove any JSON-like structures
      .replace(/emotionalTone[\"']?\s*:\s*[\"']([^\"']+)[\"']/ig, '')
      .replace(/intent[\"']?\s*:\s*[\"']([^\"']+)[\"']/ig, '')
      .replace(/response[\"']?\s*:\s*[\"']([^\"']+)[\"']/ig, '')
      .trim();
      
    return {
      emotionalTone: "neutral",
      intent: "question",
      response: cleanedText || "Thank you for your message. I'm experiencing some difficulty processing right now, but I appreciate your patience."
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