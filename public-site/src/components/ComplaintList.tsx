import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ExternalLink,
  ChevronRight,
  LayoutGrid,
  List,
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ComplaintCase, ProductType, ComplaintStatus, SeverityLevel, RoleType } from '../types';

interface ComplaintListProps {
  complaints: ComplaintCase[];
  onSelectComplaint: (caseId: string) => void;
  onNavigateToTrace: (lotNumber: string) => void;
  onNavigateToAi: (caseId: string) => void;
  onNavigateTo8D: (caseId: string) => void;
  currentRole: RoleType;
}

export const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  onSelectComplaint,
  onNavigateToTrace,
  onNavigateToAi,
  onNavigateTo8D,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered complaints
  const filteredCases = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.anomalyType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProduct = selectedProductType === 'ALL' || c.productType === selectedProductType;
      const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
      const matchSeverity = selectedSeverity === 'ALL' || c.severity === selectedSeverity;

      return matchSearch && matchProduct && matchStatus && matchSeverity;
    });
  }, [complaints, searchTerm, selectedProductType, selectedStatus, selectedSeverity]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === '待處理').length;
    const investigating = complaints.filter((c) => c.status === '調查中').length;
    const correcting = complaints.filter((c) => c.status === '改善中').length;
    const verifying = complaints.filter((c) => c.status === '驗證中').length;
    const closed = complaints.filter((c) => c.status === '已結案').length;
    const critical = complaints.filter((c) => c.severity === 'Critical' && c.status !== '已結案').length;

    return { total, pending, investigating, correcting, verifying, closed, critical };
  }, [complaints]);

  return (
    <div className="space-y-5">
      {/* KPI Top Flow Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setSelectedStatus('ALL')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            selectedStatus === 'ALL'
              ? 'bg-slate-800 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-slate-400 block font-medium">客訴總收件數</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-extrabold text-white">{stats.total}</span>
            <span className="text-[10px] text-slate-500">件</span>
          </div>
        </button>

        <button
          onClick={() => setSelectedStatus('待處理')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            selectedStatus === '待處理'
              ? 'bg-slate-800 border-rose-500 shadow-md ring-1 ring-rose-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-rose-400 block font-medium flex items-center justify-between">
            <span>待處理 (新進)</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-extrabold text-rose-400">{stats.pending}</span>
            <span className="text-[10px] text-rose-500/80">件需審理</span>
          </div>
        </button>

        <button
          onClick={() => setSelectedStatus('調查中')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            selectedStatus === '調查中'
              ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-amber-400 block font-medium">調查分析中</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-extrabold text-amber-400">{stats.investigating}</span>
            <span className="text-[10px] text-amber-500/80">MES比對中</span>
          </div>
        </button>

        <button
          onClick={() => setSelectedStatus('改善中')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            selectedStatus === '改善中'
              ? 'bg-slate-800 border-blue-500 shadow-md ring-1 ring-blue-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-blue-400 block font-medium">改善對策中</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-extrabold text-blue-400">{stats.correcting}</span>
            <span className="text-[10px] text-blue-500/80">CAPA執行</span>
          </div>
        </button>

        <button
          onClick={() => setSelectedStatus('驗證中')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            selectedStatus === '驗證中'
              ? 'bg-slate-800 border-purple-500 shadow-md ring-1 ring-purple-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-purple-400 block font-medium">成效驗證中</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-extrabold text-purple-400">{stats.verifying}</span>
            <span className="text-[10px] text-purple-500/80">樣品測試</span>
          </div>
        </button>

        <button
          onClick={() => setSelectedStatus('已結案')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            selectedStatus === '已結案'
              ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-emerald-400 block font-medium">已完成結案</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-extrabold text-emerald-400">{stats.closed}</span>
            <span className="text-[10px] text-emerald-500/80">8D簽核完畢</span>
          </div>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜尋案件編號、客戶、批號、產品或異常..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Product Type Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto">
            {['ALL', '瓶蓋', '瓶胚', '標籤', '塑膠瓶'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedProductType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedProductType === type
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {type === 'ALL' ? '全部產品' : type}
              </button>
            ))}
          </div>

          {/* Severity & View Mode */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">全部嚴重度</option>
              <option value="Critical">Critical (重大停線)</option>
              <option value="Major">Major (主要瑕疵)</option>
              <option value="Minor">Minor (次要瑕疵)</option>
            </select>

            <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'} transition`}
                title="卡片檢視"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'} transition`}
                title="清單列表"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Content */}
      {filteredCases.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="font-semibold text-sm">查無符合條件的客訴案件</p>
          <p className="text-xs text-slate-500 mt-1">請嘗試調整搜尋關鍵字或篩選器。</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 shadow-lg transition flex flex-col justify-between group"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
                      {c.caseNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.severity === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : c.severity === 'Major'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c.severity}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === '待處理'
                        ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                        : c.status === '調查中'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                        : c.status === '改善中'
                        ? 'bg-blue-900/60 text-blue-300 border border-blue-700'
                        : c.status === '驗證中'
                        ? 'bg-purple-900/60 text-purple-300 border border-purple-700'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                {/* Client & Product */}
                <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-300 transition">
                  {c.clientName}
                </h3>
                <div className="text-xs text-slate-300 mt-0.5 flex items-center justify-between">
                  <span className="truncate">{c.productName}</span>
                  <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                    {c.productType}
                  </span>
                </div>

                {/* Lot Number & Anomaly */}
                <div className="mt-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">生產批號:</span>
                    <span className="font-mono text-cyan-300 font-bold">{c.lotNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">異常類型:</span>
                    <span className="text-rose-400 font-semibold">{c.anomalyType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">不良數量:</span>
                    <span className="text-slate-200 font-semibold">{c.defectQty.toLocaleString()} PCS</span>
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onNavigateToTrace(c.lotNumber)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition cursor-pointer"
                    title="查詢批次生產履歷"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigateToAi(c.id)}
                    className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded transition cursor-pointer"
                    title="AI 異常根本原因推論"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigateTo8D(c.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition cursor-pointer"
                    title="8D 改善報告"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onSelectComplaint(c.id)}
                  className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold bg-cyan-950/40 hover:bg-cyan-950 px-2.5 py-1.5 rounded-lg border border-cyan-800/50 transition cursor-pointer"
                >
                  <span>案件詳情</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">案件編號</th>
                  <th className="py-3 px-4">客戶名稱</th>
                  <th className="py-3 px-4">產品品名 / 類型</th>
                  <th className="py-3 px-4">生產批號</th>
                  <th className="py-3 px-4">異常類型</th>
                  <th className="py-3 px-4">不良數</th>
                  <th className="py-3 px-4">嚴重度</th>
                  <th className="py-3 px-4">狀態</th>
                  <th className="py-3 px-4">負責人</th>
                  <th className="py-3 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {c.caseNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {c.clientName}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-white truncate">{c.productName}</div>
                      <div className="text-[10px] text-slate-500">{c.productType}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300 whitespace-nowrap font-semibold">
                      {c.lotNumber}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-rose-400 font-medium">
                      {c.anomalyType}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {c.defectQty.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          c.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-300'
                            : c.severity === 'Major'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === '待處理'
                            ? 'bg-rose-900/60 text-rose-300'
                            : c.status === '調查中'
                            ? 'bg-amber-900/60 text-amber-300'
                            : c.status === '改善中'
                            ? 'bg-blue-900/60 text-blue-300'
                            : c.status === '驗證中'
                            ? 'bg-purple-900/60 text-purple-300'
                            : 'bg-emerald-900/60 text-emerald-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                      {c.owner}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectComplaint(c.id)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold text-xs hover:underline cursor-pointer"
                      >
                        檢視詳情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
