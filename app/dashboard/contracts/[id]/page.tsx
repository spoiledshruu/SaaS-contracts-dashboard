"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ContractDetails } from "@/components/contract-details"

export default function ContractDetailPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ContractDetails />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
