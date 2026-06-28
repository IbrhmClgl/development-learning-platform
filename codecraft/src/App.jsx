import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import MinecraftWorld from './components/world/MinecraftWorld.jsx'
import HUD from './components/world/HUD.jsx'
import Player from './components/world/Player.jsx'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ fov: 70, near: 0.1, far: 200 }}
        gl={{ antialias: false }}
      >
        {/* Minecraft-typischer blauer Himmel */}
        <Sky
          distance={450}
          sunPosition={[1, 0.4, 0]}
          inclination={0.55}
          azimuth={0.25}
        />

        {/* Licht */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[20, 40, 20]}
          intensity={1.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />

        {/* Nebel ab 60 Blöcken — wie Minecraft Render Distance */}
        <fog attach="fog" args={['#87CEEB', 30, 80]} />

        <Player />
        <MinecraftWorld />
      </Canvas>
      <HUD />
    </div>
  )
}
