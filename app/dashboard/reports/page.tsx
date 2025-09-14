"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContracts } from "@/hooks/use-contracts"
import { useState } from "react"
import { Download, FileText, Calendar, Filter, Search } from "lucide-react"

export default function ReportsPage() {
  const { contracts, loading } = useContracts()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<string>("all")
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredContracts = contracts.filter((contract) => {
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    const matchesRisk = riskFilter === "all" || contract.riskLevel === riskFilter
    const matchesSearch =
      searchTerm === "" ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesDate = true
    if (dateRange !== "all") {
      const contractDate = new Date(contract.signedDate)
      const now = new Date()

      switch (dateRange) {
        case "30days":
          matchesDate = now.getTime() - contractDate.getTime() <= 30 * 24 * 60 * 60 * 1000
          break
        case "90days":
          matchesDate = now.getTime() - contractDate.getTime() <= 90 * 24 * 60 * 60 * 1000
          break
        case "1year":
          matchesDate = now.getTime() - contractDate.getTime() <= 365 * 24 * 60 * 60 * 1000
          break
      }
    }

    return matchesStatus && matchesRisk && matchesSearch && matchesDate
  })

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create mock CSV content
    const csvContent = [
      "Contract ID,Title,Client,Status,Risk Level,Value,Signed Date,Expiry Date",
      ...filteredContracts.map(
        (contract) =>
          `${contract.id},"${contract.title}","${contract.client}",${contract.status},${contract.riskLevel},$${contract.value},${contract.signedDate},${contract.expiryDate}`,
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contracts-${reportType}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    setIsGenerating(false)
  }

  const reportTypes = [
    {
      id: "summary",
      title: "Contract Summary Report",
      description: "Overview of all contracts with key metrics and status information",
      icon: FileText,
    },
    {
      id: "risk",
      title: "Risk Analysis Report",
      description: "Detailed risk assessment and compliance analysis for all contracts",
      icon: FileText,
    },
    {
      id: "financial",
      title: "Financial Report",
      description: "Contract values, payments, and financial performance metrics",
      icon: FileText,
    },
    {
      id: "expiry",
      title: "Expiry & Renewal Report",
      description: "Upcoming contract expirations and renewal opportunities",
      icon: Calendar,
    },
  ]

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground">Generate and view contract reports</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full mt-2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Generate and view contract reports</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Report Filters
              </CardTitle>
              <CardDescription>Customize your report data with filters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search contracts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{filteredContracts.length} contracts</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {reportTypes.map((report) => {
              const Icon = report.icon
              return (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {report.title}
                    </CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        This report will include {filteredContracts.length} contracts based on your current filters.
                      </div>
                      <Button
                        onClick={() => handleGenerateReport(report.id)}
                        disabled={isGenerating || filteredContracts.length === 0}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isGenerating ? "Generating..." : "Generate & Download"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Contract Summary Report", date: "2024-01-15", size: "2.3 MB", type: "summary" },
                  { name: "Risk Analysis Report", date: "2024-01-10", size: "1.8 MB", type: "risk" },
                  { name: "Financial Report", date: "2024-01-05", size: "3.1 MB", type: "financial" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Generated on {new Date(report.date).toLocaleDateString()} • {report.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
