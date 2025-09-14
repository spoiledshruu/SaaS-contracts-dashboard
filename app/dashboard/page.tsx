"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ContractsTable } from "@/components/contracts-table"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contracts Dashboard</h1>
            <p className="text-muted-foreground">Manage and monitor your contract portfolio</p>
          </div>
          <ContractsTable />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
