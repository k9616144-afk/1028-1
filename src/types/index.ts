export type ProductType = '瓶蓋' | '瓶胚' | '標籤' | '塑膠瓶';

export type AnomalyType =
  | '漏液'
  | '尺寸超差'
  | '瓶口變形'
  | '外觀雜質'
  | '印刷脫墨'
  | '收縮起皺'
  | '偏心壁厚不均'
  | '結晶發白'
  | '脫蓋滑牙'
  | '耐壓爆瓶'
  | '其他';

export type ComplaintStatus = '待處理' | '調查中' | '改善中' | '驗證中' | '已結案';

export type SeverityLevel = 'Critical' | 'Major' | 'Minor';

export type RoleType = '業務' | '品保' | '生產' | '工程' | '管理階層' | '客戶';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  role: RoleType;
  action: string;
  notes?: string;
}

export interface CapaItem {
  id: string;
  type: '圍堵對策' | '矯正措施' | '預防措施';
  title: string;
  description: string;
  owner: string;
  department: string;
  dueDate: string;
  status: '待執行' | '進行中' | '已完成' | '已驗證';
  verificationMethod?: string;
  verificationEvidence?: string;
  completedAt?: string;
}

export interface ComplaintCase {
  id: string;
  caseNumber: string; // e.g. CC-202610-001
  clientName: string; // e.g. 統一企業、可口可樂、黑松
  complaintDate: string;
  productType: ProductType;
  productName: string;
  productCode: string;
  lotNumber: string;
  anomalyType: AnomalyType;
  description: string;
  defectQty: number;
  totalLotQty?: number;
  photos: string[];
  owner: string; // 案件主要負責人
  department: string;
  status: ComplaintStatus;
  severity: SeverityLevel;
  estimatedCloseDate: string;
  closeDate?: string;
  rootCause?: string;
  capaActions: CapaItem[];
  verificationResult?: string;
  historyLogs: AuditLogEntry[];
  has8D: boolean;
  aiClassificationNote?: string;
}

export interface CavityInspection {
  cavityNumber: number;
  dimensionMm: number; // e.g. 27.98mm
  nominalMm: number; // 28.00mm
  status: 'OK' | 'WARNING' | 'NG';
  weightG: number;
  defectCount: number;
}

export interface MesTraceRecord {
  lotNumber: string;
  productType: ProductType;
  productName: string;
  productCode: string;
  productionDate: string;
  shift: string; // 早班 / 中班 / 夜班
  operator: string;
  machineId: string; // e.g. IMM-04 (射出成型機)
  machineModel: string; // e.g. Husky HyPET HPP5 / Netstal ELION
  mouldId: string; // e.g. M-CAP-1881-32Cav
  totalCavities: number;
  suspectCavities: number[];
  rawMaterialName: string;
  rawMaterialBatch: string;
  resinMFI: number; // g/10min
  dryingDewPoint: number; // °C, e.g. -42°C
  resinMoisturePpm: number;
  injectionPressureBar: number;
  holdingPressureBar: number;
  coolingTimeSec: number;
  moldTempC: number;
  cycleTimeSec: number;
  blowPressureBar?: number;
  stretchSpeedMms?: number;
  qcNotes: string;
  iqcStatus: 'PASS' | 'MARGINAL';
  ipqcStatus: 'PASS' | 'WARNING' | 'FAILED';
  oqcStatus: 'PASS' | 'WARNING';
  cavities: CavityInspection[];
}

export interface EightDReportData {
  d1_team: {
    leader: string;
    members: string[];
    champion: string;
  };
  d2_problem: {
    what: string;
    where: string;
    when: string;
    howMuch: string;
    isNot: string;
  };
  d3_containment: Array<{
    action: string;
    owner: string;
    dueDate: string;
    status: string;
    result: string;
  }>;
  d4_rootCause: {
    occurrenceCause: string;
    escapeCause: string;
    fiveWhys: string[];
  };
  d5_permanentActions: Array<{
    action: string;
    owner: string;
    dueDate: string;
    verificationMethod: string;
  }>;
  d6_implementation: {
    executionStatus: string;
    validationData: string;
  };
  d7_prevention: {
    sopUpdates: string[];
    fmeaUpdate: string;
    horizontalDeployment: string;
  };
  d8_closure: {
    teamRecognition: string;
    closureDate: string;
    approvedBy: string;
  };
}

export interface HistoricalCase {
  id: string;
  title: string;
  clientName: string;
  productType: ProductType;
  anomalyType: AnomalyType;
  description: string;
  rootCause: string;
  capa: string;
  verificationResult: string;
  date: string;
  tags: string[];
}

export interface SpcWarningItem {
  id: string;
  machineId: string;
  parameterName: string;
  currentValue: number;
  targetValue: number;
  ucl: number;
  lcl: number;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'ALARM';
  message: string;
  productImpact: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  caseId?: string;
}
