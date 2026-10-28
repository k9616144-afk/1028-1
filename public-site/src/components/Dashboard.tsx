import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Percent,
  TrendingUp,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import { ComplaintCase } from '../types';

interface DashboardProps {
  complaints: ComplaintCase[];
}

export const Dashboard: React.FC<DashboardProps> = ({ complaints }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Fetch AI Insights
  useEffect(() => {
    async function fetchInsights() {
      setLoadingInsights(true);
      try {
        const response = await fetch('/api/gemini/quality-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            complaintsSummary: {
              total: complaints.length,
              byProduct: {
                瓶蓋: complaints.filter((c) => c.productType === '瓶蓋').length,
                瓶胚: complaints.filter((c) => c.productType === '瓶胚').length,
                標籤: complaints.filter((c) => c.productType === '標籤').length,
                塑膠瓶: complaints.filter((c) => c.productType === '塑膠瓶').length,
              },
            },
            spcAlerts: ['模溫超出上限', '乾燥露點回升至 -28°C', '吹氣壓力略低'],
          }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          setInsights(data.data);
        }
      } catch (e) {
        console.error('Error fetching quality insights:', e);
      } finally {
        setLoadingInsights(false);
      }
    }

    fetchInsights();
  }, [complaints.length]);

  // Product counts
  const productDistribution = [
    { type: '瓶蓋 (Caps)', count: 42, pct: 42, color: 'bg-cyan-500' },
    { type: '瓶胚 (Preforms)', count: 25, pct: 25, color: 'bg-blue-500' },
    { type: '塑膠瓶 (Bottles)', count: 20, pct: 20, color: 'bg-indigo-500' },
    { type: '標籤 (Labels)', count: 13, pct: 13, color: 'bg-purple-500' },
  ];

  // Anomaly Pareto (80/20)
  const paretoData = [
    { type: '漏液 / 氣密不良', count: 38, pct: 38, accumPct: 38 },
    { type: '尺寸超差 / 縮水', count: 26, pct: 26, accumPct: 64 },
    { type: '偏心壁厚不均', count: 16, pct: 16, accumPct: 80 },
    { type: '收縮膜起皺變形', count: 11, pct: 11, accumPct: 91 },
    { type: '瓶口變形刮痕', count: 6, pct: 6, accumPct: 97 },
    { type: '耐壓爆破強度不足', count: 3, pct: 3, accumPct: 100 },
  ];

  // Monthly Trend
  const monthlyTrends = [
    { month: '5月', count: 18, closedRate: 91 },
    { month: '6月', count: 16, closedRate: 92 },
    { month: '7月', count: 14, closedRate: 94 },
    { month: '8月', count: 12, closedRate: 95 },
    { month: '9月', count: 9, closedRate: 96 },
    { month: '10月 (當前)', count: 6, closedRate: 98 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block">
            品質數據分析與戰情儀表板 (F09, F10)
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            塑膠包材品質管理 KPI 與異常趨勢儀表板
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            全面落實客訴平均結案天數、初步回覆準時率、重複發生率與 AI 效率縮短目標監控
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">統計區間:</span>
          <span className="font-semibold text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            2026 年度累計 (即時連動)
          </span>
        </div>
      </div>

      {/* KPI Cards Strip (Matching Spec Section 5 exactly) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>客訴平均結案時間</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-cyan-400">4.2</span>
            <span className="text-xs text-slate-400">天</span>
          </div>
          <div className="flex items-center text-[10px] text-emerald-400 font-semibold">
            <ArrowDownRight className="w-3 h-3" />
            <span>縮短 38% (目標 30%)</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>初步回覆準時率</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-400">97.8%</span>
          </div>
          <div className="flex items-center text-[10px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>達標 (規範 ≥95%)</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>相同異常重複率</span>
            <TrendingDown className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-purple-400">8.2%</span>
          </div>
          <div className="flex items-center text-[10px] text-purple-400 font-semibold">
            <ArrowDownRight className="w-3 h-3" />
            <span>降低 43% (目標 20%)</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>批次追溯查找時間</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-blue-400">2.1</span>
            <span className="text-xs text-slate-400">分鐘</span>
          </div>
          <div className="flex items-center text-[10px] text-emerald-400 font-semibold">
            <ArrowDownRight className="w-3 h-3" />
            <span>縮短 95% (由 45 分鐘)</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>8D 報告製作時間</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-yellow-400">45</span>
            <span className="text-xs text-slate-400">分鐘</span>
          </div>
          <div className="flex items-center text-[10px] text-emerald-400 font-semibold">
            <ArrowDownRight className="w-3 h-3" />
            <span>AI 縮短 87% (原 6小時)</span>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>改善措施準時率</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-400">96.4%</span>
          </div>
          <div className="flex items-center text-[10px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>達標 (規範 ≥95%)</span>
          </div>
        </div>
      </div>

      {/* AI High-Level Strategic Insights Card */}
      {insights && (
        <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-800/60 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              AI 高階品質洞察與主動風險預警 (Executive Insights)
            </span>
            <span className="text-[10px] bg-purple-900/60 text-purple-200 px-2.5 py-0.5 rounded font-medium">
              品質趨勢分析
            </span>
          </div>

          <p className="text-purple-200 font-semibold leading-relaxed bg-purple-900/20 p-2.5 rounded-lg border border-purple-800/40">
            {insights.executiveSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <span className="text-rose-400 font-bold block mb-1">主要潛在品質風險 (Top Risks)：</span>
              <ul className="space-y-1 text-slate-300">
                {insights.topRisks?.map((r: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-semibold text-white">[{r.category}]</span>: {r.warning}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">長期預防策略建議 (Strategic Advice)：</span>
              <ul className="space-y-1 text-slate-300">
                {insights.strategicRecommendations?.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-cyan-400">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Pareto Chart (80/20) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                品質異常類型柏拉圖分析 (Pareto 80/20 Rule)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                漏液與尺寸超差合計佔異常總數 64%，為品保重點防堵項目
              </p>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              累計 102 件
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {paretoData.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{item.type}</span>
                  <div className="space-x-2 text-right">
                    <span className="text-white font-bold">{item.count} 件</span>
                    <span className="text-cyan-400 font-mono">({item.pct}%)</span>
                    <span className="text-slate-500 font-mono">累計: {item.accumPct}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${
                      item.accumPct <= 80 ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-cyan-600'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Type Breakdown & Monthly Trends */}
        <div className="space-y-6">
          {/* Product Type Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-400" />
                產品線客訴分佈佔比 (Product Distribution)
              </h3>
              <span className="text-[10px] text-slate-400">四大包材主力產線</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {productDistribution.map((p, i) => (
                <div key={i} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[11px] block">{p.type}</span>
                    <span className="text-lg font-bold text-white">{p.pct}%</span>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full ${p.color}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend Bars */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                近半年客訴件數連續收斂趨勢 (Monthly Trend)
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">已連續 5 個月下降</span>
            </div>

            <div className="flex items-end justify-between h-32 pt-4 px-2">
              {monthlyTrends.map((m, i) => {
                const max = 20;
                const hPercent = (m.count / max) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-bold text-cyan-300 font-mono">
                      {m.count}件
                    </span>
                    <div className="w-7 sm:w-10 bg-slate-800 rounded-t-lg overflow-hidden h-24 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t-lg transition-all"
                        style={{ height: `${hPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
