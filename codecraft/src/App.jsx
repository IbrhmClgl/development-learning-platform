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
        gl={{ antialias: false }}   // pixelig = Minecraft-Feeling
      >
        {/* Realistischer Minecraft-Himmel */}
        <Sky
          distance={450}
          sunPosition={[2, 1, 0.5]}
          inclination={0.52}
          azimuth={0.22}
          mieCoefficient={0.003}
          mieDirectionalG={0.9}
          rayleigh={0.8}
          turbidity={8}
        />

        {/* Umgebungslicht — warmes Tageslicht */}
        <ambientLight intensity={0.55} color="#FFF4E0" />

        {/* Sonne von schräg oben — wirft Schatten */}
        <directionalLight
          position={[40, 60, 30]}
          intensity={1.1}
          color="#FFFBE8"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={1}
          shadow-camera-far={150}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />

        {/* Leichtes Fülllicht von unten/vorne — simuliert Himmelslicht */}
        <directionalLight
          position={[-10, 10, -20]}
          intensity={0.2}
          color="#C8E8FF"
        />

        {/* Minecraft-typischer Nebel */}
        <fog attach="fog" args={['#99C8E8', 35, 90]} />

        <Player />
        <MinecraftWorld />
      </Canvas>
      <HUD />
    </div>
  )
}
