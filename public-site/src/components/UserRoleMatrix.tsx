import React from 'react';
import { Shield, Check, X, Users, Lock, Unlock, AlertCircle } from 'lucide-react';
import { RoleType } from '../types';

interface UserRoleMatrixProps {
  currentRole: RoleType;
  onSelectRole: (role: RoleType) => void;
}

export const UserRoleMatrix: React.FC<UserRoleMatrixProps> = ({
  currentRole,
  onSelectRole,
}) => {
  const roles: { role: RoleType; title: string; desc: string; color: string }[] = [
    {
      role: '品保',
      title: '品保主管 / 品保工程師 (QA/QC)',
      desc: '品質核心主責：案件受理、判定嚴重度、調用 AI 根因推論、主持 CAPA、8D 報告審核核章與結案。',
      color: 'border-cyan-500 text-cyan-400 bg-cyan-950/40',
    },
    {
      role: '業務',
      title: '營業部 / 客服業務代表 (Sales)',
      desc: '客戶窗口：受理客訴登錄、上傳照片、追蹤 24hr 初步回覆、回覆客戶進度與傳達 8D 報告。',
      color: 'border-blue-500 text-blue-400 bg-blue-950/40',
    },
    {
      role: '生產',
      title: '射出 / 吹瓶 / 印刷加工課 (Production)',
      desc: '產線落實：檢視批次履歷、疑慮模穴檢驗、執行緊急庫存隔離與現場改善措施回報。',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
    },
    {
      role: '工程',
      title: '模具工程 / 設備製程部 (Engineering)',
      desc: '工程根因：模具水路檢修、流量調校、CNC倒角修復、SPC 參數界限校正與製程驗證。',
      color: 'border-amber-500 text-amber-400 bg-amber-950/40',
    },
    {
      role: '管理階層',
      title: '廠長 / 營運副總 / 品保協理 (Management)',
      desc: '戰情決策：品質 KPI 儀表板、重大客訴時效監控、品質損失額審核、跨部門資源協調與終審簽准。',
      color: 'border-purple-500 text-purple-400 bg-purple-950/40',
    },
    {
      role: '客戶',
      title: '客戶品質代表 (Client External View)',
      desc: '外部透明：檢視客訴案件處理即時階段、在線檢視與下載 8D 改善報告、確認改善成效。',
      color: 'border-slate-500 text-slate-400 bg-slate-900',
    },
  ];

  const permissions = [
    { name: '客訴案件立案與上傳樣品 (F01)', roles: ['業務', '品保', '管理階層'] },
    { name: '案件狀態推進與時效備註 (F02)', roles: ['品保', '業務', '生產', '工程', '管理階層'] },
    { name: 'MES 生產履歷與模穴熱點追溯 (F03)', roles: ['品保', '生產', '工程', '管理階層'] },
    { name: 'AI 根本原因分析與事實/假設區分 (F04)', roles: ['品保', '工程', '管理階層'] },
    { name: 'AI 歷史相似客訴案例比對與引用 (F05)', roles: ['品保', '生產', '工程'] },
    { name: '改善對策制定、排程與執行回報 (F06)', roles: ['品保', '生產', '工程'] },
    { name: 'AI 自動生成 8D 報告初稿與在線編輯 (F07)', roles: ['品保', '工程'] },
    { name: '8D 報告正式核准簽核戳記 (F07)', roles: ['品保', '管理階層'] },
    { name: '品質管理戰情儀表板與趨勢損益 (F09, F10)', roles: ['品保', '管理階層'] },
    { name: '製程異常預警與 SPC 參數調控 (F11)', roles: ['生產', '工程', '品保'] },
    { name: '客訴進度透明查閱與 8D 報告下載', roles: ['業務', '品保', '生產', '工程', '管理階層', '客戶'] },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block">
            帳號及權限控制 (F12 使用者權限管理)
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <Lock className="w-5 h-5 text-cyan-400" />
            部門角色功能矩陣與操作審核權限
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            依品保、業務、生產、工程、管理階層及客戶設定細緻的資料查詢、案件編輯、報告審核與操作權限
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">目前作用角色:</span>
          <span className="font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-3 py-1 rounded-lg">
            {currentRole}
          </span>
        </div>
      </div>

      {/* Role Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((item) => {
          const isSelected = currentRole === item.role;
          return (
            <div
              key={item.role}
              onClick={() => onSelectRole(item.role)}
              className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                isSelected ? item.color + ' ring-2 ring-cyan-500/50' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm text-white">{item.role}</span>
                  {isSelected ? (
                    <span className="text-[10px] font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full">
                      當前身分
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">點擊切換 ➔</span>
                  )}
                </div>
                <h4 className="text-xs font-semibold text-slate-300 mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-xs flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            六大角色權限比對對照表
          </h3>
          <span className="text-[10px] text-slate-500">落實 ISO 9001 / IATF 16949 品質管制審查權責</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">功能模組項目</th>
                <th className="py-3 px-3 text-center">品保 (QA)</th>
                <th className="py-3 px-3 text-center">業務 (Sales)</th>
                <th className="py-3 px-3 text-center">生產 (Prod)</th>
                <th className="py-3 px-3 text-center">工程 (Eng)</th>
                <th className="py-3 px-3 text-center">管理階層 (Mgmt)</th>
                <th className="py-3 px-3 text-center">客戶 (Client)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {permissions.map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-4 font-medium text-white">{perm.name}</td>
                  {(['品保', '業務', '生產', '工程', '管理階層', '客戶'] as RoleType[]).map((r) => {
                    const hasAccess = perm.roles.includes(r);
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        {hasAccess ? (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-800/60 text-slate-600">
                            <X className="w-3 h-3" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
