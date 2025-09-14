"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface AppState {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  notifications: Notification[]
  uploadQueue: UploadItem[]
}

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface UploadItem {
  id: string
  fileName: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  error?: string
}

type AppAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_OPEN"; payload: boolean }
  | { type: "SET_THEME"; payload: "light" | "dark" | "system" }
  | { type: "ADD_NOTIFICATION"; payload: Omit<Notification, "id" | "timestamp" | "read"> }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "ADD_UPLOAD_ITEM"; payload: Omit<UploadItem, "id"> }
  | { type: "UPDATE_UPLOAD_PROGRESS"; payload: { id: string; progress: number } }
  | { type: "UPDATE_UPLOAD_STATUS"; payload: { id: string; status: UploadItem["status"]; error?: string } }
  | { type: "REMOVE_UPLOAD_ITEM"; payload: string }
  | { type: "CLEAR_UPLOAD_QUEUE" }

const initialState: AppState = {
  sidebarOpen: false,
  theme: "system",
  notifications: [],
  uploadQueue: [],
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload }

    case "SET_THEME":
      return { ...state, theme: action.payload }

    case "ADD_NOTIFICATION": {
      const notification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false,
      }
      return {
        ...state,
        notifications: [notification, ...state.notifications],
      }
    }

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification,
        ),
      }

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload),
      }

    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [] }

    case "ADD_UPLOAD_ITEM": {
      const uploadItem: UploadItem = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      }
      return {
        ...state,
        uploadQueue: [...state.uploadQueue, uploadItem],
      }
    }

    case "UPDATE_UPLOAD_PROGRESS":
      return {
        ...state,
        uploadQueue: state.uploadQueue.map((item) =>
          item.id === action.payload.id ? { ...item, progress: action.payload.progress } : item,
        ),
      }

    case "UPDATE_UPLOAD_STATUS":
      return {
        ...state,
        uploadQueue: state.uploadQueue.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status, error: action.payload.error }
            : item,
        ),
      }

    case "REMOVE_UPLOAD_ITEM":
      return {
        ...state,
        uploadQueue: state.uploadQueue.filter((item) => item.id !== action.payload),
      }

    case "CLEAR_UPLOAD_QUEUE":
      return { ...state, uploadQueue: [] }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  actions: {
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    setTheme: (theme: "light" | "dark" | "system") => void
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
    markNotificationRead: (id: string) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void
    addUploadItem: (item: Omit<UploadItem, "id">) => void
    updateUploadProgress: (id: string, progress: number) => void
    updateUploadStatus: (id: string, status: UploadItem["status"], error?: string) => void
    removeUploadItem: (id: string) => void
    clearUploadQueue: () => void
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const actions = {
    toggleSidebar: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
    setSidebarOpen: (open: boolean) => dispatch({ type: "SET_SIDEBAR_OPEN", payload: open }),
    setTheme: (theme: "light" | "dark" | "system") => dispatch({ type: "SET_THEME", payload: theme }),
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) =>
      dispatch({ type: "ADD_NOTIFICATION", payload: notification }),
    markNotificationRead: (id: string) => dispatch({ type: "MARK_NOTIFICATION_READ", payload: id }),
    removeNotification: (id: string) => dispatch({ type: "REMOVE_NOTIFICATION", payload: id }),
    clearNotifications: () => dispatch({ type: "CLEAR_NOTIFICATIONS" }),
    addUploadItem: (item: Omit<UploadItem, "id">) => dispatch({ type: "ADD_UPLOAD_ITEM", payload: item }),
    updateUploadProgress: (id: string, progress: number) =>
      dispatch({ type: "UPDATE_UPLOAD_PROGRESS", payload: { id, progress } }),
    updateUploadStatus: (id: string, status: UploadItem["status"], error?: string) =>
      dispatch({ type: "UPDATE_UPLOAD_STATUS", payload: { id, status, error } }),
    removeUploadItem: (id: string) => dispatch({ type: "REMOVE_UPLOAD_ITEM", payload: id }),
    clearUploadQueue: () => dispatch({ type: "CLEAR_UPLOAD_QUEUE" }),
  }

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
