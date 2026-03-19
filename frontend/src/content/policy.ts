const FORBIDDEN_KEYWORDS = [
  'sex',
  'nude',
  'porn',
  'explicit',
  'xxx',
  'hardcore',
  'fetish',
  'erotic',
];

export function validateContent(text: string): { valid: boolean; error?: string } {
  const normalized = text.toLowerCase().trim();
  
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        valid: false,
        error: 'Your content contains prohibited terms. Please review our content policy and ensure your post is appropriate for this platform.',
      };
    }
  }
  
  return { valid: true };
}

export const CONTENT_POLICY_SUMMARY = `This platform is for mature audiences only. All content must be non-explicit and comply with our community guidelines. Sexually explicit content, graphic imagery, and prohibited keywords are not permitted.`;

export const AGE_GATE_DISCLAIMER = `You must be 18 years or older to access this content. By continuing, you confirm that you meet this age requirement and agree to our terms of service.`;
