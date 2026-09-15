/**
 * palette.js — Tool 7: wf_palette
 * 
 * Generate color palette dari seed color + industry.
 * Mengacu ke Section 16 COLOR PALETTE & PSYCHOLOGY.
 */

const palettes = {
  'saas-modern': {
    name: 'SaaS Modern',
    vibe: 'Professional, clean, high-tech',
    colors: {
      primary: '#2563EB', secondary: '#7C3AED', accent: '#06B6D4',
      surface: '#F8FAFC', text: '#0F172A', muted: '#64748B',
      success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#0EA5E9',
    },
  },
  'warm-organic': {
    name: 'Warm & Organic',
    vibe: 'Earthy, welcoming, natural',
    colors: {
      primary: '#B45309', secondary: '#D97706', accent: '#059669',
      surface: '#FFFBEB', text: '#292524', muted: '#78716C',
    },
  },
  'dark-luxury': {
    name: 'Dark Luxury',
    vibe: 'Premium, exclusive, editorial',
    colors: {
      primary: '#F59E0B', secondary: '#1C1917', accent: '#D4D4D8',
      surface: '#18181B', text: '#FAFAFA', muted: '#A1A1AA',
    },
  },
  'health-wellness': {
    name: 'Health & Wellness',
    vibe: 'Calm, natural, healing',
    colors: {
      primary: '#84A98C', secondary: '#C4A4E5', accent: '#F5E6D3',
      surface: '#FAF5F0', text: '#2D2A25', muted: '#8B8A86',
    },
  },
  'ecommerce': {
    name: 'E-Commerce Vibrant',
    vibe: 'Energetic, urgent, trustworthy',
    colors: {
      primary: '#FF6B35', secondary: '#0066CC', accent: '#E63946',
      surface: '#FFFFFF', text: '#1A1A2E', muted: '#8D99AE',
    },
  },
  'creative-agency': {
    name: 'Creative Agency',
    vibe: 'Bold, artistic, memorable',
    colors: {
      primary: '#7C3AED', secondary: '#EC4899', accent: '#06B6D4',
      surface: '#0F172A', text: '#F8FAFC', muted: '#64748B',
    },
  },
  'minimalist': {
    name: 'Minimalist Editorial',
    vibe: 'Clean, sophisticated, print-like',
    colors: {
      primary: '#1A1A1A', secondary: '#F5F5F5', accent: '#C73659',
      surface: '#FFFFFF', text: '#1A1A1A', muted: '#737373',
    },
  },
  'fintech': {
    name: 'Fintech Secure',
    vibe: 'Stable, secure, professional',
    colors: {
      primary: '#0052CC', secondary: '#00A3BF', accent: '#36B37E',
      surface: '#F4F5F7', text: '#172B4D', muted: '#5E6C84',
    },
  },
  'gaming': {
    name: 'Gaming Energy',
    vibe: 'Energetic, immersive, exciting',
    colors: {
      primary: '#A855F7', secondary: '#3B82F6', accent: '#EF4444',
      surface: '#09090B', text: '#FAFAFA', muted: '#52525B',
    },
  },
  'nature': {
    name: 'Nature Organic',
    vibe: 'Natural, fresh, sustainable',
    colors: {
      primary: '#2D6A4F', secondary: '#95D5B2', accent: '#E9C46A',
      surface: '#F1FAEE', text: '#1B1B1B', muted: '#6B7280',
    },
  },
  'cosmic-dark': {
    name: 'Cosmic Dark',
    vibe: 'Futuristic, dreamy, tech-forward',
    colors: {
      primary: '#818CF8', secondary: '#C084FC', accent: '#22D3EE',
      surface: '#0F0F23', text: '#E2E8F0', muted: '#64748B',
    },
  },
  'desert-warmth': {
    name: 'Desert Warmth',
    vibe: 'Warm, sandy, grounded',
    colors: {
      primary: '#D97706', secondary: '#B45309', accent: '#0F766E',
      surface: '#FFFBEB', text: '#292524', muted: '#78716C',
    },
  },
  'ocean-deep': {
    name: 'Ocean Deep',
    vibe: 'Deep, calm, trustworthy',
    colors: {
      primary: '#1E3A8A', secondary: '#3B82F6', accent: '#22D3EE',
      surface: '#EFF6FF', text: '#0F172A', muted: '#64748B',
    },
  },
  'corporate': {
    name: 'Corporate Clean',
    vibe: 'Professional, clean, reliable',
    colors: {
      primary: '#1E40AF', secondary: '#3B82F6', accent: '#10B981',
      surface: '#FFFFFF', text: '#111827', muted: '#6B7280',
    },
  },
  'scandinavian': {
    name: 'Scandinavian Minimal',
    vibe: 'Clean, functional, serene',
    colors: {
      primary: '#292524', secondary: '#F5F5F4', accent: '#0D9488',
      surface: '#FAFAF9', text: '#1C1917', muted: '#78716C',
    },
  },
  'pastel-pink': {
    name: 'Pastel Pink',
    vibe: 'Soft, sweet, gentle',
    colors: { primary: '#F9A8D4', secondary: '#FBCFE8', accent: '#F472B6', surface: '#FDF2F8', text: '#831843', muted: '#DB2777' },
  },
  'pastel-lavender': {
    name: 'Pastel Lavender',
    vibe: 'Dreamy, calm, ethereal',
    colors: { primary: '#C4B5FD', secondary: '#DDD6FE', accent: '#A78BFA', surface: '#F5F3FF', text: '#4C1D95', muted: '#7C3AED' },
  },
  'pastel-mint': {
    name: 'Pastel Mint',
    vibe: 'Fresh, airy, clean',
    colors: { primary: '#A7F3D0', secondary: '#D1FAE5', accent: '#6EE7B7', surface: '#ECFDF5', text: '#064E3B', muted: '#059669' },
  },
  'pastel-peach': {
    name: 'Pastel Peach',
    vibe: 'Warm, cozy, friendly',
    colors: { primary: '#FED7AA', secondary: '#FEE2E2', accent: '#FDBA74', surface: '#FFF7ED', text: '#7C2D12', muted: '#EA580C' },
  },
  'pastel-sky': {
    name: 'Pastel Sky',
    vibe: 'Airy, serene, spacious',
    colors: { primary: '#BAE6FD', secondary: '#E0F2FE', accent: '#7DD3FC', surface: '#F0F9FF', text: '#075985', muted: '#0284C7' },
  },
  'pastel-lilac': {
    name: 'Pastel Lilac',
    vibe: 'Delicate, romantic, soft',
    colors: { primary: '#D8B4FE', secondary: '#EDE9FE', accent: '#C084FC', surface: '#FAF5FF', text: '#581C87', muted: '#9333EA' },
  },
  'pastel-coral': {
    name: 'Pastel Coral',
    vibe: 'Warm, playful, inviting',
    colors: { primary: '#FCA5A5', secondary: '#FEE2E2', accent: '#F87171', surface: '#FFF1F2', text: '#9F1239', muted: '#E11D48' },
  },
  'pastel-yellow': {
    name: 'Pastel Yellow',
    vibe: 'Cheerful, sunny, optimistic',
    colors: { primary: '#FDE68A', secondary: '#FEF9C3', accent: '#FCD34D', surface: '#FFFDE7', text: '#713F12', muted: '#CA8A04' },
  },
  'pastel-lime': {
    name: 'Pastel Lime',
    vibe: 'Fresh, zesty, vibrant-soft',
    colors: { primary: '#BEF264', secondary: '#D9F99D', accent: '#A3E635', surface: '#F7FEE7', text: '#3F6212', muted: '#65A30D' },
  },
  'pastel-rose': {
    name: 'Pastel Rose',
    vibe: 'Romantic, elegant, tender',
    colors: { primary: '#FDA4AF', secondary: '#FFE4E6', accent: '#FB7185', surface: '#FFF1F2', text: '#881337', muted: '#E11D48' },
  },
  'pastel-violet': {
    name: 'Pastel Violet',
    vibe: 'Mystical, soft, creative',
    colors: { primary: '#A78BFA', secondary: '#C4B5FD', accent: '#8B5CF6', surface: '#F5F3FF', text: '#4C1D95', muted: '#7C3AED' },
  },
  'pastel-aqua': {
    name: 'Pastel Aqua',
    vibe: 'Refreshing, tranquil, clear',
    colors: { primary: '#67E8F9', secondary: '#A5F3FC', accent: '#22D3EE', surface: '#ECFEFF', text: '#155E75', muted: '#0891B2' },
  },
  'pastel-blush': {
    name: 'Pastel Blush',
    vibe: 'Soft, warm, intimate',
    colors: { primary: '#FBC4C4', secondary: '#FDDCDC', accent: '#F9A8A8', surface: '#FEF2F2', text: '#7F1D1D', muted: '#DC2626' },
  },
  'pastel-cream': {
    name: 'Pastel Cream',
    vibe: 'Warm, comforting, versatile',
    colors: { primary: '#FDE68A', secondary: '#FEF3C7', accent: '#FCD34D', surface: '#FFFBEB', text: '#78350F', muted: '#D97706' },
  },
  'pastel-lavender-blue': {
    name: 'Pastel Lavender Blue',
    vibe: 'Soft, serene, elegant',
    colors: { primary: '#A5B4FC', secondary: '#C7D2FE', accent: '#818CF8', surface: '#EEF2FF', text: '#312E81', muted: '#4F46E5' },
  },
  'pastel-melon': {
    name: 'Pastel Melon',
    vibe: 'Sweet, juicy, light',
    colors: { primary: '#FDE68A', secondary: '#FEF9C3', accent: '#FACC15', surface: '#FFFDE7', text: '#713F12', muted: '#CA8A04' },
  },
  'pastel-periwinkle': {
    name: 'Pastel Periwinkle',
    vibe: 'Gentle, nostalgic, calm',
    colors: { primary: '#A5B4FC', secondary: '#C7D2FE', accent: '#818CF8', surface: '#F8FAFC', text: '#3730A3', muted: '#6366F1' },
  },
  'pastel-berry': {
    name: 'Pastel Berry',
    vibe: 'Sweet, playful, soft-bold',
    colors: { primary: '#F9A8D4', secondary: '#FBCFE8', accent: '#E879F9', surface: '#FDF4FF', text: '#86198F', muted: '#C026D3' },
  },
  'pastel-honey': {
    name: 'Pastel Honey',
    vibe: 'Warm, golden, gentle',
    colors: { primary: '#FCD34D', secondary: '#FDE68A', accent: '#F59E0B', surface: '#FFFBEB', text: '#78350F', muted: '#D97706' },
  },
  'pastel-sage': {
    name: 'Pastel Sage',
    vibe: 'Herbal, calm, natural',
    colors: { primary: '#A7F3D0', secondary: '#D1FAE5', accent: '#6EE7B7', surface: '#F0FDF4', text: '#14532D', muted: '#16A34A' },
  },
  'muted-terracotta': {
    name: 'Muted Terracotta',
    vibe: 'Earthy, warm, artisan',
    colors: { primary: '#D4A574', secondary: '#E8C9A0', accent: '#C17F59', surface: '#FCF6F0', text: '#3E2723', muted: '#8D6E63' },
  },
  'muted-olive': {
    name: 'Muted Olive',
    vibe: 'Organic, grounded, rustic',
    colors: { primary: '#9CAF88', secondary: '#C1CFB0', accent: '#7A8B65', surface: '#F5F7F0', text: '#2C3A24', muted: '#6B7B5A' },
  },
  'muted-sand': {
    name: 'Muted Sand',
    vibe: 'Neutral, warm, beachy',
    colors: { primary: '#D4C5B0', secondary: '#E8DDCF', accent: '#B8A88E', surface: '#FCF9F5', text: '#3D3229', muted: '#8C7C6A' },
  },
  'muted-clay': {
    name: 'Muted Clay',
    vibe: 'Earthy, ceramic, natural',
    colors: { primary: '#C4A484', secondary: '#DEC3AA', accent: '#A67B5B', surface: '#F9F3ED', text: '#3E2723', muted: '#8D6E63' },
  },
  'muted-ochre': {
    name: 'Muted Ochre',
    vibe: 'Warm, ancient, artistic',
    colors: { primary: '#C4A44A', secondary: '#DEC77A', accent: '#A8892E', surface: '#FBF6EA', text: '#4A3728', muted: '#8B7D3C' },
  },
  'muted-slate': {
    name: 'Muted Slate',
    vibe: 'Cool, calm, architectural',
    colors: { primary: '#8A9BA8', secondary: '#B0C0CC', accent: '#6B7D8B', surface: '#F2F5F7', text: '#1A252C', muted: '#5A6973' },
  },
  'muted-taupe': {
    name: 'Muted Taupe',
    vibe: 'Sophisticated, neutral, elegant',
    colors: { primary: '#B3A295', secondary: '#D0C3B9', accent: '#8F7C6E', surface: '#F8F5F2', text: '#3A2E26', muted: '#7A6B60' },
  },
  'muted-forest': {
    name: 'Muted Forest',
    vibe: 'Deep, earthy, tranquil',
    colors: { primary: '#6B8E6B', secondary: '#8FB08F', accent: '#4A6B4A', surface: '#EEF4EE', text: '#1A2E1A', muted: '#4D6B4D' },
  },
  'muted-rust': {
    name: 'Muted Rust',
    vibe: 'Worn, vintage, warm',
    colors: { primary: '#B8694A', secondary: '#D49173', accent: '#9A4D30', surface: '#F7EFEA', text: '#3B2015', muted: '#7A4530' },
  },
  'muted-stone': {
    name: 'Muted Stone',
    vibe: 'Solid, natural, timeless',
    colors: { primary: '#B8B0A0', secondary: '#D4CFC3', accent: '#948C7C', surface: '#F6F4F0', text: '#2E2B26', muted: '#706860' },
  },
  'muted-umber': {
    name: 'Muted Umber',
    vibe: 'Rich, earthy, warm',
    colors: { primary: '#8B6F4E', secondary: '#B09070', accent: '#6B5033', surface: '#F3EDE5', text: '#2E2116', muted: '#664C33' },
  },
  'muted-sienna': {
    name: 'Muted Sienna',
    vibe: 'Warm, rustic, natural',
    colors: { primary: '#B86F4A', secondary: '#D49273', accent: '#9A4D30', surface: '#F7EFEA', text: '#3B2015', muted: '#7A4530' },
  },
  'muted-peat': {
    name: 'Muted Peat',
    vibe: 'Deep, organic, moody',
    colors: { primary: '#5A5A4A', secondary: '#7A7A6A', accent: '#3A3A2E', surface: '#EEEEEA', text: '#1A1A14', muted: '#4A4A3E' },
  },
  'muted-dusty-rose': {
    name: 'Muted Dusty Rose',
    vibe: 'Vintage, romantic, faded',
    colors: { primary: '#C08A8A', secondary: '#D9B0B0', accent: '#9E6B6B', surface: '#F6EEEE', text: '#3A1E1E', muted: '#7A4E4E' },
  },
  'muted-driftwood': {
    name: 'Muted Driftwood',
    vibe: 'Weathered, coastal, natural',
    colors: { primary: '#B8A898', secondary: '#D0C4B8', accent: '#948474', surface: '#F5F2EE', text: '#2E2822', muted: '#706458' },
  },
  'soft-warm-gray': {
    name: 'Soft Warm Gray',
    vibe: 'Neutral, cozy, sophisticated',
    colors: { primary: '#D4CFC8', secondary: '#E6E2DD', accent: '#B0A89E', surface: '#FAF8F6', text: '#2C2824', muted: '#8A8278' },
  },
  'soft-cool-gray': {
    name: 'Soft Cool Gray',
    vibe: 'Clean, modern, minimal',
    colors: { primary: '#C8CCD0', secondary: '#DEE0E4', accent: '#A4A8AE', surface: '#F6F7F8', text: '#1C2024', muted: '#787C82' },
  },
  'soft-beige': {
    name: 'Soft Beige',
    vibe: 'Timeless, warm, versatile',
    colors: { primary: '#D4C8B8', secondary: '#E6DDD0', accent: '#B8A898', surface: '#F8F5F0', text: '#302A24', muted: '#8A7E72' },
  },
  'soft-ivory': {
    name: 'Soft Ivory',
    vibe: 'Elegant, clean, warm',
    colors: { primary: '#E8E0D0', secondary: '#F2ECE0', accent: '#D0C4B0', surface: '#FCFAF6', text: '#2C2820', muted: '#90847A' },
  },
  'soft-almond': {
    name: 'Soft Almond',
    vibe: 'Warm, nutty, comforting',
    colors: { primary: '#D4C0A8', secondary: '#E6D6C4', accent: '#B8A088', surface: '#F8F3EC', text: '#30261E', muted: '#8A7A6A' },
  },
  'soft-oat': {
    name: 'Soft Oat',
    vibe: 'Wholesome, natural, gentle',
    colors: { primary: '#D8D0C0', secondary: '#EAE4D8', accent: '#C0B4A0', surface: '#FAF8F4', text: '#2C2822', muted: '#8C8478' },
  },
  'soft-linen': {
    name: 'Soft Linen',
    vibe: 'Textural, organic, calm',
    colors: { primary: '#E0D8CC', secondary: '#EEE8E0', accent: '#C8BCAE', surface: '#FCFAF8', text: '#2E2A24', muted: '#928A7E' },
  },
  'soft-dove': {
    name: 'Soft Dove',
    vibe: 'Peaceful, gentle, refined',
    colors: { primary: '#D0D0D0', secondary: '#E4E4E4', accent: '#B0B0B0', surface: '#F8F8F8', text: '#1E1E1E', muted: '#787878' },
  },
  'soft-pearl': {
    name: 'Soft Pearl',
    vibe: 'Lustrous, elegant, pure',
    colors: { primary: '#E8E4DC', secondary: '#F2F0EA', accent: '#D0C8BE', surface: '#FCFCFA', text: '#2A2824', muted: '#908C84' },
  },
  'soft-bone': {
    name: 'Soft Bone',
    vibe: 'Natural, organic, warm',
    colors: { primary: '#E0D8CC', secondary: '#ECE6DC', accent: '#C8BCAE', surface: '#FAF8F4', text: '#2C2824', muted: '#90887C' },
  },
  'soft-ash': {
    name: 'Soft Ash',
    vibe: 'Cool, subtle, modern',
    colors: { primary: '#C8C8C8', secondary: '#DEDEDE', accent: '#A8A8A8', surface: '#F4F4F4', text: '#202020', muted: '#707070' },
  },
  'soft-mushroom': {
    name: 'Soft Mushroom',
    vibe: 'Earthy, warm, organic',
    colors: { primary: '#C8B8A8', secondary: '#DED2C6', accent: '#A89884', surface: '#F6F2EC', text: '#2E2822', muted: '#7E7266' },
  },
  'soft-ecru': {
    name: 'Soft Ecru',
    vibe: 'Natural, raw, textile',
    colors: { primary: '#D8CCB8', secondary: '#E8E0D0', accent: '#C0B098', surface: '#F8F5F0', text: '#2C2820', muted: '#8A7E6E' },
  },
  'soft-fawn': {
    name: 'Soft Fawn',
    vibe: 'Warm, gentle, animalic',
    colors: { primary: '#C8B098', secondary: '#DECAB8', accent: '#A89078', surface: '#F5F0EA', text: '#2E241E', muted: '#7E6E5E' },
  },
  'soft-pumice': {
    name: 'Soft Pumice',
    vibe: 'Volcanic, textured, neutral',
    colors: { primary: '#C0C0B8', secondary: '#D8D8D0', accent: '#A0A098', surface: '#F2F2F0', text: '#222220', muted: '#787870' },
  },
  'dusty-rose': {
    name: 'Dusty Rose',
    vibe: 'Vintage, faded, romantic',
    colors: { primary: '#C89A9A', secondary: '#DEB8B8', accent: '#A87A7A', surface: '#F5ECEC', text: '#3A1E1E', muted: '#7A5252' },
  },
  'dusty-lavender': {
    name: 'Dusty Lavender',
    vibe: 'Faded, dreamy, antique',
    colors: { primary: '#B8A8C8', secondary: '#D0C4DE', accent: '#9888A8', surface: '#F2EEF5', text: '#2E1E3A', muted: '#6A5A7A' },
  },
  'dusty-blue': {
    name: 'Dusty Blue',
    vibe: 'Faded denim, calm, nostalgic',
    colors: { primary: '#8EA8C8', secondary: '#B0C4DE', accent: '#6A88A8', surface: '#EEF2F6', text: '#1A2A3A', muted: '#506A80' },
  },
  'dusty-illac': {
    name: 'Dusty Illac',
    vibe: 'Muted, poetic, soft',
    colors: { primary: '#B8A8D0', secondary: '#D0C4E4', accent: '#9888B0', surface: '#F2EEF8', text: '#2A1E3A', muted: '#6A5A80' },
  },
  'dusty-coral': {
    name: 'Dusty Coral',
    vibe: 'Faded sunset, warm, nostalgic',
    colors: { primary: '#D0A090', secondary: '#E4C0B4', accent: '#B08070', surface: '#F6F0EC', text: '#3A2018', muted: '#7A5044' },
  },
  'dusty-wisteria': {
    name: 'Dusty Wisteria',
    vibe: 'Romantic, faded, delicate',
    colors: { primary: '#C0A8D0', secondary: '#D8C4E4', accent: '#A088B0', surface: '#F4EEF8', text: '#2E1E3E', muted: '#6E5A80' },
  },
  'dusty-mauve': {
    name: 'Dusty Mauve',
    vibe: 'Elegant, muted, sophisticated',
    colors: { primary: '#C090A8', secondary: '#D8B4C8', accent: '#A07088', surface: '#F4EEF0', text: '#361E2A', muted: '#704E60' },
  },
  'dusty-thistle': {
    name: 'Dusty Thistle',
    vibe: 'Gentle, faded, botanical',
    colors: { primary: '#C0B0D0', secondary: '#D8CCE4', accent: '#A090B0', surface: '#F4F0F8', text: '#2A223A', muted: '#6A5E7A' },
  },
  'dusty-denim': {
    name: 'Dusty Denim',
    vibe: 'Vintage, worn, casual',
    colors: { primary: '#7890B0', secondary: '#A0B4D0', accent: '#506A88', surface: '#EEF0F4', text: '#1A2636', muted: '#4C6078' },
  },
  'dusty-sage': {
    name: 'Dusty Sage',
    vibe: 'Herbal, faded, natural',
    colors: { primary: '#90A888', secondary: '#B0C8A8', accent: '#6A8060', surface: '#EEF4EC', text: '#1E2E1A', muted: '#506848' },
  },
  'dusty-heather': {
    name: 'Dusty Heather',
    vibe: 'Moorland, muted, natural',
    colors: { primary: '#B8A0B8', secondary: '#D0C0D0', accent: '#988098', surface: '#F2EEF2', text: '#2E1E2E', muted: '#6E5A6E' },
  },
  'dusty-petal': {
    name: 'Dusty Petal',
    vibe: 'Faded floral, delicate, soft',
    colors: { primary: '#D0B8C8', secondary: '#E4D0DC', accent: '#B098A8', surface: '#F6F0F4', text: '#3A2230', muted: '#7A5A6A' },
  },
  'dusty-lilac': {
    name: 'Dusty Lilac',
    vibe: 'Powdery, gentle, romantic',
    colors: { primary: '#C8B8D8', secondary: '#DED0E8', accent: '#A898B8', surface: '#F4F0F8', text: '#2E223C', muted: '#6E5E80' },
  },
  'dusty-mist': {
    name: 'Dusty Mist',
    vibe: 'Atmospheric, foggy, serene',
    colors: { primary: '#A8B8C0', secondary: '#C8D4D8', accent: '#8898A0', surface: '#EEF2F4', text: '#1E2830', muted: '#587080' },
  },
  'dusty-powder': {
    name: 'Dusty Powder',
    vibe: 'Soft, fine, ethereal',
    colors: { primary: '#D0C8D8', secondary: '#E4DEE8', accent: '#B0A8B8', surface: '#F6F4F8', text: '#2A2230', muted: '#706A78' },
  },
  'pale-sapphire': {
    name: 'Pale Sapphire',
    vibe: 'Translucent, cool, precious',
    colors: { primary: '#8AA8D0', secondary: '#B0C8E4', accent: '#6088B0', surface: '#EEF2F8', text: '#1A2E48', muted: '#4A6880' },
  },
  'pale-ruby': {
    name: 'Pale Ruby',
    vibe: 'Soft gem, warm, precious',
    colors: { primary: '#D09090', secondary: '#E4B8B8', accent: '#B06868', surface: '#F6EEEE', text: '#3A1E1E', muted: '#7A4A4A' },
  },
  'pale-amethyst': {
    name: 'Pale Amethyst',
    vibe: 'Crystalline, calm, spiritual',
    colors: { primary: '#B8A0D0', secondary: '#D0C0E4', accent: '#9880B0', surface: '#F2EEF6', text: '#2E1E3E', muted: '#6A5A80' },
  },
  'pale-emerald': {
    name: 'Pale Emerald',
    vibe: 'Translucent green, fresh, calm',
    colors: { primary: '#80B898', secondary: '#A8D0B8', accent: '#5A9878', surface: '#ECF4F0', text: '#1A2E24', muted: '#3E7860' },
  },
  'pale-topaz': {
    name: 'Pale Topaz',
    vibe: 'Golden, warm, glowing',
    colors: { primary: '#D0C088', secondary: '#E4D8B0', accent: '#B0A060', surface: '#F8F4EC', text: '#3A3020', muted: '#7A7050' },
  },
  'pale-opal': {
    name: 'Pale Opal',
    vibe: 'Iridescent, dreamy, shifting',
    colors: { primary: '#B8C8D0', secondary: '#D0DCE4', accent: '#90A8B8', surface: '#F0F4F6', text: '#1E2830', muted: '#587080' },
  },
  'pale-jade': {
    name: 'Pale Jade',
    vibe: 'Smooth, precious, serene',
    colors: { primary: '#80B8A0', secondary: '#A8D0C0', accent: '#5A9880', surface: '#ECF4F0', text: '#1A2E24', muted: '#3E7860' },
  },
  'pale-garnet': {
    name: 'Pale Garnet',
    vibe: 'Deep rose, warm, rich',
    colors: { primary: '#C88890', secondary: '#E0ACB4', accent: '#A86068', surface: '#F4ECEE', text: '#3A1E22', muted: '#7A4850' },
  },
  'pale-turquoise': {
    name: 'Pale Turquoise',
    vibe: 'Tropical, clear, refreshing',
    colors: { primary: '#80D0C8', secondary: '#A8E0DC', accent: '#58B8B0', surface: '#ECF8F6', text: '#1A3834', muted: '#40807A' },
  },
  'pale-citrine': {
    name: 'Pale Citrine',
    vibe: 'Sunny, bright, warming',
    colors: { primary: '#E0D090', secondary: '#ECE0B8', accent: '#C8B868', surface: '#FAF6EC', text: '#3E3420', muted: '#7E7050' },
  },
  'pale-pearl': {
    name: 'Pale Pearl',
    vibe: 'Luminous, elegant, pure',
    colors: { primary: '#E0D8D8', secondary: '#EEE8E8', accent: '#C8BEBE', surface: '#FAF8F8', text: '#2A2424', muted: '#8A8282' },
  },
  'pale-moonstone': {
    name: 'Pale Moonstone',
    vibe: 'Lunar, soft, glowing',
    colors: { primary: '#C8D0D8', secondary: '#DEE4E8', accent: '#A8B0B8', surface: '#F4F6F8', text: '#1E2830', muted: '#687880' },
  },
  'pale-rose-quartz': {
    name: 'Pale Rose Quartz',
    vibe: 'Gentle pink, loving, calm',
    colors: { primary: '#D0B0C0', secondary: '#E4CCD8', accent: '#B090A0', surface: '#F6F0F2', text: '#341E2A', muted: '#7A5A68' },
  },
  'pale-amber': {
    name: 'Pale Amber',
    vibe: 'Warm fossil, golden, soft',
    colors: { primary: '#D0C088', secondary: '#E4D8B0', accent: '#B0A060', surface: '#F8F4EC', text: '#3A3020', muted: '#7A7050' },
  },
  'pale-crystal': {
    name: 'Pale Crystal',
    vibe: 'Clear, pure, icy',
    colors: { primary: '#D0D8E0', secondary: '#E4E8EE', accent: '#B0BCC8', surface: '#F6F8FA', text: '#202830', muted: '#687880' },
  },
  'calm-sky': {
    name: 'Calm Sky',
    vibe: 'Peaceful, open, meditative',
    colors: { primary: '#A0C4E0', secondary: '#C0DCF0', accent: '#7AA8C8', surface: '#F0F6FA', text: '#1A2E40', muted: '#487090' },
  },
  'calm-mint': {
    name: 'Calm Mint',
    vibe: 'Soothing, fresh, balanced',
    colors: { primary: '#A0D0B8', secondary: '#C0E4D0', accent: '#78B898', surface: '#F0F8F4', text: '#1A3428', muted: '#407860' },
  },
  'calm-lavender': {
    name: 'Calm Lavender',
    vibe: 'Relaxing, aromatic, serene',
    colors: { primary: '#C0B0D8', secondary: '#D8CCE8', accent: '#A090B8', surface: '#F4F0F8', text: '#2A1E3C', muted: '#6A5A80' },
  },
  'calm-peach': {
    name: 'Calm Peach',
    vibe: 'Gentle warmth, cozy, kind',
    colors: { primary: '#E0C8B8', secondary: '#F0DCCE', accent: '#C8A898', surface: '#FAF4F0', text: '#3A2820', muted: '#7A6054' },
  },
  'calm-aqua': {
    name: 'Calm Aqua',
    vibe: 'Crystal clear, tranquil, pure',
    colors: { primary: '#A0D8D8', secondary: '#C0E8E8', accent: '#78C0C0', surface: '#F0F8F8', text: '#1A3838', muted: '#408080' },
  },
  'calm-rosewater': {
    name: 'Calm Rosewater',
    vibe: 'Soft pink, gentle, soothing',
    colors: { primary: '#D8C0C8', secondary: '#E8D4DC', accent: '#C0A0A8', surface: '#F8F2F4', text: '#38202A', muted: '#7A5A64' },
  },
  'calm-cloud': {
    name: 'Calm Cloud',
    vibe: 'Fluffy, light, dreamy',
    colors: { primary: '#D0D8E0', secondary: '#E4E8EE', accent: '#B8C0C8', surface: '#F6F8FA', text: '#202830', muted: '#707880' },
  },
  'calm-fog': {
    name: 'Calm Fog',
    vibe: 'Misty, quiet, introspective',
    colors: { primary: '#B8C0C8', secondary: '#D0D8DC', accent: '#A0A8B0', surface: '#F0F2F4', text: '#1E282E', muted: '#606870' },
  },
  'calm-breeze': {
    name: 'Calm Breeze',
    vibe: 'Light, fresh, airy',
    colors: { primary: '#B0D0E0', secondary: '#C8E0EC', accent: '#90B8C8', surface: '#F0F6F8', text: '#1A2E3C', muted: '#487080' },
  },
  'calm-dew': {
    name: 'Calm Dew',
    vibe: 'Morning fresh, pure, gentle',
    colors: { primary: '#C0D8D0', secondary: '#D8E8E4', accent: '#A0C0B8', surface: '#F2F8F6', text: '#1E322C', muted: '#487870' },
  },
  'vintage-blush': {
    name: 'Vintage Blush',
    vibe: 'Antique rose, romantic, faded',
    colors: { primary: '#D0B0B0', secondary: '#E4C8C8', accent: '#B89090', surface: '#F6EEEE', text: '#362020', muted: '#785050' },
  },
  'vintage-tea': {
    name: 'Vintage Tea',
    vibe: 'Stained, warm, antique',
    colors: { primary: '#C8B8A0', secondary: '#DED0BE', accent: '#A89880', surface: '#F5F0EA', text: '#2E2820', muted: '#7A6E5E' },
  },
  'vintage-parchment': {
    name: 'Vintage Parchment',
    vibe: 'Aged, textual, historical',
    colors: { primary: '#D8CCB0', secondary: '#E8E0CC', accent: '#C0B090', surface: '#F8F4EC', text: '#2E2820', muted: '#7E7664' },
  },
  'vintage-faded-rose': {
    name: 'Vintage Faded Rose',
    vibe: 'Dried rose, nostalgic, poetic',
    colors: { primary: '#C8A098', secondary: '#DEC0B8', accent: '#A88078', surface: '#F4EEEC', text: '#34201E', muted: '#74504A' },
  },
  'vintage-linen': {
    name: 'Vintage Linen',
    vibe: 'Worn textile, natural, soft',
    colors: { primary: '#D8CCBC', secondary: '#E8E0D4', accent: '#C0B0A0', surface: '#F8F4F0', text: '#2C2822', muted: '#827A70' },
  },
  'vintage-morning-mist': {
    name: 'Vintage Morning Mist',
    vibe: 'Dewy, pale, atmospheric',
    colors: { primary: '#C8D0D0', secondary: '#DEE4E4', accent: '#A8B0B0', surface: '#F2F4F4', text: '#20282A', muted: '#687270' },
  },
  'vintage-dust': {
    name: 'Vintage Dust',
    vibe: 'Settled, muted, timeless',
    colors: { primary: '#C0B8A8', secondary: '#D8D0C4', accent: '#A09888', surface: '#F2F0EC', text: '#282420', muted: '#6E6A62' },
  },
  'vintage-antique': {
    name: 'Vintage Antique',
    vibe: 'Old-world, patina, classic',
    colors: { primary: '#B8A898', secondary: '#D0C4B8', accent: '#988878', surface: '#F0ECE6', text: '#28221E', muted: '#6E6258' },
  },
  'vintage-faded-denim': {
    name: 'Vintage Faded Denim',
    vibe: 'Worn-in, casual, nostalgic',
    colors: { primary: '#8098B8', secondary: '#A8B8D0', accent: '#607898', surface: '#ECF0F4', text: '#1A2436', muted: '#486080' },
  },
  'vintage-petal': {
    name: 'Vintage Petal',
    vibe: 'Pressed flower, delicate, preserved',
    colors: { primary: '#D0B8C0', secondary: '#E4D0D8', accent: '#B098A0', surface: '#F6F0F2', text: '#34202A', muted: '#785860' },
  },
};

