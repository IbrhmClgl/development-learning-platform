import { useMemo } from 'react'
import * as THREE from 'three'
import { generateWorld, groupByType } from './terrain.js'
import { BLOCK_TYPES, ID_TO_BLOCK } from './blocks.js'

// Erstellt eine InstancedMesh direkt mit korrekten Matrizen
function BlockInstances({ positions, blockDef }) {
  const mesh = useMemo(() => {
    if (!positions || positions.length === 0) return null

    const geo = new THREE.BoxGeometry(1, 1, 1)

    // Vertex Colors pro Face (BoxGeometry: right, left, top, bottom, front, back)
    const top    = new THREE.Color(blockDef.top)
    const side   = new THREE.Color(blockDef.side)
    const bottom = new THREE.Color(blockDef.bottom)
    const faceColors = [side, side, top, bottom, side, side]

    const colors = []
    for (let f = 0; f < 6; f++) {
      const c = faceColors[f]
      for (let v = 0; v < 4; v++) colors.push(c.r, c.g, c.b)
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const mat = new THREE.MeshLambertMaterial({
      vertexColors: true,
      transparent: !!blockDef.transparent,
      opacity: blockDef.transparent ? 0.75 : 1,
    })

    const mesh = new THREE.InstancedMesh(geo, mat, positions.length)
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Matrizen SOFORT setzen — kein useEffect, kein ref-Timing-Problem
    const dummy = new THREE.Object3D()
    positions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true

    return mesh
  }, [positions, blockDef])

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
