import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SPEED      = 6
const SPRINT     = 10
const JUMP_FORCE = 5
const GRAVITY    = -18
const EYE_HEIGHT = 1.65

export default function Player() {
  const { camera, gl } = useThree()
  const keys     = useRef({})
  const isLocked = useRef(false)
  const yVel     = useRef(0)
  const onGround = useRef(false)
  const euler    = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))

  // Startposition: direkt auf dem Terrain (max Höhe ~9 + Augenhöhe)
  useEffect(() => {
    camera.position.set(0, 11.65, 0)   // y = Terrain-Max(9) + 1 Dirt + EyeHeight
    camera.rotation.set(0, 0, 0)
  }, [camera])

  // Pointer Lock via Custom Event vom HUD-Button
  useEffect(() => {
    const canvas = gl.domElement
    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas
    }
    document.addEventListener('pointerlockchange', onLockChange)
    window.addEventListener('codecraft:requestLock', () => canvas.requestPointerLock())
    return () => {
      document.removeEventListener('pointerlockchange', onLockChange)
    }
  }, [gl])

  // Maus-Look
  useEffect(() => {
    const onMove = (e) => {
      if (!isLocked.current) return
      euler.current.y -= e.movementX * 0.002
      euler.current.x -= e.movementY * 0.002
      euler.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.current.x))
      camera.quaternion.setFromEuler(euler.current)
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [camera])

  // Tastatur
  useEffect(() => {
    const down = (e) => { keys.current[e.code] = true }
    const up   = (e) => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup',   up)
    }
  }, [])

  useFrame((_, dt) => {
    if (!isLocked.current) return
    const k = keys.current

    // Bewegungsrichtung aus Kamera-Blickrichtung (Y ignorieren)
    const fwd   = new THREE.Vector3()
    const right = new THREE.Vector3()
    camera.getWorldDirection(fwd)
    fwd.y = 0; fwd.normalize()
    right.crossVectors(fwd, THREE.Object3D.DEFAULT_UP)

    const dir = new THREE.Vector3()
    if (k['KeyW'] || k['ArrowUp'])    dir.add(fwd)
    if (k['KeyS'] || k['ArrowDown'])  dir.sub(fwd)
    if (k['KeyA'] || k['ArrowLeft'])  dir.sub(right)
    if (k['KeyD'] || k['ArrowRight']) dir.add(right)
    if (dir.lengthSq() > 0) dir.normalize()

    const speed = (k['ShiftLeft'] || k['ShiftRight']) ? SPRINT : SPEED
    camera.position.x += dir.x * speed * dt
    camera.position.z += dir.z * speed * dt

    // Gravitation + Sprung
    yVel.current += GRAVITY * dt
    if (onGround.current && k['Space']) {
      yVel.current = JUMP_FORCE
      onGround.current = false
    }
    camera.position.y += yVel.current * dt

    // Terrain-Kollision: berechne erwartete Bodenhöhe an aktueller XZ-Position
    const groundY = terrainHeight(camera.position.x, camera.position.z) + EYE_HEIGHT
    if (camera.position.y <= groundY) {
      camera.position.y = groundY
      yVel.current = 0
      onGround.current = true
    }

    // Weltgrenzen
    camera.position.x = Math.max(-23, Math.min(23, camera.position.x))
    camera.position.z = Math.max(-23, Math.min(23, camera.position.z))
  })

  return null
}

// Gleiche Formel wie terrain.js heightAt() — gibt Bodenhöhe für XZ zurück
function terrainHeight(x, z) {
  const a = Math.sin(x * 0.13 + 42) * Math.cos(z * 0.09 + 42 * 1.3)
  const b = Math.sin(x * 0.07 + z * 0.11 + 42 * 2.1) * 0.5
  const c = Math.sin(x * 0.21 - z * 0.17 + 42 * 0.7) * 0.25
  const n = (a + b + c) / 1.75
  return Math.floor(4 + n * 5)  // Gras-Oberkante
}
