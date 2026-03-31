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
    Relaxed: { bg: 'rgba(74,35,90,0.12)', text: '#4a235a' },
    Sleepy: { bg: 'rgba(74,35,90,0.12)', text: '#4a235a' },
    Energetic: { bg: 'rgba(26,92,36,0.12)', text: '#1a5c24' },
    Uplifted: { bg: 'rgba(26,92,36,0.12)', text: '#1a5c24' },
    Happy: { bg: 'rgba(218,165,32,0.15)', text: '#8B6914' },
    Euphoric: { bg: 'rgba(218,165,32,0.15)', text: '#8B6914' },
    Creative: { bg: 'rgba(0,128,128,0.12)', text: '#006666' },
    Focused: { bg: 'rgba(0,128,128,0.12)', text: '#006666' },
    Hungry: { bg: 'rgba(230,126,34,0.15)', text: '#a0522d' },
    Tingly: { bg: 'rgba(74,35,90,0.10)', text: '#4a235a' },
    Talkative: { bg: 'rgba(26,92,36,0.10)', text: '#1a5c24' },
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
};
