import { useState, useEffect } from 'react'

export default function HUD() {
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const check = () => setLocked(!!document.pointerLockElement)
    document.addEventListener('pointerlockchange', check)
    return () => document.removeEventListener('pointerlockchange', check)
  }, [])

  const requestLock = () => {
    // Feuert Custom Event → Player.jsx hört zu und ruft requestPointerLock()
    // auf dem Canvas-Element — das ist das einzige Element das es darf
    window.dispatchEvent(new CustomEvent('codecraft:requestLock'))
  }

  const HOTBAR = [
    { color: '#5D9E1D', label: 'Gras' },
    { color: '#8B5E3C', label: 'Erde' },
    { color: '#888780', label: 'Stein' },
    { color: '#B8732A', label: 'Holz'  },
    { color: '#3B6D11', label: 'Blätter' },
  ]

  return (
    <>
      {/* Crosshair */}
      {locked && <div className="crosshair" />}

      {/* Overlay — klickbar, feuert requestLock */}
      {!locked && (
        <div
          className="click-overlay"
          onClick={requestLock}
          style={{ userSelect: 'none' }}
        >
          <h1>⛏ CodeCraft</h1>
          <p>
            WASD — Bewegen<br />
            MAUS — Umschauen<br />
            LEERTASTE — Springen<br />
            SHIFT — Sprinten<br />
            ESC — Pause
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); requestLock() }}
            style={{
              marginTop: 20,
              padding: '12px 28px',
              background: '#5D9E1D',
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '9px',
              border: '3px solid #3B6D11',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #27500A',
              outline: 'none',
            }}
          >
            ▶ Spielen
          </button>
          <p style={{ fontSize: '7px', marginTop: 12, opacity: 0.5 }}>
            (Browser muss Pointer Lock erlauben)
          </p>
        </div>
      )}

      {/* Hotbar */}
      {locked && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 3, zIndex: 10,
        }}>
          {HOTBAR.map((block, i) => (
            <div key={i} style={{
              width: 46, height: 46,
              background: '#2C2C2A',
              border: i === 0 ? '2px solid #fff' : '2px solid #555',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 30, height: 30,
                background: block.color,
                imageRendering: 'pixelated',
                boxShadow: 'inset -4px -4px 0 rgba(0,0,0,0.35), inset 4px 4px 0 rgba(255,255,255,0.15)',
              }} />
            </div>
          ))}
        </div>
      )}

      {/* Version */}
      {locked && (
        <div style={{
          position: 'fixed', top: 10, left: 10,
          color: '#fff', fontSize: '7px',
          fontFamily: '"Press Start 2P", monospace',
          textShadow: '1px 1px #000',
          zIndex: 10, opacity: 0.6, lineHeight: 2,
        }}>
          CodeCraft v0.1<br />
          ESC = Pause
        </div>
      )}
    </>
  )
}
