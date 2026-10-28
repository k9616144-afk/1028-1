import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  FileText, 
  AlertTriangle,
  FlaskConical,
  Wrench,
  Loader2,
  Copy,
  ChevronDown,
  Info
} from 'lucide-react';
import { ComplaintCase, HistoricalCase, MesTraceRecord } from '../types';
import { MOCK_MES_RECORDS, HISTORICAL_CASES } from '../data/mockData';

interface AiAnalysisViewProps {
  complaints: ComplaintCase[];
  selectedCaseId?: string;
  onApplyCapa: (caseId: string, capaActionTitle: string, description: string) => void;
  onNavigateTo8D: (caseId: string) => void;
}

export const AiAnalysisView: React.FC<AiAnalysisViewProps> = ({
  complaints,
  selectedCaseId,
  onApplyCapa,
  onNavigateTo8D,
}) => {
  const [currentCaseId, setCurrentCaseId] = useState<string>(
    selectedCaseId || (complaints[0]?.id || '')
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isMatchingSimilar, setIsMatchingSimilar] = useState(false);
  const [similarMatches, setSimilarMatches] = useState<any[]>([]);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const currentCase = complaints.find((c) => c.id === currentCaseId) || complaints[0];
  const currentMes = currentCase ? MOCK_MES_RECORDS[currentCase.lotNumber] : null;

  // Run AI Root Cause Analysis
  const handleRunAiAnalysis = async () => {
    if (!currentCase) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/gemini/analyze-root-cause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint: currentCase,
          mesTrace: currentMes,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);
      }
    } catch (err) {
      console.error('Failed to run AI root cause analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run AI Semantic Historical Matcher
  const handleFindSimilarCases = async () => {
    if (!currentCase) return;
    setIsMatchingSimilar(true);

    try {
      const response = await fetch('/api/gemini/find-similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint: currentCase,
          historicalCases: HISTORICAL_CASES,
        }),
      });
      const data = await response.json();
      if (data.success && data.data?.matches) {
        setSimilarMatches(data.data.matches);
      }
    } catch (err) {
      console.error('Failed to match similar historical cases:', err);
    } finally {
      setIsMatchingSimilar(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Principle Banner (Direct Specification Requirement) */}
      <div className="bg-amber-950/30 border border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-300 block">重要設計原則 (品質系統憲章)：</span>
          AI 提供的原因與改善措施均屬輔助建議，最終根本原因必須由品保及相關部門透過實際檢驗、製程調查與改善驗證確認，並明確區分「已確認事實」與「待驗證假設」。
        </div>
      </div>

      {/* Case Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block">
              AI 異常原因分析與歷史案例庫 (F04, F05)
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              智慧根本原因推論與語意相似客訴比對
            </h2>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">選擇客訴案件:</span>
            <select
              value={currentCaseId}
              onChange={(e) => {
                setCurrentCaseId(e.target.value);
                setAnalysisResult(null);
                setSimilarMatches([]);
              }}
              className="bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer w-full sm:w-80 truncate"
            >
              {complaints.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.clientName} ({c.anomalyType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentCase && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">客戶與品名:</span>
              <span className="text-white font-semibold truncate block">{currentCase.clientName}</span>
              <span className="text-slate-400 text-[11px] truncate block">{currentCase.productName}</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">異常特徵與不良率:</span>
              <span className="text-rose-400 font-bold block">{currentCase.anomalyType}</span>
              <span className="text-slate-300 text-[11px] block">{currentCase.defectQty.toLocaleString()} 件</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 text-[10px] block">生產批號 (MES 關聯):</span>
              <span className="font-mono text-cyan-300 font-bold block">{currentCase.lotNumber}</span>
              <span className="text-slate-400 text-[11px] block">
                {currentMes ? `${currentMes.machineId} / ${currentMes.mouldId}` : '無 MES 即時紀錄'}
              </span>
            </div>
            <div className="flex flex-col justify-center space-y-1.5">
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow transition cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI 深度推理中...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                    <span>啟動 AI 根本原因分析 (F04)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleFindSimilarCases}
                disabled={isMatchingSimilar}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500 font-semibold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {isMatchingSimilar ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>語意比對中...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3 h-3 text-cyan-400" />
                    <span>比對歷史相似客訴 (F05)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Applied notification */}
      {appliedNotice && (
        <div className="bg-emerald-950/70 border border-emerald-600 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
          <span>{appliedNotice}</span>
          <button onClick={() => setAppliedNotice(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* AI Root Cause Result (F04) */}
      {analysisResult ? (
        <div className="space-y-6">
          {/* Confirmed Facts vs Hypotheses To Validate (Mandatory Spec Standard) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confirmed Facts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-xs">已確認事實 (Confirmed Facts)</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  客觀檢驗與實測數據
                </span>
              </div>
              <ul className="space-y-2 text-xs">
                {analysisResult.confirmedFacts?.map((fact: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span className="text-slate-200 leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hypotheses To Validate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-3">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs">待驗證假設 (Hypotheses to Validate)</h3>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">
                  需現場試驗確認項目
                </span>
              </div>
              <ul className="space-y-2 text-xs">
                {analysisResult.hypothesesToValidate?.map((hypo: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="text-amber-100 leading-relaxed">{hypo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4M1E Ishikawa Fishbone Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                4M1E 魚骨圖根本成因多維度解析 (Man / Machine / Material / Method / Measurement)
              </h3>
              <span className="text-[10px] text-slate-400">系統自動整合 MES 製程參數與模具狀況</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <div className="flex items-center space-x-1.5 text-cyan-400 font-bold mb-1.5">
                  <span>人員 (Man)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {analysisResult.rootCauseAnalysis?.man}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <div className="flex items-center space-x-1.5 text-blue-400 font-bold mb-1.5">
                  <span>機台/模具 (Machine)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {analysisResult.rootCauseAnalysis?.machine}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold mb-1.5">
                  <span>原料/耗材 (Material)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {analysisResult.rootCauseAnalysis?.material}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1.5">
                  <span>方法/條件 (Method)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {analysisResult.rootCauseAnalysis?.method}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                <div className="flex items-center space-x-1.5 text-purple-400 font-bold mb-1.5">
                  <span>量測/檢驗 (Measurement)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {analysisResult.rootCauseAnalysis?.measurement}
                </p>
              </div>
            </div>
          </div>

          {/* Primary Root Cause & Evidence */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-700/50 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase">
                AI 核心根本原因綜合結論與逃逸點
              </span>
              <p className="text-sm font-bold text-white mt-1 leading-relaxed">
                {analysisResult.primaryRootCause}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-indigo-900/50 text-xs">
              <div>
                <span className="text-indigo-300 font-semibold block mb-1">支持該結論之關鍵製程數據佐證：</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {analysisResult.supportingEvidence?.map((ev: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400">▪</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-amber-300 font-semibold block mb-1">建議現場品保/工程驗證實驗：</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {analysisResult.recommendedExperiments?.map((exp: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400">▪</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onNavigateTo8D(currentCase.id)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <span>將此原因推論自動帶入 8D 報告 (D4)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Prompt */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 space-y-3">
          <Cpu className="w-10 h-10 text-cyan-400/60 mx-auto" />
          <h3 className="text-sm font-bold text-white">點擊上方「啟動 AI 根本原因分析」</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            系統將結合客訴物理外觀特徵、MES 生產履歷 (機台、模穴溫度、原料露點與射出保壓) 與歷史故障樹，提供 4M1E 成因推論與待驗證試驗規劃。
          </p>
        </div>
      )}

      {/* Historical Similar Cases Section (F05) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              歷史相似客訴案例比對庫 (F05 知識庫重用)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              搜尋包材過往發生之相似異常，查閱過去確認之真因與驗證有效對策
            </p>
          </div>
          <button
            onClick={handleFindSimilarCases}
            disabled={isMatchingSimilar}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition cursor-pointer disabled:opacity-50"
          >
            {isMatchingSimilar ? '正在比對語意...' : '重新比對歷史案例'}
          </button>
        </div>

        {similarMatches.length > 0 ? (
          <div className="space-y-3">
            {similarMatches.map((match: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700/80 hover:border-cyan-500/50 rounded-xl p-4 transition space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded text-[11px]">
                      {match.caseId}
                    </span>
                    <span className="font-semibold text-white">
                      相似度: <span className="text-emerald-400 font-bold">{match.similarityScore}%</span>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onApplyCapa(currentCase.id, `引用歷史對策 (${match.caseId})`, match.historicalCAPA);
                      setAppliedNotice(`已成功將歷史對策 (${match.caseId}) 匯入本案改善清單！`);
                    }}
                    className="flex items-center space-x-1 text-[11px] bg-slate-700 hover:bg-cyan-600 text-white font-semibold px-2.5 py-1 rounded transition cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>一鍵引用此歷史對策</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-300">
                  <span className="text-slate-400 font-semibold">相似依據:</span> {match.matchReason}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-semibold block mb-0.5">歷史確認真因：</span>
                    <span className="text-slate-300 leading-relaxed">{match.historicalRootCause}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-semibold block mb-0.5">歷史有效改善措施 (CAPA)：</span>
                    <span className="text-slate-300 leading-relaxed">{match.historicalCAPA}</span>
                    <span className="text-[10px] text-slate-500 block mt-1">成效: {match.verificationResult}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs">
            點擊「比對歷史相似客訴」由系統自動進行向量語意比對。
          </div>
        )}
      </div>
    </div>
  );
};
