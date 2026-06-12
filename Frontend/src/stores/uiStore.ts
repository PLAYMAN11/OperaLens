import { create } from 'zustand'

interface UiState {
  commandPaletteOpen: boolean
  copilotOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  setCopilotOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  commandPaletteOpen: false,
  copilotOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setCopilotOpen: (open) => set({ copilotOpen: open }),
}))
