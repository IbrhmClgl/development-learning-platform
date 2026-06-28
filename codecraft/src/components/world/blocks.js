// Block-Typen mit Flat-Color Pixel-Style
// Jede Seite eines Blocks kann eine eigene Farbe haben (top/side/bottom)

export const BLOCK_TYPES = {
  air:    null,
  grass:  { top: '#5D9E1D', side: '#8B5E3C', bottom: '#8B5E3C', sideTop: '#5D9E1D' },
  dirt:   { top: '#8B5E3C', side: '#8B5E3C', bottom: '#8B5E3C' },
  stone:  { top: '#888780', side: '#888780', bottom: '#888780' },
  wood:   { top: '#6B4423', side: '#B8732A', bottom: '#6B4423' },
  leaves: { top: '#3B6D11', side: '#3B6D11', bottom: '#3B6D11', transparent: true },
  sand:   { top: '#FAC775', side: '#FAC775', bottom: '#FAC775' },
  water:  { top: '#1C78C8', side: '#1C78C8', bottom: '#1C78C8', transparent: true },
  bedrock:{ top: '#2C2C2A', side: '#2C2C2A', bottom: '#2C2C2A' },
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
