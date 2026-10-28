import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  Filter,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ComplaintCase, CapaItem, RoleType } from '../types';

interface CapaManagerProps {
  complaints: ComplaintCase[];
  onAddCapaItem: (caseId: string, item: Omit<CapaItem, 'id'>) => void;
  onUpdateCapaStatus: (caseId: string, capaId: string, status: CapaItem['status'], evidence?: string) => void;
  currentRole: RoleType;
}

export const CapaManager: React.FC<CapaManagerProps> = ({
  complaints,
  onAddCapaItem,
  onUpdateCapaStatus,
  currentRole,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Capa Form
  const [targetCaseId, setTargetCaseId] = useState<string>(complaints[0]?.id || '');
  const [newType, setNewType] = useState<CapaItem['type']>('矯正措施');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOwner, setNewOwner] = useState('陳建宏 (品保課長)');
  const [newDepartment, setNewDepartment] = useState('品保部');
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [newVerificationMethod, setNewVerificationMethod] = useState('');

  // Evidence update modal
  const [evidenceModal, setEvidenceModal] = useState<{
    caseId: string;
    capaId: string;
    targetStatus: CapaItem['status'];
  } | null>(null);
  const [evidenceText, setEvidenceText] = useState('');

  // Extract all CAPAs
  const allCapas = complaints.flatMap((c) =>
    c.capaActions.map((capa) => ({
      ...capa,
      caseId: c.id,
      caseNumber: c.caseNumber,
      clientName: c.clientName,
      productName: c.productName,
    }))
  );

  const filteredCapas = allCapas.filter((item) => {
    const matchCase = selectedCaseId === 'ALL' || item.caseId === selectedCaseId;
    const matchType = selectedType === 'ALL' || item.type === selectedType;
    return matchCase && matchType;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !targetCaseId) return;

    onAddCapaItem(targetCaseId, {
      type: newType,
      title: newTitle,
      description: newDescription,
      owner: newOwner,
      department: newDepartment,
      dueDate: newDueDate,
      status: '進行中',
      verificationMethod: newVerificationMethod,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewVerificationMethod('');
  };

  const handleConfirmEvidence = () => {
    if (!evidenceModal) return;
    onUpdateCapaStatus(evidenceModal.caseId, evidenceModal.capaId, evidenceModal.targetStatus, evidenceText);
    setEvidenceModal(null);
    setEvidenceText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase block">
            矯正與預防措施 (F06 CAPA 管理)
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            改善對策執行進度與成效驗證管制
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            落實圍堵、根本矯正與預防再發三階段對策，確保權責到人、時效可稽、驗證有據
          </p>
        </div>

        {currentRole !== '客戶' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新增改善措施</span>
          </button>
        )}
      </div>

      {/* Filter Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-slate-400 font-medium">篩選客訴案件:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">全部案件 ({allCapas.length} 項對策)</option>
            {complaints.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.clientName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1">
          {['ALL', '圍堵對策', '矯正措施', '預防措施'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedType === t
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t === 'ALL' ? '全部類型' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Capa List */}
      <div className="space-y-3">
        {filteredCapas.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            查無相關改善措施，請點擊上方按鈕新增。
          </div>
        ) : (
          filteredCapas.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-lg transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.type === '圍堵對策'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : item.type === '矯正措施'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">
                    {item.caseNumber}
                  </span>
                  <span className="text-xs text-slate-400">({item.clientName})</span>
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-1">{item.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pl-1 pt-0.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    主責人: <span className="text-slate-200">{item.owner} ({item.department})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    期限: <span className="font-mono text-cyan-300">{item.dueDate}</span>
                  </span>
                  {item.verificationMethod && (
                    <span className="text-slate-400">
                      驗證方式: <span className="text-emerald-300">{item.verificationMethod}</span>
                    </span>
                  )}
                </div>

                {item.verificationEvidence && (
                  <div className="mt-1 bg-emerald-950/30 border border-emerald-800/40 p-2 rounded-lg text-[11px] text-emerald-200">
                    <span className="font-semibold text-emerald-300">執行驗證結果：</span>
                    {item.verificationEvidence}
                  </div>
                )}
              </div>

              {/* Status & Update Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    item.status === '已驗證'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : item.status === '已完成'
                      ? 'bg-blue-950 text-blue-300 border border-blue-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}
                >
                  {item.status}
                </span>

                {currentRole !== '客戶' && item.status !== '已驗證' && (
                  <button
                    onClick={() => {
                      const nextSt = item.status === '進行中' ? '已完成' : '已驗證';
                      setEvidenceModal({
                        caseId: item.caseId,
                        capaId: item.id,
                        targetStatus: nextSt,
                      });
                      setEvidenceText(
                        nextSt === '已驗證'
                          ? '連續抽測 3 個量產批次尺寸合格率 100%，Cpk = 1.48。'
                          : '現場管路酸洗完畢，流量恢復 12.5 L/min。'
                      );
                    }}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-slate-700 px-2.5 py-1 rounded transition cursor-pointer"
                  >
                    更新執行紀錄 ➔
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Capa Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              新增改善對策 (CAPA)
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">所屬客訴案件</label>
                <select
                  value={targetCaseId}
                  onChange={(e) => setTargetCaseId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {complaints.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.clientName} ({c.productName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">對策類型</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CapaItem['type'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="圍堵對策">圍堵對策 (D3)</option>
                    <option value="矯正措施">矯正措施 (D5)</option>
                    <option value="預防措施">預防措施 (D7)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">預計完成期限</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">對策主旨</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 模具第12穴冷卻管路酸洗除垢"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">對策執行詳細內容</label>
                <textarea
                  rows={2}
                  required
                  placeholder="具體作業步驟、設備變更或標準書修訂細節..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">主責人員</label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">主責部門</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">驗證方式與判定標準</label>
                <input
                  type="text"
                  placeholder="例如: 流量計通水測試每穴流速，確保流速偏差 < 5%"
                  value={newVerificationMethod}
                  onChange={(e) => setNewVerificationMethod(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  儲存並排定追蹤
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evidence recording modal */}
      {evidenceModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              填寫對策執行與成效驗證數據 (變更至【{evidenceModal.targetStatus}】)
            </h3>
            <textarea
              rows={3}
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              placeholder="請填寫量測數據、檢驗報告編號或現場改善照片佐證..."
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEvidenceModal(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmEvidence}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                確認並更新狀態
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
