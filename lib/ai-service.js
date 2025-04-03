import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateHtmlFromElements } from "./html-generator";

// This will be replaced with your actual API key from environment variables
const getGenerativeAI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  if (!apiKey) {
    console.error("Missing Gemini API key");
    throw new Error("Missing Gemini API key");
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function generateEmailTemplate(
  templateName,
  subject,
  sender,
  tone = "professional"
) {
  console.log(
    `Generating email template for: ${templateName} with tone: ${tone}`
  );
  console.time("AI Generation Time");

  try {
    const genAI = getGenerativeAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    You are a Professional Email Template Builder AI Assistant
    Working on: ${templateName}
    Primary Subject: ${subject}
    Sender Identity: ${sender}
    Tone: ${tone}

    Create a complete, professional email template with the following requirements:
    
    1. The email should have a clear structure with:
      - A header with logo/branding
      - A greeting appropriate to the tone
      - Main content with paragraphs and possibly bullet points
      - A clear call-to-action
      - A professional signature
      - Footer with contact information
    
    2. The content should be relevant to the subject and maintain the specified tone throughout.
       IMPORTANT: Include substantial text content - at least 3-4 paragraphs with detailed information.
    
    3. Return the email in TWO formats:
      a) As a structured JSON array of elements that follows this schema:
      b) As complete HTML that can be directly rendered
    
    For the JSON elements, use this structure:
    [
      {
        "type": "LogoHeader",
        "label": "Logo Header",
        "imageUrl": "/placeholder.svg",
        "alt": "Company Logo",
        "style": {
          "backgroundColor": "#ffffff",
          "padding": "10px",
          "width": "150px"
        },
        "outerStyle": {
          "display": "flex",
          "justifyContent": "center",
          "backgroundColor": "#f8f9fa",
          "padding": "20px 0"
        },
        "id": "header-logo-1"
      },
      {
        "type": "Text",
        "label": "Text",
        "textarea": "Hello [Recipient],<br><br>I hope this email finds you well. I'm reaching out regarding [Subject].<br><br>Here is a detailed explanation of what we're offering...",
        "style": {
          "color": "#333333",
          "padding": "15px",
          "fontSize": "16px",
          "lineHeight": "1.6",
          "fontWeight": "normal"
        },
        "outerStyle": {
          "backgroundColor": "#ffffff",
          "padding": "10px 20px"
        },
        "id": "greeting-text-1"
      },
      {
        "type": "Button",
        "label": "Button",
        "content": "Click Here",
        "url": "#",
        "style": {
          "backgroundColor": "#4a7dfc",
          "color": "#ffffff",
          "padding": "12px 24px",
          "borderRadius": "4px",
          "fontSize": "16px",
          "fontWeight": "bold",
          "textAlign": "center"
        },
        "outerStyle": {
          "display": "flex",
          "justifyContent": "center",
          "padding": "20px 0"
        },
        "id": "cta-button-1"
      }
    ]

    For the HTML, create a complete, responsive email template that would render well in email clients.

    Make sure the content is engaging, relevant to the subject, and maintains the specified tone throughout.
    
    IMPORTANT GUIDELINES:
    - Include at least 3-4 substantial paragraphs of text content with detailed information
    - Use HTML formatting like <b>, <i>, <br> in text elements to enhance readability
    - Make sure image URLs are set to placeholder.svg with appropriate dimensions
    - Ensure all elements have proper styling and are fully editable
    - Create a visually appealing layout with proper spacing and alignment
    
    EXAMPLES:
    
    For a "Welcome Email" with a "friendly" tone:
    - Use warm, welcoming language
    - Include personalization elements
    - Add helpful resources for new users
    - Explain next steps in detail
    
    For a "Business Proposal" with a "formal" tone:
    - Use professional, concise language
    - Include clear value propositions
    - Maintain appropriate business etiquette
    - Provide detailed information about offerings
    
    For a "Product Launch" with an "enthusiastic" tone:
    - Use exciting, dynamic language
    - Highlight key features with emphasis
    - Create a sense of urgency or exclusivity
    - Include detailed product specifications and benefits
    
    Return your response as a JSON object with two properties:
    1. "elements": The array of elements as described above
    2. "htmlContent": The complete HTML email template
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log("AI response received");

    // Parse the JSON response
    try {
      // Clean up the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json|```/g, "").trim();
      const parsedResponse = JSON.parse(cleanedText);

      // Extract elements and HTML content
      const elements = parsedResponse.elements || [];
      const htmlContent = parsedResponse.htmlContent || "";

      console.log("Successfully parsed AI response");
      console.timeEnd("AI Generation Time");

      return {
        success: true,
        elements,
        htmlContent,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw response:", text);
      console.timeEnd("AI Generation Time");

      // Attempt to extract just the elements array if the full JSON parsing failed
      try {
        const elementsMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (elementsMatch) {
          const elementsJson = elementsMatch[0];
          const elements = JSON.parse(elementsJson);

          // Generate HTML from elements as a fallback
          const htmlContent = generateHtmlFromElements(elements);

          return {
            success: true,
            elements,
            htmlContent,
          };
        }
      } catch (fallbackError) {
        console.error("Fallback parsing also failed:", fallbackError);
      }

      return {
        success: false,
        error: "Failed to parse AI response",
        rawResponse: text,
      };
    }
  } catch (error) {
    console.error("Error generating email template:", error);
    console.timeEnd("AI Generation Time");
    return {
      success: false,
      error: error.message || "Failed to generate email template",
    };
  }
}
