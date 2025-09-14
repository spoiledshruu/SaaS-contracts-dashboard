"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useContracts } from "@/hooks/use-contracts"
import { AlertTriangle, Calendar, FileText, DollarSign, Clock } from "lucide-react"

export default function InsightsPage() {
  const { contracts, loading } = useContracts()

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Insights</h1>
              <p className="text-muted-foreground">Contract analytics and insights</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  const totalContracts = contracts.length
  const activeContracts = contracts.filter((c) => c.status === "active").length
  const expiringSoon = contracts.filter((c) => {
    const expiryDate = new Date(c.expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate <= thirtyDaysFromNow && c.status === "active"
  }).length
  const highRiskContracts = contracts.filter((c) => c.riskLevel === "high").length

  const totalValue = contracts.reduce((sum, c) => sum + Number(c.value), 0)
  const avgValue = totalValue / totalContracts || 0

  const riskDistribution = {
    low: contracts.filter((c) => c.riskLevel === "low").length,
    medium: contracts.filter((c) => c.riskLevel === "medium").length,
    high: contracts.filter((c) => c.riskLevel === "high").length,
  }

  const statusDistribution = {
    active: contracts.filter((c) => c.status === "active").length,
    pending: contracts.filter((c) => c.status === "pending").length,
    expired: contracts.filter((c) => c.status === "expired").length,
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Insights</h1>
            <p className="text-muted-foreground">Contract analytics and insights</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalContracts}</div>
                <p className="text-xs text-muted-foreground">{activeContracts} active contracts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Avg: {Math.round(avgValue/10000)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{expiringSoon}</div>
                <p className="text-xs text-muted-foreground">Within 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{highRiskContracts}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Contract risk levels breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Low
                      </Badge>
                      <span className="text-sm">{riskDistribution.low} contracts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((riskDistribution.low / totalContracts) * 100)}%
                    </span>
                  </div>
                  <Progress value={(riskDistribution.low / totalContracts) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Medium
                      </Badge>
                      <span className="text-sm">{riskDistribution.medium} contracts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((riskDistribution.medium / totalContracts) * 100)}%
                    </span>
                  </div>
                  <Progress value={(riskDistribution.medium / totalContracts) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">High</Badge>
                      <span className="text-sm">{riskDistribution.high} contracts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((riskDistribution.high / totalContracts) * 100)}%
                    </span>
                  </div>
                  <Progress value={(riskDistribution.high / totalContracts) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
                <CardDescription>Current contract status breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <span className="text-sm">{statusDistribution.active} contracts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((statusDistribution.active / totalContracts) * 100)}%
                    </span>
                  </div>
                  <Progress value={(statusDistribution.active / totalContracts) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Pending</Badge>
                      <span className="text-sm">{statusDistribution.pending} contracts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((statusDistribution.pending / totalContracts) * 100)}%
                    </span>
                  </div>
                  <Progress value={(statusDistribution.pending / totalContracts) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        Expired
                      </Badge>
                      <span className="text-sm">{statusDistribution.expired} contracts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((statusDistribution.expired / totalContracts) * 100)}%
                    </span>
                  </div>
                  <Progress value={(statusDistribution.expired / totalContracts) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Renewals
              </CardTitle>
              <CardDescription>Contracts requiring attention in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {expiringSoon > 0 ? (
                <div className="space-y-4">
                  {contracts
                    .filter((c) => {
                      const expiryDate = new Date(c.expiryDate)
                      const thirtyDaysFromNow = new Date()
                      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                      return expiryDate <= thirtyDaysFromNow && c.status === "active"
                    })
                    .slice(0, 5)
                    .map((contract) => (
                      <div
                        key={contract.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{contract.title}</h4>
                          <p className="text-sm text-muted-foreground">{contract.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Expires: {new Date(contract.expiryDate).toLocaleDateString()}
                          </p>
                          <Badge variant={contract.riskLevel === "high" ? "destructive" : "secondary"}>
                            {contract.riskLevel} risk
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No contracts expiring in the next 30 days</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
