import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  PlusCircle, 
  Users, 
  Layers, 
  Cpu, 
  BarChart3, 
  FileText, 
  AlertTriangle,
  History,
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { RoleType, NotificationItem } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  notifications: NotificationItem[];
  onOpenCreateModal: () => void;
  onSelectCase: (caseId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  notifications,
  onOpenCreateModal,
  onSelectCase,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: RoleType[] = ['品保', '業務', '生產', '工程', '管理階層', '客戶'];

  const navItems = [
    { id: 'complaints', label: '客訴案件管理', icon: Layers, badge: null },
    { id: 'traceability', label: '批次履歷追溯', icon: History, badge: 'MES' },
    { id: 'ai-analysis', label: 'AI 異常分析', icon: Cpu, badge: 'AI' },
    { id: 'capa', label: '改善對策 CAPA', icon: CheckCircle2, badge: null },
    { id: 'eight-d', label: '8D 報告工作室', icon: FileText, badge: 'AI' },
    { id: 'dashboard', label: '品質 KPI 儀表板', icon: BarChart3, badge: null },
    { id: 'spc-monitor', label: '製程預警 SPC', icon: AlertTriangle, badge: '即時' },
    { id: 'roles-matrix', label: '權限矩陣', icon: Users, badge: null },
  ];

  const roleDescriptions: Record<RoleType, string> = {
    '品保': '全權限：異常判定、AI 根因分析、8D 審核結案',
    '業務': '案件立案、客戶時效追蹤、初步回覆進度',
    '生產': '機台參數比對、疑慮模穴檢核、改善執行回報',
    '工程': '模具維護、SPC 偏位調校、永久對策驗證',
    '管理階層': '品質 KPI 決策、客訴趨勢損失監控、跨部門協調',
    '客戶': '外部透明進度檢視、8D 報告下載與線上確認',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  PLAS-QMS 塑膠包材品質客訴智慧分析系統
                </span>
                <span className="text-[11px] font-semibold bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50">
                  瓶蓋 • 瓶胚 • 標籤 • 塑膠瓶
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                生產履歷整合 • AI 異常根因推論 • 相似案例比對 • 自動生成 8D 報告
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Role Switcher */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/60">
              <span className="text-xs text-slate-400 px-2 font-medium flex items-center gap-1">
                <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                角色身分:
              </span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as RoleType)}
                className="bg-slate-900 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                title={roleDescriptions[activeRole]}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r} {r === '品保' ? '(主責管理)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Create Button (Available to Sales, QA, Management) */}
            {activeRole !== '客戶' && (
              <button
                onClick={onOpenCreateModal}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-md shadow-cyan-600/20 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>受理新客訴</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700"
                title="時效與預警通知"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      時效管理與製程預警
                    </span>
                    <span className="text-xs text-slate-400">
                      {notifications.length} 則通知
                    </span>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.caseId) {
                            onSelectCase(item.caseId);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          item.type === 'urgent'
                            ? 'bg-rose-950/40 border-rose-800/60 hover:bg-rose-900/40'
                            : item.type === 'warning'
                            ? 'bg-amber-950/40 border-amber-800/60 hover:bg-amber-900/40'
                            : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
                          <span className={item.type === 'urgent' ? 'text-rose-400' : item.type === 'warning' ? 'text-amber-400' : 'text-cyan-400'}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{item.message}</p>
                        {item.caseId && (
                          <div className="mt-1 text-[11px] text-cyan-400 font-medium hover:underline">
                            點擊查看關聯案件 ➔
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      tab.badge === 'AI'
                        ? 'bg-purple-900/60 text-purple-300 border border-purple-700/60'
                        : tab.badge === '即時'
                        ? 'bg-rose-900/60 text-rose-300 border border-rose-700/60 animate-pulse'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
