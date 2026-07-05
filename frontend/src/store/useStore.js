import { create } from 'zustand'

export const useStore = create((set) => ({
  // UI State
  isNavbarOpen: false,
  toggleNavbar: () => set((state) => ({ isNavbarOpen: !state.isNavbarOpen })),
  
  // AI Orb State
  aiStatus: 'idle', // 'idle' | 'thinking' | 'speaking'
  setAiStatus: (status) => set({ aiStatus: status }),
  
  // Mouse Parallax State (Optimized to not trigger re-renders on DOM)
  mousePosition: { x: 0, y: 0 },
  setMousePosition: (pos) => set({ mousePosition: pos }),
}))