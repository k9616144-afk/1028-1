import React, { useState } from 'react';
import { Header } from './components/Header';
import { ComplaintList } from './components/ComplaintList';
import { ComplaintModal } from './components/ComplaintModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { MesTraceability } from './components/MesTraceability';
import { AiAnalysisView } from './components/AiAnalysisView';
import { CapaManager } from './components/CapaManager';
import { EightDStudio } from './components/EightDStudio';
import { Dashboard } from './components/Dashboard';
import { SpcMonitor } from './components/SpcMonitor';
import { UserRoleMatrix } from './components/UserRoleMatrix';

import { 
  ComplaintCase, 
  ComplaintStatus, 
  RoleType, 
  CapaItem, 
  NotificationItem 
} from './types';
import { INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from './data/mockData';

export default function App() {
  const [complaints, setComplaints] = useState<ComplaintCase[]>(INITIAL_COMPLAINTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<string>('complaints');
  const [activeRole, setActiveRole] = useState<RoleType>('品保');

  // Modals & Active selections
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLotNumber, setSelectedLotNumber] = useState<string>('LOT-20261015-C02');

  // Open detail modal for specific case
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setIsDetailModalOpen(true);
  };

  // Add new complaint
  const handleSaveNewCase = (newCase: ComplaintCase) => {
    setComplaints([newCase, ...complaints]);

    // Push notification (F08)
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `【新客訴立案】${newCase.caseNumber} ${newCase.clientName}`,
      message: `${newCase.productType} 發生「${newCase.anomalyType}」異常，請相關單位啟動時效調查。`,
      type: newCase.severity === 'Critical' ? 'urgent' : 'info',
      timestamp: '剛剛',
      read: false,
      caseId: newCase.id,
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Update status workflow (F02)
  const handleUpdateStatus = (caseId: string, newStatus: ComplaintStatus, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          operator: activeRole === '業務' ? '郭慧琳' : activeRole === '品保' ? '陳建宏' : '操作人員',
          role: activeRole,
          action: `狀態變更：${c.status} → ${newStatus}`,
          notes,
        };
        return {
          ...c,
          status: newStatus,
          historyLogs: [newLog, ...c.historyLogs],
          closeDate: newStatus === '已結案' ? new Date().toISOString().split('T')[0] : c.closeDate,
        };
      })
    );

    // Add notification
    const updatedCase = complaints.find((c) => c.id === caseId);
    if (updatedCase) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `【進度更新】${updatedCase.caseNumber} 已推進至【${newStatus}】`,
          message: notes || `由 ${activeRole} 更新階段狀態`,
          type: newStatus === '已結案' ? 'success' : 'info',
          timestamp: '剛剛',
          read: false,
          caseId,
        },
        ...prev,
      ]);
    }
  };

  // Navigate to MES Traceability (F03)
  const handleNavigateToTrace = (lotNumber: string) => {
    setSelectedLotNumber(lotNumber);
    setActiveTab('traceability');
  };

  // Navigate to AI Analysis (F04, F05)
  const handleNavigateToAi = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('ai-analysis');
  };

  // Navigate to 8D Studio (F07)
  const handleNavigateTo8D = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('eight-d');
  };

  // Add CAPA item
  const handleAddCapaItem = (caseId: string, item: Omit<CapaItem, 'id'>) => {
    const newItem: CapaItem = {
      ...item,
      id: `capa-${Date.now()}`,
    };
    setComplaints((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, capaActions: [...c.capaActions, newItem] } : c))
    );
  };

  // Update CAPA status
  const handleUpdateCapaStatus = (
    caseId: string,
    capaId: string,
    status: CapaItem['status'],
    evidence?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          capaActions: c.capaActions.map((act) =>
            act.id === capaId
              ? {
                  ...act,
                  status,
                  verificationEvidence: evidence || act.verificationEvidence,
                  completedAt: new Date().toLocaleString(),
                }
              : act
          ),
        };
      })
    );
  };

  const currentSelectedComplaint = complaints.find((c) => c.id === selectedCaseId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-white">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        notifications={notifications}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onSelectCase={handleSelectCase}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'complaints' && (
          <ComplaintList
            complaints={complaints}
            onSelectComplaint={handleSelectCase}
            onNavigateToTrace={handleNavigateToTrace}
            onNavigateToAi={handleNavigateToAi}
            onNavigateTo8D={handleNavigateTo8D}
            currentRole={activeRole}
          />
        )}

        {activeTab === 'traceability' && (
          <MesTraceability
            currentLotNumber={selectedLotNumber}
            onLaunchAiAnalysis={(lot) => {
              const matchedCase = complaints.find((c) => c.lotNumber === lot);
              if (matchedCase) setSelectedCaseId(matchedCase.id);
              setActiveTab('ai-analysis');
            }}
          />
        )}

        {activeTab === 'ai-analysis' && (
          <AiAnalysisView
            complaints={complaints}
            selectedCaseId={selectedCaseId || undefined}
            onApplyCapa={(cId, title, desc) => {
              handleAddCapaItem(cId, {
                type: '矯正措施',
                title,
                description: desc,
                owner: '陳建宏 (品保課長)',
                department: '品保部',
                dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
                status: '進行中',
                verificationMethod: '現場抽樣複驗與成型尺寸能力驗證',
              });
            }}
            onNavigateTo8D={handleNavigateTo8D}
          />
        )}

        {activeTab === 'capa' && (
          <CapaManager
            complaints={complaints}
            onAddCapaItem={handleAddCapaItem}
            onUpdateCapaStatus={handleUpdateCapaStatus}
            currentRole={activeRole}
          />
        )}

        {activeTab === 'eight-d' && (
          <EightDStudio
            complaints={complaints}
            selectedCaseId={selectedCaseId || undefined}
            currentRole={activeRole}
          />
        )}

        {activeTab === 'dashboard' && <Dashboard complaints={complaints} />}

        {activeTab === 'spc-monitor' && <SpcMonitor />}

        {activeTab === 'roles-matrix' && (
          <UserRoleMatrix
            currentRole={activeRole}
            onSelectRole={(r) => setActiveRole(r)}
          />
        )}
      </main>

      {/* Global Modals */}
      <ComplaintModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewCase}
        currentRole={activeRole}
      />

      <ComplaintDetailModal
        complaint={currentSelectedComplaint}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onNavigateToTrace={handleNavigateToTrace}
        onNavigateToAi={handleNavigateToAi}
        onNavigateTo8D={handleNavigateTo8D}
        currentRole={activeRole}
      />

      {/* System Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PLAS-QMS 塑膠包材品質客訴智慧分析與改善管理系統 • 工業 4.0 智慧品質平台</span>
          <span className="text-[11px] text-slate-600">
            適用產品：瓶蓋 (Caps)、瓶胚 (Preforms)、標籤 (Labels)、塑膠瓶 (Plastic Bottles)
          </span>
        </div>
      </footer>
    </div>
  );
}