const harmonies = [
  { name: 'Analogous', desc: 'Adjacent on color wheel — harmonious, subtle' },
  { name: 'Complementary', desc: 'Opposite on color wheel — high contrast, bold' },
  { name: 'Triadic', desc: '120° apart — balanced, vibrant' },
  { name: 'Split-Complementary', desc: 'Base + two adjacent to complement — versatile' },
  { name: 'Tetradic', desc: 'Two complementary pairs — rich, complex' },
  { name: 'Monochromatic', desc: 'Satu hue, multiple values — elegant, harmonious' },
];

const gradients = [
  { name: 'Sunset', css: 'linear-gradient(135deg, #FF6B35, #F7C59F, #EFEFEF)' },
  { name: 'Ocean', css: 'linear-gradient(135deg, #00B4D8, #0077B6, #023E8A)' },
  { name: 'Forest', css: 'linear-gradient(135deg, #2D6A4F, #40916C, #52B788)' },
  { name: 'Neon', css: 'linear-gradient(135deg, #A855F7, #EC4899, #F43F5E)' },
  { name: 'Aurora', css: 'linear-gradient(135deg, #06B6D4, #10B981, #84CC16)' },
  { name: 'Warmth', css: 'linear-gradient(135deg, #F97316, #DC2626, #DB2777)' },
  { name: 'Lavender', css: 'linear-gradient(135deg, #7C3AED, #A78BFA, #C4B5FD)' },
  { name: 'Mint', css: 'linear-gradient(135deg, #059669, #34D399, #6EE7B7)' },
  { name: 'Twilight', css: 'linear-gradient(135deg, #1E1B4B, #312E81, #4338CA)' },
  { name: 'Golden', css: 'linear-gradient(135deg, #92400E, #D97706, #FCD34D)' },
  { name: 'Corporate', css: 'linear-gradient(135deg, #1E40AF, #3B82F6, #60A5FA)' },
  { name: 'Rose', css: 'linear-gradient(135deg, #9D174D, #DB2777, #F472B6)' },
  { name: 'Midnight', css: 'linear-gradient(135deg, #020617, #0F172A, #1E293B)' },
  { name: 'Sage', css: 'linear-gradient(135deg, #365314, #4D7C0F, #65A30D)' },
  { name: 'Copper', css: 'linear-gradient(135deg, #7C2D12, #C2410C, #EA580C)' },
];

