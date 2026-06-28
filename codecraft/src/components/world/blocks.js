// Block-Typen — realistischer Minecraft-Farbstil
// Jede Seite hat eigene Farbe: top / side / bottom

export const BLOCK_TYPES = {
  air: null,

  grass: {
    top:    '#79C05A',  // helles Grasgrün
    side:   '#8C6344',  // braune Erde-Seite
    sideTop:'#6AAF4A',  // grüner Streifen oben an der Seite
    bottom: '#7A5235',
  },
  dirt: {
    top:    '#9B6B3E',
    side:   '#9B6B3E',
    bottom: '#9B6B3E',
  },
  stone: {
    top:    '#9A9A9A',
    side:   '#8E8E8E',
    bottom: '#858585',
  },
  wood: {
    top:    '#7C5B2A',  // Jahresringe dunkler
    side:   '#A07040',  // Rinde heller/wärmer
    bottom: '#7C5B2A',
  },
  leaves: {
    top:    '#4A8C2A',
    side:   '#3D7A22',
    bottom: '#336618',
    transparent: true,
  },
  sand: {
    top:    '#DBC46A',
    side:   '#D4B95A',
    bottom: '#C9AC4A',
  },
  water: {
    top:    '#2E6EA6',
    side:   '#245C8C',
    bottom: '#1A4A72',
    transparent: true,
  },
  bedrock: {
    top:    '#3A3A3A',
    side:   '#2E2E2E',
    bottom: '#252525',
  },
}

export const BLOCK_IDS = {
  air:     0,
  grass:   1,
  dirt:    2,
  stone:   3,
  wood:    4,
  leaves:  5,
  sand:    6,
  water:   7,
  bedrock: 8,
}

export const ID_TO_BLOCK = Object.fromEntries(
  Object.entries(BLOCK_IDS).map(([name, id]) => [id, name])
)
