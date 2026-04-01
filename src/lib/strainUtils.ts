export const getCategoryColors = (category: string) => {
  switch (category) {
    case 'Indica':
      return { bg: '#4a235a', text: '#fff', light: 'rgba(74,35,90,0.08)' };
    case 'Sativa':
      return { bg: '#1a5c24', text: '#fff', light: 'rgba(26,92,36,0.08)' };
    case 'Hybrid':
    default:
      return { bg: '#1a3a5c', text: '#fff', light: 'rgba(26,58,92,0.08)' };
  }
};

export const getFeelingColor = (feeling: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    // Calming — purple tones
    Relaxed: { bg: 'rgba(74,35,90,0.12)', text: '#4a235a' },
    Sleepy: { bg: 'rgba(74,35,90,0.12)', text: '#4a235a' },
    Tingly: { bg: 'rgba(74,35,90,0.10)', text: '#4a235a' },
    Calm: { bg: 'rgba(74,35,90,0.12)', text: '#4a235a' },
    Meditative: { bg: 'rgba(74,35,90,0.12)', text: '#4a235a' },
    Mellow: { bg: 'rgba(74,35,90,0.10)', text: '#4a235a' },
    Soothing: { bg: 'rgba(74,35,90,0.10)', text: '#4a235a' },
    Dreamy: { bg: 'rgba(74,35,90,0.10)', text: '#4a235a' },
    Spiritual: { bg: 'rgba(74,35,90,0.12)', text: '#4a235a' },
    Grounded: { bg: 'rgba(74,35,90,0.10)', text: '#4a235a' },

    // Energising — green tones
    Energetic: { bg: 'rgba(26,92,36,0.12)', text: '#1a5c24' },
    Uplifted: { bg: 'rgba(26,92,36,0.12)', text: '#1a5c24' },
    Talkative: { bg: 'rgba(26,92,36,0.10)', text: '#1a5c24' },
    Motivated: { bg: 'rgba(26,92,36,0.12)', text: '#1a5c24' },
    Stimulated: { bg: 'rgba(26,92,36,0.10)', text: '#1a5c24' },
    Alert: { bg: 'rgba(26,92,36,0.10)', text: '#1a5c24' },
    Sociable: { bg: 'rgba(26,92,36,0.10)', text: '#1a5c24' },
    Confident: { bg: 'rgba(26,92,36,0.12)', text: '#1a5c24' },

    // Mood — gold tones
    Happy: { bg: 'rgba(218,165,32,0.15)', text: '#8B6914' },
    Euphoric: { bg: 'rgba(218,165,32,0.15)', text: '#8B6914' },
    Giggly: { bg: 'rgba(218,165,32,0.15)', text: '#8B6914' },
    Blissful: { bg: 'rgba(218,165,32,0.15)', text: '#8B6914' },
    Nostalgic: { bg: 'rgba(218,165,32,0.12)', text: '#8B6914' },
    Aroused: { bg: 'rgba(218,165,32,0.12)', text: '#8B6914' },

    // Mental — teal tones
    Creative: { bg: 'rgba(0,128,128,0.12)', text: '#006666' },
    Focused: { bg: 'rgba(0,128,128,0.12)', text: '#006666' },
    Inspired: { bg: 'rgba(0,128,128,0.12)', text: '#006666' },
    Cerebral: { bg: 'rgba(0,128,128,0.12)', text: '#006666' },
    Balanced: { bg: 'rgba(0,128,128,0.10)', text: '#006666' },

    // Body — orange tones
    Hungry: { bg: 'rgba(230,126,34,0.15)', text: '#a0522d' },
    Painless: { bg: 'rgba(230,126,34,0.12)', text: '#a0522d' },
  };
  return map[feeling] || { bg: 'rgba(0,0,0,0.06)', text: '#555' };
};

export const getTerpeneColor = (terpene: string) => {
  const map: Record<string, string> = {
    Myrcene: '#2e7d32',
    Caryophyllene: '#6a1b9a',
    Limonene: '#f57f17',
    Terpinolene: '#0277bd',
    Linalool: '#ad1457',
    Pinene: '#00695c',
    Humulene: '#4e342e',
    Ocimene: '#558b2f',
    Bisabolol: '#7b1fa2',
    Valencene: '#e65100',
    Nerolidol: '#4a148c',
    Guaiol: '#1b5e20',
    Camphene: '#33691e',
    Borneol: '#006064',
    Eucalyptol: '#00838f',
  };
  return map[terpene] || '#555';
};

