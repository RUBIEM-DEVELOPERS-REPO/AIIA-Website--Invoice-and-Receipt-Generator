import { validateVerificationResult } from './schemas';

// Test data
const validDocument = {
  documentType: "passport",
  isValid: true,
  confidence: 0.95,
  extractedData: {
    name: "John Doe",
    documentNumber: "P123456",
    dateOfBirth: "1990-01-01",
    expiryDate: "2025-01-01",
    nationality: "USA"
  },
  verificationDetails: {
    timestamp: new Date().toISOString(),
    status: "success"
  }
};

// Example usage
const result = validateVerificationResult(validDocument);
console.log('Validation result:', result);

// Test with invalid data
const invalidDocument = {
  documentType: "invalid_type", // This should fail validation
  isValid: true,
  confidence: 2, // This should fail validation (> 1)
  extractedData: {
    // Missing required 'documentNumber'
    name: "John Doe"
  },
  verificationDetails: {
    timestamp: new Date().toISOString(),
    status: "unknown" // This should fail validation
  }
};

const invalidResult = validateVerificationResult(invalidDocument);
console.log('Invalid document validation result:', invalidResult);
