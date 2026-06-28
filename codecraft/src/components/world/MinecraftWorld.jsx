import { useMemo } from 'react'
import * as THREE from 'three'
import { generateWorld, groupByType } from './terrain.js'
import { BLOCK_TYPES, ID_TO_BLOCK } from './blocks.js'

// Erzeugt eine fertige InstancedMesh mit Vertex-Farben pro Seite
function BlockInstances({ positions, blockDef }) {
  const mesh = useMemo(() => {
    if (!positions || positions.length === 0) return null

    const geo = new THREE.BoxGeometry(1, 1, 1)

    // BoxGeometry Face-Reihenfolge: +x, -x, +y, -y, +z, -z
    const top    = new THREE.Color(blockDef.top)
    const side   = new THREE.Color(blockDef.side)
    const bottom = new THREE.Color(blockDef.bottom)

    // Pro Face 4 Vertices × RGB
    const faceColors = [side, side, top, bottom, side, side]
    const colors = []
    for (let f = 0; f < 6; f++) {
      const c = faceColors[f]
      for (let v = 0; v < 4; v++) colors.push(c.r, c.g, c.b)
    }

    // Gras: obere Vertex-Reihe der Seitenflächen grün einfärben
    if (blockDef.sideTop) {
      const st = new THREE.Color(blockDef.sideTop)
      // Seiten-Faces: Indizes 0,1,4,5 → je 4 Vertices
      // BoxGeometry Vertex-Layout pro Face: oben-links, oben-rechts, unten-links, unten-rechts
      // Obere 2 Vertices = Index 0 und 1 innerhalb der Face
      for (const faceIdx of [0, 1, 4, 5]) {
        const base = faceIdx * 4 * 3
        // Vertex 0
        colors[base + 0] = st.r; colors[base + 1] = st.g; colors[base + 2] = st.b
        // Vertex 1
        colors[base + 3] = st.r; colors[base + 4] = st.g; colors[base + 5] = st.b
      }
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    // Leichtes AO-ähnliches Shading: Seiten minimal dunkler als Top
    const mat = new THREE.MeshLambertMaterial({
      vertexColors: true,
      transparent: !!blockDef.transparent,
      opacity: blockDef.transparent ? 0.78 : 1,
    })

    const mesh = new THREE.InstancedMesh(geo, mat, positions.length)
    mesh.castShadow    = true
    mesh.receiveShadow = true

    const dummy = new THREE.Object3D()
    positions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true

    return mesh
  }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  if (!mesh) return null
  return <primitive object={mesh} />
}

export default function MinecraftWorld() {
  const groups = useMemo(() => {
    const world = generateWorld(48)
    return groupByType(world)
  }, [])

  return (
    <group>
      {Object.entries(groups).map(([id, positions]) => {
        const blockName = ID_TO_BLOCK[id]
        const blockDef  = BLOCK_TYPES[blockName]
        if (!blockDef) return null
        return (
          <BlockInstances
            key={blockName}
            positions={positions}
            blockDef={blockDef}
          />
        )
      })}
    </group>
  )
}
