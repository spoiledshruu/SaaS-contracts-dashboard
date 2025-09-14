"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { ContractsAPI, type Contract, type ContractDetail } from "@/services/api"

interface ContractsState {
  contracts: Contract[]
  filteredContracts: Contract[]
  selectedContract: ContractDetail | null
  loading: boolean
  error: string | null
  filters: {
    searchTerm: string
    status: string
    riskScore: string
  }
  pagination: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

type ContractsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CONTRACTS"; payload: Contract[] }
  | { type: "SET_FILTERED_CONTRACTS"; payload: Contract[] }
  | { type: "SET_SELECTED_CONTRACT"; payload: ContractDetail | null }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_STATUS_FILTER"; payload: string }
  | { type: "SET_RISK_FILTER"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "RESET_FILTERS" }

const initialState: ContractsState = {
  contracts: [],
  filteredContracts: [],
  selectedContract: null,
  loading: false,
  error: null,
  filters: {
    searchTerm: "",
    status: "all",
    riskScore: "all",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
}

function contractsReducer(state: ContractsState, action: ContractsAction): ContractsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }

    case "SET_CONTRACTS":
      return {
        ...state,
        contracts: action.payload,
        loading: false,
        error: null,
      }

    case "SET_FILTERED_CONTRACTS": {
      const totalItems = action.payload.length
      const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage)
      return {
        ...state,
        filteredContracts: action.payload,
        pagination: {
          ...state.pagination,
          totalItems,
          totalPages,
          currentPage: Math.min(state.pagination.currentPage, Math.max(1, totalPages)),
        },
      }
    }

    case "SET_SELECTED_CONTRACT":
      return { ...state, selectedContract: action.payload }

    case "SET_SEARCH_TERM":
      return {
        ...state,
        filters: { ...state.filters, searchTerm: action.payload },
        pagination: { ...state.pagination, currentPage: 1 },
      }

    case "SET_STATUS_FILTER":
      return {
        ...state,
        filters: { ...state.filters, status: action.payload },
        pagination: { ...state.pagination, currentPage: 1 },
      }

    case "SET_RISK_FILTER":
      return {
        ...state,
        filters: { ...state.filters, riskScore: action.payload },
        pagination: { ...state.pagination, currentPage: 1 },
      }

    case "SET_CURRENT_PAGE":
      return {
        ...state,
        pagination: { ...state.pagination, currentPage: action.payload },
      }

    case "RESET_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
        pagination: { ...state.pagination, currentPage: 1 },
      }

    default:
      return state
  }
}

interface ContractsContextType {
  state: ContractsState
  actions: {
    loadContracts: () => Promise<void>
    loadContract: (id: string) => Promise<void>
    setSearchTerm: (term: string) => void
    setStatusFilter: (status: string) => void
    setRiskFilter: (risk: string) => void
    setCurrentPage: (page: number) => void
    resetFilters: () => void
    applyFilters: () => Promise<void>
  }
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined)

export function ContractsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contractsReducer, initialState)

  // Apply filters whenever filter state changes
  const applyFilters = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const filtered = await ContractsAPI.filterContracts(
        state.filters.status,
        state.filters.riskScore,
        state.filters.searchTerm,
      )
      dispatch({ type: "SET_FILTERED_CONTRACTS", payload: filtered })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Filter failed" })
    }
  }

  // Load all contracts
  const loadContracts = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const contracts = await ContractsAPI.getContracts()
      dispatch({ type: "SET_CONTRACTS", payload: contracts })
      dispatch({ type: "SET_FILTERED_CONTRACTS", payload: contracts })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to load contracts" })
    }
  }

  // Load specific contract
  const loadContract = async (id: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const contract = await ContractsAPI.getContract(id)
      dispatch({ type: "SET_SELECTED_CONTRACT", payload: contract })
      dispatch({ type: "SET_LOADING", payload: false })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to load contract" })
      dispatch({ type: "SET_SELECTED_CONTRACT", payload: null })
    }
  }

  // Filter actions
  const setSearchTerm = (term: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: term })
  }

  const setStatusFilter = (status: string) => {
    dispatch({ type: "SET_STATUS_FILTER", payload: status })
  }

  const setRiskFilter = (risk: string) => {
    dispatch({ type: "SET_RISK_FILTER", payload: risk })
  }

  const setCurrentPage = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page })
  }

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" })
  }

  // Auto-apply filters when filter state changes
  useEffect(() => {
    if (state.contracts.length > 0) {
      applyFilters()
    }
  }, [state.filters.searchTerm, state.filters.status, state.filters.riskScore])

  const actions = {
    loadContracts,
    loadContract,
    setSearchTerm,
    setStatusFilter,
    setRiskFilter,
    setCurrentPage,
    resetFilters,
    applyFilters,
  }

  return <ContractsContext.Provider value={{ state, actions }}>{children}</ContractsContext.Provider>
}

export function useContracts() {
  const context = useContext(ContractsContext)
  if (context === undefined) {
    throw new Error("useContracts must be used within a ContractsProvider")
  }
  return context
}

// Computed selectors
export function usePaginatedContracts() {
  const { state } = useContracts()
  const { filteredContracts, pagination } = state

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
  const endIndex = startIndex + pagination.itemsPerPage
  const paginatedContracts = filteredContracts.slice(startIndex, endIndex)

  return {
    contracts: paginatedContracts,
    pagination: {
      ...pagination,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, pagination.totalItems),
    },
  }
}
