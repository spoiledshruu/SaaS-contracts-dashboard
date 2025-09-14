"use client"

import { useState, useEffect } from "react"
import { ContractsAPI, type Contract, type ContractDetail } from "@/services/api"

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ContractsAPI.getContracts()
      setContracts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contracts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  const refetch = () => {
    fetchContracts()
  }

  return { contracts, loading, error, refetch }
}

export function useContract(id: string) {
  const [contract, setContract] = useState<ContractDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ContractsAPI.getContract(id)
        setContract(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contract")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchContract()
    }
  }, [id])

  return { contract, loading, error }
}

export function useContractSearch() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchContracts = async (searchQuery?: string, status?: string, riskScore?: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await ContractsAPI.filterContracts(status, riskScore, searchQuery)
      setContracts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setLoading(false)
    }
  }

  return { contracts, loading, error, searchContracts }
}