const industryColors = {
  fintech: { primary: '#0052CC', reasoning: 'Blue = trust, stability, professional' },
  healthcare: { primary: '#008080', reasoning: 'Teal = balance, healing. Clean, calm' },
  ecommerce: { primary: '#FF6B35', reasoning: 'Orange = CTA urgency. Blue = trust badge' },
  food: { primary: '#E63946', reasoning: 'Red/orange stimulate appetite. Green = fresh' },
  tech: { primary: '#3B82F6', reasoning: 'Blue = logic, intelligence. Indigo = creativity' },
  luxury: { primary: '#0A0A0A', reasoning: 'Black = sophistication. Gold = premium' },
  wellness: { primary: '#84A98C', reasoning: 'Soft earth tones = calm. Lavender = spiritual' },
  creative: { primary: '#7C3AED', reasoning: 'Bold = creativity. Unexpected combos = memorable' },
  education: { primary: '#2563EB', reasoning: 'Blue = focus. Slate = serious. Green = growth' },
  gaming: { primary: '#A855F7', reasoning: 'High saturation = excitement. Purple = fantasy' },
  realestate: { primary: '#1E3A5F', reasoning: 'Navy = stability. Warm gray = grounded' },
  fashion: { primary: '#0A0A0A', reasoning: 'Black canvas + bold accent = editorial' },
};

