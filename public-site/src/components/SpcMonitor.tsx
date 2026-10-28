import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Gauge, 
  Thermometer, 
  Sliders, 
  CheckCircle, 
  Zap, 
  RefreshCw,
  BellRing
} from 'lucide-react';
import { SpcWarningItem } from '../types';
import { INITIAL_SPC_ALERTS } from '../data/mockData';

export const SpcMonitor: React.FC = () => {
  const [alerts, setAlerts] = useState<SpcWarningItem[]>(INITIAL_SPC_ALERTS);

  // Simulation state for interactive demonstration of F11
  const [simTemp, setSimTemp] = useState<number>(19.4);
  const [simDew, setSimDew] = useState<number>(-28);
  const [simPressure, setSimPressure] = useState<number>(33.2);

  const handleReset = () => {
    setSimTemp(12.0);
    setSimDew(-44.0);
    setSimPressure(38.0);
  };

  // Evaluate dynamic alerts based on simulated sliders
  const isTempAlarm = simTemp > 16.0;
  const isDewAlarm = simDew > -38.0;
  const isPressureAlarm = simPressure < 35.0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-rose-400 font-semibold tracking-wider uppercase block">
            製程品質即時監控 (F11 製程異常預警)
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            統計製程管制 (SPC) 異常偵測與批量品質風險預警
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            即時監控射出保壓、模溫水路、原料露點與吹氣高壓，在超出管制界限 (UCL/LCL) 時提早警報，防範不良品流出
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg border border-slate-700 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重設最佳標準參數</span>
        </button>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-white text-xs flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            製程參數即時模擬調整器 (拖曳滑桿體驗 UCL / LCL 即時連鎖警報機制)
          </span>
          <span className="text-[10px] text-slate-400">連動生產線傳感器模擬</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
          {/* Slider 1: Mold Temp */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">IMM-04 模具動模水溫</span>
              <span className={`font-mono font-bold ${simTemp > 16 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {simTemp.toFixed(1)} °C
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              step="0.2"
              value={simTemp}
              onChange={(e) => setSimTemp(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>LCL: 10°C</span>
              <span>目標: 12°C</span>
              <span className="text-rose-400">UCL: 16°C</span>
            </div>
          </div>

          {/* Slider 2: Dew Point */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">IMM-08 乾燥塔除濕露點</span>
              <span className={`font-mono font-bold ${simDew > -38 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {simDew.toFixed(1)} °C
              </span>
            </div>
            <input
              type="range"
              min="-55"
              max="-15"
              step="1"
              value={simDew}
              onChange={(e) => setSimDew(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>良好: -50°C</span>
              <span>目標: -45°C</span>
              <span className="text-rose-400">警報線: -38°C</span>
            </div>
          </div>

          {/* Slider 3: Blow Pressure */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">SBM-02 吹瓶機延伸吹氣壓</span>
              <span className={`font-mono font-bold ${simPressure < 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {simPressure.toFixed(1)} bar
              </span>
            </div>
            <input
              type="range"
              min="28"
              max="44"
              step="0.5"
              value={simPressure}
              onChange={(e) => setSimPressure(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span className="text-rose-400">LCL: 35 bar</span>
              <span>目標: 38 bar</span>
              <span>UCL: 42 bar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Alerts List */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-xs flex items-center gap-2">
          <BellRing className="w-4 h-4 text-cyan-400" />
          目前即時預警監控清單 ({[isTempAlarm, isDewAlarm, isPressureAlarm].filter(Boolean).length} 項風險觸發)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div
            className={`border rounded-xl p-4 shadow-lg space-y-3 transition ${
              isTempAlarm
                ? 'bg-rose-950/30 border-rose-600/80'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">IMM-04 (瓶蓋射出線)</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isTempAlarm ? 'bg-rose-900 text-rose-200 animate-pulse' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {isTempAlarm ? 'ALARM 超限' : 'NORMAL 正常'}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 block">監控項目: 動模冷卻水路溫度</span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-black font-mono ${isTempAlarm ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {simTemp.toFixed(1)} °C
                </span>
                <span className="text-slate-500 text-[10px]">目標: 12.0 °C (UCL: 16.0°C)</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-rose-300 block mb-0.5">包材品質風險衝擊：</span>
              {isTempAlarm
                ? '模溫過高造成 HDPE 瓶蓋結晶冷卻過慢，螺牙收縮變形縮小，出貨將面臨客戶線上封口滑牙漏液危機！'
                : '冷卻均勻，瓶蓋有效牙徑維持在 27.98±0.03mm 理想值。'}
            </div>
          </div>

          {/* Card 2 */}
          <div
            className={`border rounded-xl p-4 shadow-lg space-y-3 transition ${
              isDewAlarm
                ? 'bg-amber-950/30 border-amber-600/80'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">IMM-08 (瓶胚射出線)</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isDewAlarm ? 'bg-amber-900 text-amber-200' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {isDewAlarm ? 'WARNING 預警' : 'NORMAL 正常'}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 block">監控項目: 乾燥筒除濕露點</span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-black font-mono ${isDewAlarm ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {simDew.toFixed(1)} °C
                </span>
                <span className="text-slate-500 text-[10px]">目標: -45.0 °C (警報: -38°C)</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-amber-300 block mb-0.5">包材品質風險衝擊：</span>
              {isDewAlarm
                ? '露點高於 -38°C 將導致 PET 樹酯高溫水解，IV 黏度衰減，客戶後段吹瓶將發生偏芯與破瓶！'
                : '分子篩吸濕力良好，樹酯含水率低於 30ppm，成型結晶穩定。'}
            </div>
          </div>

          {/* Card 3 */}
          <div
            className={`border rounded-xl p-4 shadow-lg space-y-3 transition ${
              isPressureAlarm
                ? 'bg-amber-950/30 border-amber-600/80'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">SBM-02 (吹瓶機)</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isPressureAlarm ? 'bg-amber-900 text-amber-200' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {isPressureAlarm ? 'WARNING 偏低' : 'NORMAL 正常'}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 block">監控項目: 延伸二次吹氣壓</span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-black font-mono ${isPressureAlarm ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {simPressure.toFixed(1)} bar
                </span>
                <span className="text-slate-500 text-[10px]">目標: 38.0 bar (LCL: 35.0)</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-amber-300 block mb-0.5">包材品質風險衝擊：</span>
              {isPressureAlarm
                ? '吹氣高壓不足可能導致 1500ml 碳酸瓶底五瓣爪充填不完全，耐壓強度降低，具爆瓶隱患！'
                : '高壓成型飽滿，瓶底五瓣爪圓弧度符合高氣密耐壓規範。'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
