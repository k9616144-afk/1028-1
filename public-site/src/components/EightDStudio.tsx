import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Download, 
  CheckCircle2, 
  UserCheck, 
  Stamp, 
  Layers, 
  ShieldCheck, 
  Wrench, 
  History, 
  Loader2,
  Calendar,
  Building2,
  AlertCircle
} from 'lucide-react';
import { ComplaintCase, EightDReportData, RoleType } from '../types';
import { MOCK_MES_RECORDS } from '../data/mockData';

interface EightDStudioProps {
  complaints: ComplaintCase[];
  selectedCaseId?: string;
  currentRole: RoleType;
}

export const EightDStudio: React.FC<EightDStudioProps> = ({
  complaints,
  selectedCaseId,
  currentRole,
}) => {
  const [currentCaseId, setCurrentCaseId] = useState<string>(
    selectedCaseId || (complaints[0]?.id || '')
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<EightDReportData | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [signOffDate, setSignOffDate] = useState('2026-10-26');

  const currentCase = complaints.find((c) => c.id === currentCaseId) || complaints[0];
  const currentMes = currentCase ? MOCK_MES_RECORDS[currentCase.lotNumber] : null;

  // AI 8D Generator
  const handleGenerate8D = async () => {
    if (!currentCase) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/gemini/generate-8d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint: currentCase,
          mesTrace: currentMes,
          rootCauseData: currentCase.rootCause,
          capaActions: currentCase.capaActions,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setReportData(data.data);
      }
    } catch (err) {
      console.error('Failed to generate 8D report via AI:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // If initial case already has 8D, auto generate default on first view if empty
  React.useEffect(() => {
    if (!reportData && currentCase) {
      handleGenerate8D();
    }
  }, [currentCaseId]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8D-Report-${currentCase.caseNumber}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Case Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase block">
            AI 智慧品質報告工作室 (F07 8D 改善報告自動生成)
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <FileText className="w-5 h-5 text-purple-400" />
            標準 8D 異常矯正與預防報告工作台 (D1 ~ D8)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            整合客訴資訊、MES 生產履歷與 AI 根因推論，自動產生工業級標準 8D 報告初稿，支援在線審查與簽核
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={currentCaseId}
            onChange={(e) => {
              setCurrentCaseId(e.target.value);
              setReportData(null);
              setIsApproved(false);
            }}
            className="bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {complaints.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.clientName} ({c.anomalyType})
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate8D}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-lg shadow-purple-600/30 transition cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI 生成 8D 初稿中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>AI 一鍵產出 8D 初稿</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            title="列印報告 / 另存 PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportJson}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            title="匯出 JSON 結構資料"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 8D Document Container (Industrial Style) */}
      {reportData ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 max-w-5xl mx-auto">
          {/* Document Official Header */}
          <div className="border-b-2 border-slate-700 pb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 tracking-widest uppercase">
                  PLAS-QMS QUALITY ASSURANCE REPORT
                </span>
                <h1 className="text-xl font-extrabold text-white mt-1">
                  8D 異常矯正與預防措施報告 (8D Problem Solving Report)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  報告編號: <span className="font-mono text-cyan-300 font-bold">8D-{currentCase.caseNumber}</span> • 客訴案件編號: {currentCase.caseNumber}
                </p>
              </div>

              {/* Status & Approval Stamp */}
              <div className="flex items-center space-x-3">
                {isApproved ? (
                  <div className="border-2 border-emerald-500 rounded-xl p-2.5 bg-emerald-950/40 text-emerald-300 text-center flex items-center gap-2">
                    <Stamp className="w-6 h-6 text-emerald-400" />
                    <div className="text-left text-[11px]">
                      <span className="font-bold block uppercase tracking-wider">品保主管 已核准簽核</span>
                      <span className="text-[10px] text-emerald-400 font-mono">核准日期: {signOffDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="border border-amber-700 rounded-xl p-2.5 bg-amber-950/30 text-amber-300 text-center flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <div className="text-left text-[11px]">
                      <span className="font-bold block">8D 報告初稿 (待審核)</span>
                      <span className="text-[10px] text-amber-400">已由 AI 整合完成</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Meta Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 block">客戶名稱:</span>
                <span className="font-bold text-white">{currentCase.clientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">產品規格品名:</span>
                <span className="text-slate-200">{currentCase.productName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">生產履歷批號:</span>
                <span className="font-mono text-cyan-300 font-bold">{currentCase.lotNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">異常缺陷類型:</span>
                <span className="text-rose-400 font-bold">{currentCase.anomalyType} ({currentCase.severity})</span>
              </div>
            </div>
          </div>

          {/* D1: 成立小組 (Team) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2 border-b border-slate-700/60 pb-1.5">
              <span className="bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded text-xs">D1</span>
              成立改善小組 (Establish the Team)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">小組負責人 (Leader):</span>
                <span className="font-semibold text-white">{reportData.d1_team.leader}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">專案贊助主管 (Champion):</span>
                <span className="font-semibold text-slate-200">{reportData.d1_team.champion}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">跨部門核心成員 (Members):</span>
                <span className="text-slate-300">{reportData.d1_team.members?.join('、')}</span>
              </div>
            </div>
          </div>

          {/* D2: 問題描述 (Problem Description 5W2H) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2 border-b border-slate-700/60 pb-1.5">
              <span className="bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded text-xs">D2</span>
              問題描述 (Describe the Problem - 5W2H & Is / Is Not)
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">發生何種品質問題 (What):</span>
                <p className="text-slate-200 mt-0.5 leading-relaxed">{reportData.d2_problem.what}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] bg-slate-900/60 p-2.5 rounded-lg">
                <div>
                  <span className="text-slate-400">發現地點 (Where):</span>
                  <span className="text-slate-200 block">{reportData.d2_problem.where}</span>
                </div>
                <div>
                  <span className="text-slate-400">發生時間與批次 (When):</span>
                  <span className="text-slate-200 block">{reportData.d2_problem.when}</span>
                </div>
                <div>
                  <span className="text-slate-400">不良數量與範圍 (How Much):</span>
                  <span className="text-rose-400 font-bold block">{reportData.d2_problem.howMuch}</span>
                </div>
                <div>
                  <span className="text-slate-400">排除邊界 (Is Not):</span>
                  <span className="text-slate-300 block">{reportData.d2_problem.isNot}</span>
                </div>
              </div>
            </div>
          </div>

          {/* D3: 緊急圍堵對策 (Interim Containment Actions) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2 border-b border-slate-700/60 pb-1.5">
              <span className="bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded text-xs">D3</span>
              緊急圍堵對策 (Interim Containment Actions - ICA)
            </h3>
            <div className="space-y-2">
              {reportData.d3_containment.map((act, i) => (
                <div key={i} className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{act.action}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold">
                      {act.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>負責人: {act.owner}</span>
                    <span>完成期限: {act.dueDate}</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 mt-1 bg-cyan-950/30 p-1.5 rounded">
                    圍堵清查結果: {act.result}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D4: 根本原因分析 (Root Cause Analysis & 5-Whys) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2 border-b border-slate-700/60 pb-1.5">
              <span className="bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded text-xs">D4</span>
              根本原因分析 (Root Cause Analysis & Escape Point)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-rose-950/25 border border-rose-800/40 p-3 rounded-lg">
                <span className="font-bold text-rose-300 block mb-1">發生致因 (Occurrence Cause):</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">{reportData.d4_rootCause.occurrenceCause}</p>
              </div>
              <div className="bg-amber-950/25 border border-amber-800/40 p-3 rounded-lg">
                <span className="font-bold text-amber-300 block mb-1">流出逃逸原因 (Escape Point):</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">{reportData.d4_rootCause.escapeCause}</p>
              </div>
            </div>

            {/* 5-Whys */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-300 block mb-1.5 text-xs">五個為什麼深度探究 (5-Whys Analysis):</span>
              <div className="space-y-1.5">
                {reportData.d4_rootCause.fiveWhys?.map((why, idx) => (
                  <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">#{idx + 1}</span>
                    <span>{why}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* D5: 永久矯正措施 (Permanent Corrective Actions - PCA) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2 border-b border-slate-700/60 pb-1.5">
              <span className="bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded text-xs">D5</span>
              永久矯正措施 (Choose and Verify Permanent Corrective Actions)
            </h3>
            <div className="space-y-2">
              {reportData.d5_permanentActions?.map((pca, i) => (
                <div key={i} className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{pca.action}</span>
                    <span className="text-[11px] text-slate-400">期限: {pca.dueDate}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">負責人: {pca.owner}</div>
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-1.5 rounded">
                    驗證方法與標準: {pca.verificationMethod}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D6: 實施與驗證 (Implementation & Validation) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2 border-b border-slate-700/60 pb-1.5">
              <span className="bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded text-xs">D6</span>
              對策實施與成效驗證 (Implement and Validate Corrective Actions)
            </h3>
            <div className="bg-slate-900/60 p-3 rounded-lg space-y-1 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">現場實施紀錄:</span>
                <p className="text-slate-200 mt-0.5">{reportData.d6_implementation.executionStatus}</p>
              </div>
              <div className="pt-1.5 border-t border-slate-800">
                <span className="text-slate-400 font-semibold">量產批次驗證數據 (Validation Data):</span>
                <p className="text-emerald-300 font-semibold mt-0.5">{reportData.d6_implementation.validationData}</p>
              </div>
            </div>
          </div>

          {/* D7: 預防再發及標準化 (Prevent Recurrence & Standardization) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2 border-b border-slate-700/60 pb-1.5">
              <span className="bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded text-xs">D7</span>
              預防再發及標準化 (Prevent Recurrence & Standardization)
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg">
                <span className="text-slate-400 font-semibold block mb-1">修訂作業標準書 (SOP Updates):</span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                  {reportData.d7_prevention.sopUpdates?.map((sop, i) => (
                    <li key={i}>{sop}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg flex justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block">失效模式與效應分析 (PFMEA 更新):</span>
                  <span className="text-slate-300 text-[11px]">{reportData.d7_prevention.fmeaUpdate}</span>
                </div>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg">
                <span className="text-slate-400 font-semibold block">廠內同型機台/模具橫向展開 (Horizontal Deployment):</span>
                <span className="text-slate-300 text-[11px]">{reportData.d7_prevention.horizontalDeployment}</span>
              </div>
            </div>
          </div>

          {/* D8: 團隊肯定與審核結案 (Congratulate Team & Closure) */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2 border-b border-slate-700/60 pb-1.5">
              <span className="bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded text-xs">D8</span>
              專案小組肯定與結案簽核 (Congratulate the Team & Sign-Off)
            </h3>
            <p className="text-slate-300 text-xs italic bg-slate-900/60 p-2.5 rounded-lg">
              "{reportData.d8_closure.teamRecognition}"
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700">
              <div className="text-xs text-slate-400">
                核准審查人: <span className="text-white font-semibold">{reportData.d8_closure.approvedBy}</span>
              </div>

              {currentRole === '品保' || currentRole === '管理階層' ? (
                <button
                  onClick={() => setIsApproved(!isApproved)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer ${
                    isApproved
                      ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isApproved ? '撤銷簽核戳記' : '【品保主管】正式審核通過並核章'}</span>
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  (審核簽核權限僅限品保主管與管理階層)
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-purple-400 mx-auto animate-spin mb-2" />
          <p className="font-bold text-sm text-white">正在載入或產生 8D 報告...</p>
        </div>
      )}
    </div>
  );
};
