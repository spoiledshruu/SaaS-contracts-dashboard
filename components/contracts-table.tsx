"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, ChevronLeft, ChevronRight, Eye, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useContracts, usePaginatedContracts } from "@/context/contracts-context"
import type { Contract } from "@/services/api"

export function ContractsTable() {
  const { state, actions } = useContracts()
  const { contracts: paginatedContracts, pagination } = usePaginatedContracts()

  // Load contracts on mount
  useEffect(() => {
    actions.loadContracts()
  }, [])

  const getStatusBadgeVariant = (status: Contract["status"]) => {
    switch (status) {
      case "Active":
        return "default"
      case "Expired":
        return "destructive"
      case "Renewal Due":
        return "secondary"
      default:
        return "default"
    }
  }

  const getRiskBadgeVariant = (risk: Contract["riskScore"]) => {
    switch (risk) {
      case "Low":
        return "default"
      case "Medium":
        return "secondary"
      case "High":
        return "destructive"
      default:
        return "default"
    }
  }

  if (state.loading && state.contracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (state.error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive">{state.error}</p>
            <Button variant="outline" className="mt-4 bg-transparent" onClick={actions.loadContracts}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts</CardTitle>
        <CardDescription>
          Manage and monitor your contract portfolio ({state.filteredContracts.length} contracts)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts or parties..."
              value={state.filters.searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={state.filters.status} onValueChange={actions.setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Renewal Due">Renewal Due</SelectItem>
              </SelectContent>
            </Select>
            <Select value={state.filters.riskScore} onValueChange={actions.setRiskFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        {paginatedContracts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No contracts found</p>
            <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract Name</TableHead>
                    <TableHead>Parties</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {contract.parties.map((party, index) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              {party}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(contract.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(contract.status)}>{contract.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(contract.riskScore)}>{contract.riskScore}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/contracts/${contract.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {pagination.startIndex} to {pagination.endIndex} of {pagination.totalItems} contracts
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => actions.setCurrentPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => actions.setCurrentPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