export const terpeneDescriptions: Record<string, string> = {
  Myrcene: 'Earthy & musky — enhances relaxation and sedative effects',
  Caryophyllene: 'Spicy & peppery — anti-inflammatory, stress relief',
  Limonene: 'Bright citrus — mood-enhancing, uplifting energy',
  Terpinolene: 'Fresh & herbal — energising, found in sage and rosemary',
  Linalool: 'Floral lavender — calming, anxiety and stress relief',
  Pinene: 'Crisp pine — mental clarity, alertness, memory',
  Humulene: 'Earthy herbal — anti-inflammatory, appetite suppression',
  Ocimene: 'Sweet basil — uplifting, antiviral, decongestant',
  Bisabolol: 'Gentle chamomile — soothing, anti-irritation, healing',
  Valencene: 'Fresh citrus — energising, insect-repellent properties',
  Nerolidol: 'Woody floral — sedative, anti-parasitic, skin penetration',
  Guaiol: 'Pine & rose — anti-inflammatory, antimicrobial',
  Camphene: 'Sharp herbal — antioxidant, cardiovascular benefits',
  Borneol: 'Cool minty — analgesic, anti-insomnia, calming',
  Eucalyptol: 'Fresh eucalyptus — respiratory relief, mental clarity',
};

export const effectEmojis: Record<string, string> = {
  Relaxed: '😌',
  Euphoric: '😊',
  Happy: '😄',
  Sleepy: '😴',
  Energetic: '⚡',
  Creative: '🎨',
  Focused: '🎯',
  Uplifted: '🚀',
  Talkative: '💬',
  Hungry: '🍔',
  Tingly: '✨',
  Calm: '🧘',
  Giggly: '🤭',
  Aroused: '💕',
  Motivated: '💪',
  Inspired: '💡',
  Meditative: '🧘‍♂️',
  Sociable: '🤝',
  Dreamy: '💭',
  Blissful: '😇',
  Painless: '💆',
  Mellow: '🌊',
  Balanced: '⚖️',
  Alert: '👁️',
  Nostalgic: '🌅',
  Cerebral: '🧠',
  Soothing: '🫧',
  Spiritual: '🕉️',
  Grounded: '🌳',
  Confident: '💎',
  Stimulated: '⚡',
};

export const flavourEmojis: Record<string, string> = {
  Earthy: '🌍',
  Sweet: '🍬',
  Citrus: '🍋',
  Tropical: '🌴',
  Berry: '🫐',
  Berries: '🫐',
  Grape: '🍇',
  Pine: '🌲',
  Chocolate: '🍫',
  Spicy: '🌶️',
  Spice: '🌶️',
  Vanilla: '🌸',
  Gas: '⛽',
  Floral: '🌸',
  Pineapple: '🍍',
  Watermelon: '🍉',
  Candy: '🍭',
  Coffee: '☕',
  Orange: '🍊',
  Fruity: '🍑',
  Blueberry: '🫐',
  Hash: '🟤',
  Skunky: '🦨',
  Herbal: '🌿',
  Lemon: '🍋',
  Lime: '🍈',
  Mango: '🥭',
  Peach: '🍑',
  Strawberry: '🍓',
  Cherry: '🍒',
  Apple: '🍏',
  Banana: '🍌',
  Coconut: '🥥',
  Lavender: '💐',
  Rose: '🌹',
  Mint: '🌿',
  Menthol: '🧊',
  Diesel: '⛽',
  Fuel: '⛽',
  Cheese: '🧀',
  Nutty: '🥜',
  Butter: '🧈',
  Cream: '🍦',
  Woody: '🪵',
  Sage: '🌿',
  Tea: '🍵',
  Honey: '🍯',
  Ginger: '🫚',
  Pepper: '🌶️',
  Cinnamon: '🫙',
  Caramel: '🍮',
  Ammonia: '💨',
  Chemical: '🧪',
  Musky: '🫎',
  Dank: '🌿',
  Skunk: '🦨',
  Tobacco: '🍂',
  Plum: '🫐',
  Apricot: '🍑',
  Bubblegum: '🫧',
  Kush: '🌿',
  Haze: '🌫️',
  Tar: '🖤',
};