export function generatePalette(params = {}) {
  const {
    seed = 'saas-modern',
    industry,
    includeGradients = false,
    includeHarmonies = false,
    format = 'css',
  } = params;

  let output = '';

  // Find palette by seed name or industry
  let selectedPalette = palettes[seed];
  if (!selectedPalette && industry) {
    const industryKey = industryColors[industry] ? industry : Object.keys(industryColors)[0];
    output += `/* Industrial recommendation for: ${industry} */\n`;
    output += `/* ${industryColors[industryKey].reasoning} */\n\n`;
    selectedPalette = palettes['saas-modern'];
  }
  if (!selectedPalette) {
    selectedPalette = palettes['saas-modern'];
  }

  if (format === 'css') {
    output += `/* Palette: ${selectedPalette.name} — ${selectedPalette.vibe} */\n`;
    output += ':root {\n';
    Object.entries(selectedPalette.colors).forEach(([key, value]) => {
      const cssVar = key === 'primary' ? '--color-primary' 
        : key === 'secondary' ? '--color-secondary'
        : key === 'accent' ? '--color-accent'
        : key === 'surface' ? '--color-surface'
        : key === 'text' ? '--color-text'
        : key === 'muted' ? '--color-muted'
        : key === 'success' ? '--color-success'
        : key === 'warning' ? '--color-warning'
        : key === 'error' ? '--color-error'
        : key === 'info' ? '--color-info'
        : `--color-${key}`;
      output += `  ${cssVar}: ${value};\n`;
    });
    output += '}\n';
  } else if (format === 'tailwind') {
    output += `/* Palette: ${selectedPalette.name} — ${selectedPalette.vibe} */\n`;
    output += '@theme {\n';
    Object.entries(selectedPalette.colors).forEach(([key, value]) => {
      output += `  --color-brand-${key}: ${value};\n`;
    });
    output += '}\n';
  } else if (format === 'json') {
    output += JSON.stringify(selectedPalette, null, 2);
  } else if (format === 'preview') {
    output += `## ${selectedPalette.name}\n`;
    output += `Vibe: ${selectedPalette.vibe}\n\n`;
    Object.entries(selectedPalette.colors).forEach(([key, value]) => {
      output += `![${key}](${value}) \`${key}: ${value}\`\n`;
    });
  }

  if (includeGradients) {
    output += '\n\n/* ── Gradients ── */\n';
    gradients.slice(0, 5).forEach(g => {
      output += `/* ${g.name}: */ background: ${g.css};\n`;
    });
  }

  if (includeHarmonies) {
    output += '\n\n/* ── Harmonies ── */\n';
    harmonies.forEach(h => {
      output += `/* ${h.name}: ${h.desc} */\n`;
    });
  }

  return output;
}
