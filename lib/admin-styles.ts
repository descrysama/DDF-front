import type React from 'react'
import { AD } from './admin-tokens'

export const fieldStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  border: `1px solid ${AD.border}`,
  borderRadius: 6,
  fontSize: 14,
  color: AD.ink,
  background: '#fff',
  boxSizing: 'border-box',
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: AD.ink,
  marginBottom: 4,
}

export const MONO: React.CSSProperties = {
  fontFamily: 'Geist Mono, ui-monospace, monospace',
  fontSize: 11.5,
  color: AD.inkMuted,
}

export const metaRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderBottom: `1px solid ${AD.border}`,
  fontSize: 14,
}

export const cardStyle: React.CSSProperties = {
  background: AD.surface,
  border: `1px solid ${AD.border}`,
  borderRadius: 10,
  padding: 24,
}
