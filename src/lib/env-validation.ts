// src/lib/env-validation.ts

export function validateWhatsAppConfig(): { isValid: boolean; missing: string[] } {
  const missing = [];
  
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID) {
    missing.push('WHATSAPP_PHONE_NUMBER_ID');
  }
  
  if (!process.env.WHATSAPP_BUSINESS_API_TOKEN) {
    missing.push('WHATSAPP_BUSINESS_API_TOKEN');
  }
  
  if (!process.env.WHATSAPP_BUSINESS_ACCOUNT_ID) {
    missing.push('WHATSAPP_BUSINESS_ACCOUNT_ID');
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

// Use this in your components
const configValidation = validateWhatsAppConfig();
if (!configValidation.isValid) {
  console.error('Missing WhatsApp configuration:', configValidation.missing);
}