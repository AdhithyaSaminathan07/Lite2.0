// src/lib/whatsapp-config.ts

export const whatsappConfig = {
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  accessToken: process.env.WHATSAPP_BUSINESS_API_TOKEN,
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  
  // Validate configuration
  isValid: (): boolean => {
    return !!(whatsappConfig.phoneNumberId && 
              whatsappConfig.accessToken && 
              whatsappConfig.businessAccountId);
  },
  
  // Get configuration for logging
  getConfig: () => ({
    hasPhoneId: !!whatsappConfig.phoneNumberId,
    hasToken: !!whatsappConfig.accessToken,
    hasBusinessAccountId: !!whatsappConfig.businessAccountId,
    businessAccountId: whatsappConfig.businessAccountId
  })
};

// Common template configurations
export const whatsappTemplates = {
  invoice_with_payment: {
    name: "invoice_with_payment",
    language: { code: "en" }
  },
  payment_receipt_cashhh: {
    name: "payment_receipt_cashhh", 
    language: { code: "en" }
  },
  payment_receipt_upiii: {
    name: "payment_receipt_upiii",
    language: { code: "en" }
  },
  payment_receipt_card: {
    name: "payment_receipt_card",
    language: { code: "en" }
  }
};