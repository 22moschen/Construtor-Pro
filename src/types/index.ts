// src/types/index.ts

// Usado em src/app/dashboard/projects/new/page.tsx e detalhes
export interface BudgetItem {
  id: string; // Pode ser gerado no cliente ou pelo Firestore
  type: "Material" | "Serviço";
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Project {
  id: string; // ID do documento no Firestore
  projectName: string;
  clientName: string;
  clientContact?: string;
  workAddress: string;
  description?: string;
  startDate?: string; // Armazenar como string ISO ou timestamp
  endDate?: string;   // Armazenar como string ISO ou timestamp
  status: string;
  totalArea?: string;
  budget?: number; // Orçamento inicial
  budgetItems?: BudgetItem[];
  bdiPercentage?: number;
  createdAt?: any; // Firebase ServerTimestamp
  updatedAt?: any; // Firebase ServerTimestamp
}


// Usado em src/app/dashboard/resources/page.tsx
export interface Material {
  id: string; // ID do documento no Firestore
  name: string;
  unit: string;
  price: number;
  supplier?: string;
  code?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Service {
  id: string; // ID do documento no Firestore
  name: string;
  unit: string;
  price: number;
  createdAt?: any;
  updatedAt?: any;
}
