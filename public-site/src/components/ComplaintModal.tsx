import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, Camera, Check, Loader2 } from 'lucide-react';
import { ComplaintCase, ProductType, AnomalyType, SeverityLevel, RoleType } from '../types';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCase: ComplaintCase) => void;
  currentRole: RoleType;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentRole,
}) => {
  const [clientName, setClientName] = useState('');
  const [productType, setProductType] = useState<ProductType>('瓶蓋');
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [anomalyType, setAnomalyType] = useState<AnomalyType>('漏液');
  const [description, setDescription] = useState('');
  const [defectQty, setDefectQty] = useState<number>(1000);
  const [owner, setOwner] = useState('陳建宏 (品保課長)');
  const [department, setDepartment] = useState('品保部');
  const [severity, setSeverity] = useState<SeverityLevel>('Major');
  const [isAiClassifying, setIsAiClassifying] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60',
  ]);

  if (!isOpen) return null;

  // AI Classification trigger
  const handleAiClassify = async () => {
    if (!description.trim()) {
      alert('請先輸入異常描述，以利 AI 進行文字與語意關聯分析。');
      return;
    }
    setIsAiClassifying(true);
    setAiSuggestion(null);

    try {
      const response = await fetch('/api/gemini/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          productType,
          description,
          defectQty,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setAiSuggestion(resData.data);
        if (resData.data.anomalyCategory) {
          setAnomalyType(resData.data.anomalyCategory as AnomalyType);
        }
        if (resData.data.severity) {
          const sev = resData.data.severity.includes('Critical')
            ? 'Critical'
            : resData.data.severity.includes('Major')
            ? 'Major'
            : 'Minor';
          setSeverity(sev);
        }
        if (resData.data.responsibleDepartment) {
          setDepartment(resData.data.responsibleDepartment);
        }
      }
    } catch (err) {
      console.error('AI Classification failed:', err);
    } finally {
      setIsAiClassifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !productName || !lotNumber || !description) {
      alert('請填寫所有必填欄位 (客戶名稱、產品、批號與異常描述)');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7);

    const generatedId = `case-${Date.now().toString().slice(-4)}`;
    const caseNumber = `CC-${todayStr.replace(/-/g, '').slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newCase: ComplaintCase = {
      id: generatedId,
      caseNumber,
      clientName,
      complaintDate: todayStr,
      productType,
      productName,
      productCode: productCode || `PRD-${Date.now().toString().slice(-4)}`,
      lotNumber,
      anomalyType,
      description,
      defectQty: Number(defectQty),
      photos,
      owner,
      department,
      status: '待處理',
      severity,
      estimatedCloseDate: estimatedDate.toISOString().split('T')[0],
      capaActions: [],
      historyLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          operator: currentRole === '業務' ? '郭慧琳' : '陳建宏',
          role: currentRole,
          action: '建立新客訴立案',
          notes: `由 ${currentRole} 建立案件，初評嚴重度: ${severity}`,
        },
      ],
      has8D: false,
      aiClassificationNote: aiSuggestion?.summary,
    };

    onSave(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-lg font-bold text-white">建立塑膠包材客訴案件 (F01)</h2>
            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
              自動生成唯一案件編號
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Client & Product Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                客戶名稱 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="例如: 可口可樂、統一企業、黑松..."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                包材產品類型 <span className="text-rose-400">*</span>
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="瓶蓋">瓶蓋 (Caps / Closures)</option>
                <option value="瓶胚">瓶胚 (Preforms)</option>
                <option value="標籤">標籤 (Shrink Labels)</option>
                <option value="塑膠瓶">塑膠瓶 (Bottles)</option>
              </select>
            </div>
          </div>

          {/* Product Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">
                產品品名規格 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="例如: 28mm PCO1881 碳酸防盜蓋 (藍色)"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">產品料號</label>
              <input
                type="text"
                placeholder="CAP-1881-BL"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Lot & Defect Qty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                生產批號 (用於 MES 生產履歷追溯) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="LOT-20261015-C02"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-cyan-300 font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">不良數量 (PCS)</label>
              <input
                type="number"
                min="1"
                value={defectQty}
                onChange={(e) => setDefectQty(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Description & AI Trigger */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                異常詳細描述 <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleAiClassify}
                disabled={isAiClassifying}
                className="flex items-center space-x-1.5 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-2.5 py-1 rounded-md shadow transition cursor-pointer disabled:opacity-50"
              >
                {isAiClassifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI 智慧分析中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>✨ AI 輔助分類與初評建議</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              required
              rows={3}
              placeholder="詳細記錄客戶現場反映情況（如：水浴溫水耐壓 45°C 測漏微量冒泡、封蓋扭力偏低僅 10 in-lbs、套標橫向起皺變形、吹瓶偏心等）..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* AI Suggestion Box */}
          {aiSuggestion && (
            <div className="bg-purple-950/40 border border-purple-700/60 rounded-xl p-3 text-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-purple-300">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  AI 研判建議結果已自動代入表單
                </span>
                <span className="text-[11px] bg-purple-900 px-2 py-0.5 rounded text-purple-200">
                  {aiSuggestion.summary}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-purple-900/30 p-2 rounded">
                  <span className="text-purple-400 font-semibold">建議立即圍堵：</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-purple-200">
                    {aiSuggestion.recommendedInitialActions?.map((act: string, idx: number) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-purple-900/30 p-2 rounded">
                  <span className="text-purple-400 font-semibold">關鍵檢驗項目：</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-purple-200">
                    {aiSuggestion.keyInspectionItems?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Anomaly Category, Severity & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">異常類型</label>
              <select
                value={anomalyType}
                onChange={(e) => setAnomalyType(e.target.value as AnomalyType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="漏液">漏液 (氣密不良)</option>
                <option value="尺寸超差">尺寸超差</option>
                <option value="瓶口變形">瓶口變形</option>
                <option value="外觀雜質">外觀雜質 / 黑點</option>
                <option value="印刷脫墨">印刷脫墨 / 色差</option>
                <option value="收縮起皺">收縮起皺</option>
                <option value="偏心壁厚不均">偏心壁厚不均</option>
                <option value="結晶發白">結晶發白</option>
                <option value="脫蓋滑牙">脫蓋滑牙</option>
                <option value="耐壓爆瓶">耐壓爆瓶</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">嚴重程度</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Critical">Critical (重大停線/食品安全危機)</option>
                <option value="Major">Major (主要瑕疵/機能影響)</option>
                <option value="Minor">Minor (次要瑕疵/微小外觀)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">負責主導單位</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Photo upload placeholder preview */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              異常樣品照片 (支援多張檢視與比對)
            </label>
            <div className="flex items-center gap-3">
              {photos.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
                  <img src={url} alt="Defect" className="w-full h-full object-cover" />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const sampleUrls = [
                    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?w=800&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60',
                  ];
                  setPhotos([...photos, sampleUrls[photos.length % sampleUrls.length]]);
                }}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-700 hover:border-cyan-500 flex flex-col items-center justify-center text-slate-400 hover:text-cyan-400 text-[10px] cursor-pointer transition"
              >
                <span>+ 新增相片</span>
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-600/30 transition cursor-pointer"
            >
              完成立案並啟動時效管制
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
