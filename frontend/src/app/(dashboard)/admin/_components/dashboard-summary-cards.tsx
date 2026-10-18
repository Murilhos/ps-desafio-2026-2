'use client'

import { DashboardContainer } from '@/components/dashboard/dashboard-items'
import { useState } from 'react'

interface DashboardSummaryCardsProps {
  membersCount: number
  projectsCount: number
}

export function DashboardSummaryCards({
  membersCount,
  projectsCount,
}: DashboardSummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <DashboardContainer className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Membros registrados
        </p>
        <p className="text-3xl font-bold">{membersCount}</p>
      </DashboardContainer>

      <DashboardContainer className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Projetos registrados
        </p>
        <p className="text-3xl font-bold">{projectsCount}</p>
      </DashboardContainer>
    </section>
  )
}


