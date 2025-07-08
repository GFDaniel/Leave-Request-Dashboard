"use client"

import { LeaveRequestDashboard } from "../components/LeaveRequestDashboard"
import { LeaveRequestService } from "../services/leave-request.service"

const leaveRequestService = new LeaveRequestService()

export default function Home() {
  return (
    <main>
      <LeaveRequestDashboard service={leaveRequestService} />
    </main>
  )
}
