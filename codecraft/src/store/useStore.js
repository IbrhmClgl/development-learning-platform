import { create } from 'zustand'

const useStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Lektion
  currentLesson: 1,
  setLesson: (n) => set({ currentLesson: n }),
  progress: {},
  setProgress: (lessonId, done) =>
    set((s) => ({ progress: { ...s.progress, [lessonId]: done } })),

  // Welt (für Code-Editor → World API)
  worldActions: [],
  addWorldAction: (action) =>
    set((s) => ({ worldActions: [...s.worldActions, action] })),
  clearWorldActions: () => set({ worldActions: [] }),
}))

export default useStore
