import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  Cpu, 
  Thermometer, 
  Gauge, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles,
  Info,
  Calendar,
  User,
  Zap,
  ArrowRight
} from 'lucide-react';
import { MesTraceRecord, ProductType } from '../types';
import { MOCK_MES_RECORDS } from '../data/mockData';

interface MesTraceabilityProps {
  currentLotNumber?: string;
  onLaunchAiAnalysis: (lotNumber: string) => void;
}

export const MesTraceability: React.FC<MesTraceabilityProps> = ({
  currentLotNumber = 'LOT-20261015-C02',
  onLaunchAiAnalysis,
}) => {
  const [searchLot, setSearchLot] = useState(currentLotNumber);
  const [activeRecord, setActiveRecord] = useState<MesTraceRecord | null>(
    MOCK_MES_RECORDS[currentLotNumber] || MOCK_MES_RECORDS['LOT-20261015-C02']
  );
  const [selectedCavity, setSelectedCavity] = useState<number | null>(12);

  const availableLots = Object.keys(MOCK_MES_RECORDS);

  const handleSearch = (lot: string) => {
    setSearchLot(lot);
    if (MOCK_MES_RECORDS[lot]) {
      setActiveRecord(MOCK_MES_RECORDS[lot]);
      setSelectedCavity(MOCK_MES_RECORDS[lot].suspectCavities[0] || 1);
    } else {
      // Generate synthetic record on the fly for any custom lot entered
      const syntheticRecord: MesTraceRecord = {
        lotNumber: lot,
        productType: '瓶蓋',
        productName: '客製化包材成型樣品批次',
        productCode: `PRD-${lot.slice(-4)}`,
        productionDate: '2026-10-21',
        shift: '早班 (08:00 - 16:30)',
        operator: '李國華 (員工編號: P-1088)',
        machineId: 'IMM-02 (Netstal 1800)',
        machineModel: '全電動高精密射出成型機',
        mouldId: 'M-STD-32Cav',
        totalCavities: 32,
        suspectCavities: [8, 14],
        rawMaterialName: 'PP 聚丙烯食品級樹酯',
        rawMaterialBatch: `RESIN-${lot.slice(-4)}`,
        resinMFI: 2.3,
        dryingDewPoint: -41,
        resinMoisturePpm: 32,
        injectionPressureBar: 138,
        holdingPressureBar: 85,
        coolingTimeSec: 2.5,
        moldTempC: 13.5,
        cycleTimeSec: 3.6,
        qcNotes: '該批次生產平穩，巡檢尺寸均在規格界限內。',
        iqcStatus: 'PASS',
        ipqcStatus: 'PASS',
        oqcStatus: 'PASS',
        cavities: Array.from({ length: 32 }, (_, i) => ({
          cavityNumber: i + 1,
          dimensionMm: 27.99,
          nominalMm: 28.00,
          status: [8, 14].includes(i + 1) ? 'WARNING' : 'OK',
          weightG: 2.83,
          defectCount: [8, 14].includes(i + 1) ? 3 : 0,
        })),
      };
      setActiveRecord(syntheticRecord);
      setSelectedCavity(8);
    }
  };

  const currentCavityData = activeRecord?.cavities.find((c) => c.cavityNumber === selectedCavity);

  return (
    <div className="space-y-6">
      {/* Top Banner & Search Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  生產履歷與製程批次追溯 (F03 MES/ERP 整合)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  以生產批號為核心，即時串接機台編號、模具模穴號、冷卻水溫、射出/吹氣壓力與品質檢驗紀錄
                </p>
              </div>
            </div>
          </div>

          {/* Lot Selector & Quick Button */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="輸入批號，例如 LOT-20261015-C02..."
                value={searchLot}
                onChange={(e) => setSearchLot(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchLot)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={() => handleSearch(searchLot)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer"
            >
              查詢履歷
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-3 flex items-center space-x-2 overflow-x-auto text-[11px] text-slate-400">
          <span className="whitespace-nowrap font-medium text-slate-500">客訴關聯批次快速檢視:</span>
          {availableLots.map((lot) => (
            <button
              key={lot}
              onClick={() => handleSearch(lot)}
              className={`px-2.5 py-1 rounded-md border font-mono whitespace-nowrap transition cursor-pointer ${
                activeRecord?.lotNumber === lot
                  ? 'bg-blue-900/40 border-blue-600 text-blue-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {lot}
            </button>
          ))}
        </div>
      </div>

      {activeRecord && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Traceability Core Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Machine & Production Setup Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  成型設備與模具配置
                </span>
                <span className="text-[10px] bg-slate-800 text-cyan-300 font-mono px-2 py-0.5 rounded">
                  {activeRecord.productType}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">產品品名:</span>
                  <span className="font-semibold text-white truncate max-w-[180px]">{activeRecord.productName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">生產日期 / 班別:</span>
                  <span className="text-slate-200">{activeRecord.productionDate} ({activeRecord.shift})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">生產機台編號:</span>
                  <span className="font-semibold text-cyan-300">{activeRecord.machineId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">機台型號說明:</span>
                  <span className="text-slate-300">{activeRecord.machineModel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">模具編號:</span>
                  <span className="font-mono text-white">{activeRecord.mouldId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">總模穴數:</span>
                  <span className="font-bold text-cyan-400">{activeRecord.totalCavities} 穴</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">作業人員:</span>
                  <span className="text-slate-300">{activeRecord.operator}</span>
                </div>
              </div>
            </div>

            {/* Raw Material Batch Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <span className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                原物料與進料檢驗 (IQC)
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">樹酯規格:</span>
                  <span className="text-white font-medium">{activeRecord.rawMaterialName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">原料批號:</span>
                  <span className="font-mono text-amber-300 font-semibold">{activeRecord.rawMaterialBatch}</span>
                </div>
                {activeRecord.resinMFI > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">熔融流動指數 (MFI):</span>
                    <span className="text-slate-200">{activeRecord.resinMFI} g/10min</span>
                  </div>
                )}
                {activeRecord.dryingDewPoint !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">乾燥除濕露點:</span>
                    <span className={`font-mono font-bold ${activeRecord.dryingDewPoint > -38 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {activeRecord.dryingDewPoint} °C {activeRecord.dryingDewPoint > -38 && '(異常偏高)'}
                    </span>
                  </div>
                )}
                {activeRecord.resinMoisturePpm > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">樹酯含水率:</span>
                    <span className={`font-mono font-bold ${activeRecord.resinMoisturePpm > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {activeRecord.resinMoisturePpm} ppm {activeRecord.resinMoisturePpm > 50 && '(水解風險)'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Three Quality Gates Badges */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between text-xs">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block mb-1">進料檢驗 (IQC)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeRecord.iqcStatus === 'PASS' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                }`}>
                  {activeRecord.iqcStatus}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block mb-1">製程巡檢 (IPQC)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeRecord.ipqcStatus === 'PASS' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                }`}>
                  {activeRecord.ipqcStatus}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block mb-1">出貨檢驗 (OQC)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeRecord.oqcStatus === 'PASS' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                }`}>
                  {activeRecord.oqcStatus}
                </span>
              </div>
            </div>

            {/* Launch AI Button */}
            <button
              onClick={() => onLaunchAiAnalysis(activeRecord.lotNumber)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 text-xs transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>以此批次數據啟動 AI 異常分析 (F04)</span>
            </button>
          </div>

          {/* Right Column: Process Parameters & Interactive Cavity Heatmap */}
          <div className="lg:col-span-2 space-y-4">
            {/* Process Parameters Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="font-bold text-white text-xs flex items-center gap-1.5 mb-3">
                <Gauge className="w-4 h-4 text-cyan-400" />
                即時關鍵製程參數監控 (MES SPC 數據)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {activeRecord.injectionPressureBar > 0 && (
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">射出壓力</span>
                    <span className="text-base font-bold font-mono text-cyan-300">
                      {activeRecord.injectionPressureBar}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">bar</span>
                  </div>
                )}

                {activeRecord.holdingPressureBar > 0 && (
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">保壓壓力</span>
                    <span className="text-base font-bold font-mono text-cyan-300">
                      {activeRecord.holdingPressureBar}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">bar</span>
                  </div>
                )}

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">模具冷卻水溫</span>
                  <span className={`text-base font-bold font-mono ${activeRecord.moldTempC > 16 ? 'text-rose-400' : 'text-emerald-300'}`}>
                    {activeRecord.moldTempC}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1">°C</span>
                  {activeRecord.moldTempC > 16 && (
                    <span className="block text-[9px] text-rose-400">超出管制線!</span>
                  )}
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">成型週期</span>
                  <span className="text-base font-bold font-mono text-cyan-300">
                    {activeRecord.cycleTimeSec}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1">sec</span>
                </div>

                {activeRecord.blowPressureBar && (
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">吹氣高壓壓力</span>
                    <span className={`text-base font-bold font-mono ${activeRecord.blowPressureBar < 35 ? 'text-amber-400' : 'text-cyan-300'}`}>
                      {activeRecord.blowPressureBar}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">bar</span>
                  </div>
                )}
              </div>

              {activeRecord.qcNotes && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{activeRecord.qcNotes}</span>
                </div>
              )}
            </div>

            {/* Interactive Visual Mould Cavity Map (Heatmap) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-xs flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    模具分穴熱點與尺寸公差分布地圖 (Cavity Heatmap)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    點擊模穴號碼即可檢視單穴實測尺寸 (mm)、單重及缺陷集中度
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                    <span className="text-slate-300">OK 正常穴</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                    <span className="text-slate-300">Warning 邊界</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-rose-600 animate-pulse" />
                    <span className="text-rose-300 font-bold">NG 疑慮穴</span>
                  </div>
                </div>
              </div>

              {/* Grid of Cavities */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                {activeRecord.cavities.slice(0, 32).map((cav) => {
                  const isSelected = selectedCavity === cav.cavityNumber;
                  const isSuspect = activeRecord.suspectCavities.includes(cav.cavityNumber);

                  return (
                    <button
                      key={cav.cavityNumber}
                      onClick={() => setSelectedCavity(cav.cavityNumber)}
                      className={`p-2 rounded-lg text-center transition flex flex-col items-center justify-center border cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 scale-105 z-10'
                          : ''
                      } ${
                        cav.status === 'NG'
                          ? 'bg-rose-950/70 border-rose-600 text-rose-200'
                          : cav.status === 'WARNING'
                          ? 'bg-amber-950/50 border-amber-600 text-amber-200'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-mono font-bold text-xs">#{cav.cavityNumber}</span>
                      <span className="text-[10px] font-mono mt-0.5">{cav.dimensionMm}</span>
                      {isSuspect && (
                        <span className="text-[8px] bg-rose-900 text-rose-200 px-1 rounded mt-0.5 font-bold">
                          客訴疑慮
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Cavity Detail Card */}
              {currentCavityData && (
                <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">
                        模穴 Cavity #{currentCavityData.cavityNumber} 檢測細項
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          currentCavityData.status === 'NG'
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : currentCavityData.status === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        }`}
                      >
                        狀態: {currentCavityData.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      實測尺寸: <span className="font-mono text-cyan-300 font-bold">{currentCavityData.dimensionMm} mm</span> (標準值: {currentCavityData.nominalMm} mm) • 單重: {currentCavityData.weightG}g
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">累積不良品檢出:</span>
                    <span className="text-base font-mono font-bold text-rose-400">
                      {currentCavityData.defectCount} 件
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
