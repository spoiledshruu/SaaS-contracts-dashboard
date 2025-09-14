"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ArrowLeft, AlertTriangle, CheckCircle, FileText, Eye, Calendar, Users } from "lucide-react"
import { useContracts } from "@/context/contracts-context"
import type { ContractDetail, Clause, Insight } from "@/services/api"

export function ContractDetails() {
  const params = useParams()
  const router = useRouter()
  const { state, actions } = useContracts()
  const contractId = params.id as string

  useEffect(() => {
    if (contractId) {
      actions.loadContract(contractId)
    }
  }, [contractId])

  const contract = state.selectedContract

  const getStatusBadgeVariant = (status: ContractDetail["status"]) => {
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

  const getRiskBadgeVariant = (risk: ContractDetail["riskScore"]) => {
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

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "Risk":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "Recommendation":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "Opportunity":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getClauseTypeColor = (type: Clause["type"]) => {
    switch (type) {
      case "Standard":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Custom":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Risk":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.error || !contract) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive">{state.error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{contract.name}</h1>
          <p className="text-muted-foreground">Contract Details</p>
        </div>
      </div>

      {/* Contract Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contract Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={getStatusBadgeVariant(contract.status)}>{contract.status}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Risk Score</label>
              <div className="mt-1">
                <Badge variant={getRiskBadgeVariant(contract.riskScore)}>{contract.riskScore}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contract Value</label>
              <p className="mt-1 text-lg font-semibold">{contract.value}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="mt-1">{contract.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Start Date</label>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(contract.startDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(contract.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Parties</label>
              <div className="mt-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{contract.parties.join(", ")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clauses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contract Clauses</CardTitle>
              <CardDescription>Key clauses and their analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contract.clauses.map((clause) => (
                  <div key={clause.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{clause.title}</h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getClauseTypeColor(clause.type)}`}
                        >
                          {clause.type}
                        </span>
                        <span className="text-sm text-muted-foreground">{clause.confidenceScore}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{clause.summary}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
              <CardDescription>Risks and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contract.insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-2">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-sm">{insight.title}</h5>
                          <Badge
                            variant={
                              insight.severity === "High"
                                ? "destructive"
                                : insight.severity === "Medium"
                                  ? "secondary"
                                  : "default"
                            }
                            className="text-xs"
                          >
                            {insight.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evidence Panel */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
              <CardDescription>Supporting documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contract.evidence.map((evidence) => (
                  <Sheet key={evidence.id}>
                    <SheetTrigger asChild>
                      <div className="border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-sm">{evidence.source}</h5>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{evidence.relevanceScore}%</span>
                            <Eye className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{evidence.snippet}</p>
                        {evidence.page && <p className="text-xs text-muted-foreground mt-1">Page {evidence.page}</p>}
                      </div>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{evidence.source}</SheetTitle>
                        <SheetDescription>Relevance Score: {evidence.relevanceScore}%</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm">{evidence.snippet}</p>
                        </div>
                        {evidence.page && (
                          <p className="text-sm text-muted-foreground mt-4">Found on page {evidence.page}</p>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
