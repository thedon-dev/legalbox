"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DocumentsSection } from "@/components/dashboard/documents-section";
import { SharedSection } from "@/components/dashboard/shared-section";
import { AuditSection } from "@/components/dashboard/audit-section";
import { SettingsSection } from "@/components/dashboard/settings-section";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("documents");

  return (
    <ProtectedRoute requireWallet>
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === "documents" && <DocumentsSection />}
        {activeTab === "shared" && <SharedSection />}
        {activeTab === "audit" && <AuditSection />}
        {activeTab === "settings" && <SettingsSection />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
