import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  User, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Layers, 
  Camera, 
  ShieldAlert,
  Send,
  History,
  Calendar
} from 'lucide-react';
import { ComplaintCase, ComplaintStatus, RoleType } from '../types';

interface ComplaintDetailModalProps {
  complaint: ComplaintCase | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (caseId: string, newStatus: ComplaintStatus, notes: string) => void;
  onNavigateToTrace: (lotNumber: string) => void;
  onNavigateToAi: (caseId: string) => void;
  onNavigateTo8D: (caseId: string) => void;
  currentRole: RoleType;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onUpdateStatus,
  onNavigateToTrace,
  onNavigateToAi,
  onNavigateTo8D,
  currentRole,
}) => {
  const [showStatusNoteModal, setShowStatusNoteModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('調查中');
  const [statusNote, setStatusNote] = useState('');

  if (!isOpen || !complaint) return null;

  const statuses: ComplaintStatus[] = ['待處理', '調查中', '改善中', '驗證中', '已結案'];

  const getStatusIndex = (st: ComplaintStatus) => statuses.indexOf(st);
  const currentIndex = getStatusIndex(complaint.status);

  const handleStatusChangeRequest = (st: ComplaintStatus) => {
    if (st === complaint.status) return;
    setTargetStatus(st);
    setStatusNote(`由 ${currentRole} 人員進行案件狀態推進至【${st}】`);
    setShowStatusNoteModal(true);
  };

  const confirmStatusChange = () => {
    onUpdateStatus(complaint.id, targetStatus, statusNote);
    setShowStatusNoteModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono font-bold text-sm bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-1 rounded">
              {complaint.caseNumber}
            </span>
            <h2 className="text-base font-bold text-white truncate max-w-md">
              {complaint.clientName} - {complaint.productName}
            </h2>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                complaint.severity === 'Critical'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : complaint.severity === 'Major'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {complaint.severity} 級
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Progress Timeline Stepper (F02) */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                客訴案件進度流程 (F02 狀態管制)
              </span>
              <span className="text-slate-400">
                預計結案期限: <span className="text-cyan-300 font-mono font-bold">{complaint.estimatedCloseDate}</span>
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 relative">
              {statuses.map((st, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChangeRequest(st)}
                    disabled={currentRole === '客戶'}
                    className={`py-2 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold ring-2 ring-cyan-500/30'
                        : isPassed
                        ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 font-semibold'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] mb-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-600" />
                      )}
                      <span>{st}</span>
                    </div>
                    <span className="text-[9px] text-slate-400">
                      {isCurrent ? '當前階段' : isPassed ? '已完成' : '點擊切換'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action Bar to sub-modules */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                onNavigateToTrace(complaint.lotNumber);
                onClose();
              }}
              className="flex items-center space-x-1.5 bg-blue-900/60 hover:bg-blue-800/60 text-blue-200 border border-blue-700/80 px-3 py-2 rounded-lg font-bold transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>追溯生產履歷批號 ({complaint.lotNumber})</span>
            </button>

            <button
              onClick={() => {
                onNavigateToAi(complaint.id);
                onClose();
              }}
              className="flex items-center space-x-1.5 bg-purple-900/60 hover:bg-purple-800/60 text-purple-200 border border-purple-700/80 px-3 py-2 rounded-lg font-bold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>AI 根本原因分析與歷史比對</span>
            </button>

            <button
              onClick={() => {
                onNavigateTo8D(complaint.id);
                onClose();
              }}
              className="flex items-center space-x-1.5 bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/80 px-3 py-2 rounded-lg font-bold transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>{complaint.has8D ? '檢視/編輯 8D 報告' : 'AI 建立 8D 改善報告'}</span>
            </button>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-2.5">
              <h3 className="font-bold text-white text-xs border-b border-slate-700 pb-1.5 flex items-center justify-between">
                <span>案件基本規格</span>
                <span className="text-[10px] text-cyan-400 font-mono">產品類型: {complaint.productType}</span>
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-slate-300">
                <div>
                  <span className="text-slate-500 block">客戶名稱:</span>
                  <span className="font-semibold text-white">{complaint.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">受理日期:</span>
                  <span>{complaint.complaintDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">產品名稱:</span>
                  <span className="text-white">{complaint.productName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">產品料號:</span>
                  <span className="font-mono">{complaint.productCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">生產批號:</span>
                  <span className="font-mono text-cyan-300 font-bold">{complaint.lotNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">異常不良數量:</span>
                  <span className="text-rose-400 font-bold">
                    {complaint.defectQty.toLocaleString()} PCS
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">主要負責人:</span>
                  <span className="text-slate-200">{complaint.owner}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">主責單位:</span>
                  <span className="text-slate-200">{complaint.department}</span>
                </div>
              </div>
            </div>

            {/* Anomaly Description & Sample Photos */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-2.5">
              <h3 className="font-bold text-white text-xs border-b border-slate-700 pb-1.5 flex items-center justify-between">
                <span>異常特徵描述與影像</span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded">
                  {complaint.anomalyType}
                </span>
              </h3>
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px]">
                {complaint.description}
              </p>

              {complaint.photos && complaint.photos.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">樣品不良照片:</span>
                  <div className="flex gap-2">
                    {complaint.photos.map((src, i) => (
                      <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
                        <img src={src} alt="Defect" className="w-full h-full object-cover hover:scale-110 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Root Cause & CAPA Summary */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                已研判根本原因與改善措施 (CAPA 執行追蹤)
              </span>
              <span className="text-[10px] text-slate-400">
                {complaint.capaActions.length} 項對策進行中
              </span>
            </h3>

            {complaint.rootCause ? (
              <div className="bg-amber-950/25 border border-amber-800/50 p-2.5 rounded-lg text-amber-200">
                <span className="font-bold block text-amber-300 mb-0.5">調查確認根本原因：</span>
                <p className="text-[11px] leading-relaxed">{complaint.rootCause}</p>
              </div>
            ) : (
              <div className="bg-slate-900/60 p-2.5 rounded-lg text-slate-400 text-center">
                尚未確認根本原因，請點擊「AI 根本原因分析」連動 MES 數據推論真因。
              </div>
            )}

            {complaint.capaActions.length > 0 && (
              <div className="space-y-2">
                {complaint.capaActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            action.type === '圍堵對策'
                              ? 'bg-rose-900/60 text-rose-300'
                              : action.type === '矯正措施'
                              ? 'bg-blue-900/60 text-blue-300'
                              : 'bg-emerald-900/60 text-emerald-300'
                          }`}
                        >
                          {action.type}
                        </span>
                        <span className="font-semibold text-white">{action.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{action.description}</p>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3">
                        <span>負責人: {action.owner}</span>
                        <span>期限: {action.dueDate}</span>
                        {action.verificationMethod && <span>驗證標準: {action.verificationMethod}</span>}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                        action.status === '已完成' || action.status === '已驗證'
                          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700'
                          : 'bg-amber-900/50 text-amber-300 border border-amber-700'
                      }`}
                    >
                      {action.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit Trail History (F02 & F12) */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 space-y-2.5">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              歷程履歷與操作軌跡 (Audit Trail)
            </h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {complaint.historyLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px] flex items-start justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-200">
                      [{log.role}] {log.operator} - {log.action}
                    </span>
                    {log.notes && <p className="text-slate-400 mt-0.5">{log.notes}</p>}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap ml-2">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
          >
            關閉檢視
          </button>
        </div>
      </div>

      {/* Status Update Confirmation Modal with Audit Note */}
      {showStatusNoteModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              確認變更案件狀態至【{targetStatus}】
            </h3>
            <p className="text-xs text-slate-300">
              系統將依規範記錄變更操作者 ({currentRole})、時間戳記與審核備註。
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                變更說明與階段處置摘要 <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowStatusNoteModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-xs text-white font-bold cursor-pointer"
              >
                確認並寫入履歷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
