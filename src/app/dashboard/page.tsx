"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";

export default function DashboardPage() {
  return (
    <div className="bg-background h-full">
      <div className="min-h-screen bg-gray-100">
        <DashboardHeader />
        <div className="bg-background h-full">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="space-y-4">
                <DashboardTabs />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
