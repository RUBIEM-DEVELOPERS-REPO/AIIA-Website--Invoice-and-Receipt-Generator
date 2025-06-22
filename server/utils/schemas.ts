import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Initialize Ajv instance with formats
export const ajv = new Ajv();
addFormats(ajv); // Add support for date, date-time and other formats

// Define the schema for document verification result
export const documentVerificationSchema = {
  type: "object",
  properties: {
    isId: {
      type: "boolean",
      description: "Whether the document is a valid ID"
    },
    nameMatch: {
      type: "boolean",
      description: "Whether the name matches in the document"
    },
    confidence: {
      type: "string",
      enum: ["high", "low", "none"],
      description: "Confidence level of the verification"
    },
    type: {
      type: "string",
      enum: ["Student Member", "Full Member", "Institutional Member", "Free Membership"],
      description: "Type of membership determined from the document"
    },
    error: {
      type: "string",
      description: "Error message if verification failed"
    },
    detectedText: {
      type: "object",
      properties: {
        words: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              confidence: { type: "number" },
              position: {
                type: "object",
                properties: {
                  top_left: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  },
                  top_right: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  },
                  bottom_right: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  },
                  bottom_left: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 2,
                    maxItems: 2
                  }
                },
                required: ["top_left", "top_right", "bottom_right", "bottom_left"]
              }
            },
            required: ["text", "confidence", "position"]
          }
        },
        foundIdIndicators: {
          type: "array",
          items: { type: "string" }
        },
        foundNameParts: {
          type: "array",
          items: { type: "string" }
        },
        completeText: { type: "string" }
      },
      required: ["words", "foundIdIndicators", "foundNameParts", "completeText"]
    }
  },
  required: ["isId", "nameMatch", "confidence", "type"],
  additionalProperties: false
};

// Compile the schema
export const validateDocumentVerification = ajv.compile(documentVerificationSchema);

// Helper function to validate document verification result
export function validateVerificationResult(data: unknown) {
  const isValid = validateDocumentVerification(data);
  if (!isValid) {
    return {
      valid: false,
      errors: validateDocumentVerification.errors
    };
  }
  return {
    valid: true,
    errors: null
  };
}