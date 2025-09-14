// Mock API service to simulate backend calls

export interface Contract {
  id: string
  name: string
  parties: string[]
  expiryDate: string
  startDate: string
  status: "Active" | "Expired" | "Renewal Due"
  riskScore: "Low" | "Medium" | "High"
  value: string
  type: string
}

export interface ContractDetail extends Contract {
  clauses: Clause[]
  insights: Insight[]
  evidence: Evidence[]
}

export interface Clause {
  id: string
  title: string
  summary: string
  confidenceScore: number
  type: "Standard" | "Custom" | "Risk"
}

export interface Insight {
  id: string
  type: "Risk" | "Recommendation" | "Opportunity"
  severity: "Low" | "Medium" | "High"
  title: string
  description: string
}

export interface Evidence {
  id: string
  source: string
  snippet: string
  relevanceScore: number
  page?: number
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class ContractsAPI {
  static async getContracts(): Promise<Contract[]> {
    await delay(800) // Simulate network delay

    try {
      const response = await fetch("/contracts.json")
      if (!response.ok) {
        throw new Error("Failed to fetch contracts")
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching contracts:", error)
      throw new Error("Failed to load contracts")
    }
  }

  static async getContract(id: string): Promise<ContractDetail> {
    await delay(600) // Simulate network delay

    try {
      const response = await fetch(`/contracts/${id}.json`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Contract not found")
        }
        throw new Error("Failed to fetch contract details")
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching contract details:", error)
      if (error instanceof Error && error.message === "Contract not found") {
        throw error
      }
      throw new Error("Failed to load contract details")
    }
  }

  static async uploadContract(file: File): Promise<{ success: boolean; contractId?: string; error?: string }> {
    await delay(2000 + Math.random() * 3000) // Simulate upload time

    // Simulate random success/failure
    const success = Math.random() > 0.2 // 80% success rate

    if (success) {
      return {
        success: true,
        contractId: Math.random().toString(36).substr(2, 9),
      }
    } else {
      return {
        success: false,
        error: "Upload failed. Please try again.",
      }
    }
  }

  static async searchContracts(query: string): Promise<Contract[]> {
    await delay(400) // Simulate search delay

    const contracts = await this.getContracts()

    if (!query.trim()) {
      return contracts
    }

    const lowercaseQuery = query.toLowerCase()
    return contracts.filter(
      (contract) =>
        contract.name.toLowerCase().includes(lowercaseQuery) ||
        contract.parties.some((party) => party.toLowerCase().includes(lowercaseQuery)) ||
        contract.type.toLowerCase().includes(lowercaseQuery),
    )
  }

  static async filterContracts(status?: string, riskScore?: string, searchQuery?: string): Promise<Contract[]> {
    await delay(300) // Simulate filter delay

    let contracts = await this.getContracts()

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      contracts = await this.searchContracts(searchQuery)
    }

    // Apply status filter
    if (status && status !== "all") {
      contracts = contracts.filter((contract) => contract.status === status)
    }

    // Apply risk filter
    if (riskScore && riskScore !== "all") {
      contracts = contracts.filter((contract) => contract.riskScore === riskScore)
    }

    return contracts
  }
}
