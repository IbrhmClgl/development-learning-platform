// Prozedurale Terrain-Generierung
// Simplex-ähnliches Noise über einfache Sinuswellen (kein externes Paket nötig)

import { BLOCK_IDS } from './blocks.js'

const { air, grass, dirt, stone, wood, leaves, bedrock } = BLOCK_IDS

// Einfaches 2D-Noise mit mehreren Sinuswellen
function noise(x, z, seed = 1) {
  const a = Math.sin(x * 0.13 + seed) * Math.cos(z * 0.09 + seed * 1.3)
  const b = Math.sin(x * 0.07 + z * 0.11 + seed * 2.1) * 0.5
  const c = Math.sin(x * 0.21 - z * 0.17 + seed * 0.7) * 0.25
  return (a + b + c) / 1.75  // -1 .. 1
}

function heightAt(x, z) {
  const n = noise(x, z, 42)
  return Math.floor(4 + n * 5)  // Höhe 0..9
}

// Baum an Position (x, treeY, z) pflanzen
function placeTree(world, x, treeY, z, size) {
  // Stamm
  for (let y = treeY; y < treeY + 4; y++) {
    world[`${x},${y},${z}`] = wood
  }
  // Blätter (3x3x3 Kugel oben)
  for (let dy = 3; dy <= 5; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) + Math.abs(dz) + Math.abs(dy - 4) <= 3) {
          const key = `${x + dx},${treeY + dy},${z + dz}`
          if (!world[key]) world[key] = leaves
        }
      }
    }
  }
}

export function generateWorld(chunkSize = 32) {
  const world = {}   // key: "x,y,z" → blockId
  const half = Math.floor(chunkSize / 2)

  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      const h = heightAt(x, z)

      // Bedrock
      world[`${x},-1,${z}`] = bedrock

      // Stein-Schichten
      for (let y = 0; y < h - 2; y++) {
        world[`${x},${y},${z}`] = stone
      }

      // Dirt-Schichten (2 Blöcke)
      world[`${x},${h - 2},${z}`] = dirt
      world[`${x},${h - 1},${z}`] = dirt

      // Gras oben
      world[`${x},${h},${z}`] = grass

      // Bäume zufällig (deterministisch per Koordinate)
      const treeRng = Math.sin(x * 127.1 + z * 311.7) * 43758.5
      const treeFrac = treeRng - Math.floor(treeRng)
      if (treeFrac > 0.93 && h > 3) {
        placeTree(world, x, h + 1, z, chunkSize)
      }
    }
  }

  return world
}

// Welt → Array von Positionen pro Block-Typ (für Instanced Mesh)
export function groupByType(world) {
  const groups = {}
  for (const [key, id] of Object.entries(world)) {
    if (id === BLOCK_IDS.air) continue
    if (!groups[id]) groups[id] = []
    const [x, y, z] = key.split(',').map(Number)
    groups[id].push([x, y, z])
  }
  return groups
}
