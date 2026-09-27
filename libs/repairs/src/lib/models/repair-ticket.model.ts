// libs/repairs/src/lib/models/repair-ticket.model.ts
export type RepairStatus =
  | 'Received'
  | 'Diagnosing'
  | 'AwaitingApproval'
  | 'InRepair'
  | 'Ready'
  | 'Collected'
  | 'Cancelled';

export interface RepairPart {
  id: number;
  productId: number;
  quantity: number;
  unitCostKobo: number;
  totalCostKobo: number;
}

export interface RepairTicket {
  id: number;
  customerId: string | null;
  deviceDescription: string;
  imeiOrSerial: string | null;
  faultDescription: string;
  diagnosisNotes: string | null;
  quotedPriceKobo: number | null;
  technicianUserId: string | null;
  status: RepairStatus;
  parts: RepairPart[];
}