/**
 * Report Types and Interfaces
 * Mulika Ufisadi - Corruption Reporting Platform
 */

export interface Report {
  id: string;
  anonymousId: string;
  county: string;
  agency: Agency;
  categories: Category[];
  incidentDate: Date;
  estimatedAmount?: number;
  description: string;
  evidence?: Evidence[];
  location?: Coordinates;
  contactMethod?: ContactMethod;
  submittedAt: Date;
  status: ReportStatus;
  verificationScore?: number;
}

export enum Agency {
  Police = 'police',
  LandServices = 'land_services',
  CivilRegistration = 'civil_registration',
  Judiciary = 'judiciary',
  MotorVehicle = 'motor_vehicle',
  BusinessLicensing = 'business_licensing',
  Education = 'education',
  Health = 'health',
  Tax = 'tax',
  HudumaCenter = 'huduma_center',
  Other = 'other',
}

export enum Category {
  Bribery = 'bribery',
  Extortion = 'extortion',
  Embezzlement = 'embezzlement',
  Nepotism = 'nepotism',
  ProcurementFraud = 'procurement_fraud',
  LandGrabbing = 'land_grabbing',
  Other = 'other',
}

export enum ReportStatus {
  Submitted = 'submitted',
  Verified = 'verified',
  UnderReview = 'under_review',
  FiledWithEACC = 'filed_with_eacc',
  Resolved = 'resolved',
}

export interface Evidence {
  type: 'image' | 'document';
  data: string; // Base64
  filename: string;
  size: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ContactMethod {
  type: 'email' | 'telegram' | 'signal';
  value: string;
  encrypted: boolean;
}
