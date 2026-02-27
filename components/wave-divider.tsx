const WAVE_PATH =
  "M0,30 C180,0 360,60 540,30 C720,0 900,60 1080,30 C1260,0 1440,60 1440,30 L1440,70 L0,70 Z"
const WAVE_PATH_INV =
  "M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,70 L0,70 Z"

// Exported so the Hero section can reuse the same path for its internal wave
export { WAVE_PATH_INV }

interface WaveDividerProps {
  from: string
  to: string
  invert?: boolean
}

export function WaveDivider({ from, to, invert = false }: WaveDividerProps) {
  return (
    <div aria-hidden="true" style={{ background: from, lineHeight: 0, display: "block" }}>
      <svg
        viewBox="0 0 1440 70"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 70 }}
      >
        <path d={invert ? WAVE_PATH_INV : WAVE_PATH} fill={to} />
      </svg>
    </div>
  )
}
