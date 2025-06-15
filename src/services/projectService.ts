// src/services/projectService.ts
import { db } from '@/lib/firebase';
import type { Project, BudgetItem } from '@/types';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const PROJECTS_COLLECTION = 'projects';

// Helper para converter Timestamps do Firestore para datas ou strings
const mapProjectDocument = (document: any): Project => {
  const data = document.data();
  return {
    id: document.id,
    ...data,
    startDate: data.startDate ? (data.startDate.toDate ? data.startDate.toDate().toISOString() : data.startDate) : undefined,
    endDate: data.endDate ? (data.endDate.toDate ? data.endDate.toDate().toISOString() : data.endDate) : undefined,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  } as Project;
};


export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const projectPayload: any = {
    ...projectData,
    budgetItems: projectData.budgetItems || [],
    bdiPercentage: projectData.bdiPercentage || 25,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (projectData.startDate) projectPayload.startDate = Timestamp.fromDate(new Date(projectData.startDate));
  if (projectData.endDate) projectPayload.endDate = Timestamp.fromDate(new Date(projectData.endDate));


  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectPayload);
  return docRef.id;
};

export const getProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(mapProjectDocument);
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return mapProjectDocument(docSnap);
  }
  return null;
};

export const updateProject = async (id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<void> => {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  const updatePayload: any = {
    ...projectData,
    updatedAt: serverTimestamp(),
  };

  // Lidar com datas
  if (projectData.startDate) {
    updatePayload.startDate = Timestamp.fromDate(new Date(projectData.startDate));
  }
  if (projectData.endDate) {
    updatePayload.endDate = Timestamp.fromDate(new Date(projectData.endDate));
  }

  await updateDoc(docRef, updatePayload);
};

export const deleteProject = async (id: string): Promise<void> => {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
};

// Funções específicas para budgetItems se necessário, ou podem ser parte do updateProject
export const addBudgetItemToProject = async (projectId: string, item: BudgetItem): Promise<void> => {
  const project = await getProjectById(projectId);
  if (project) {
    const updatedBudgetItems = [...(project.budgetItems || []), item];
    await updateProject(projectId, { budgetItems: updatedBudgetItems });
  }
};

export const deleteBudgetItemFromProject = async (projectId: string, itemId: string): Promise<void> => {
  const project = await getProjectById(projectId);
  if (project && project.budgetItems) {
    const updatedBudgetItems = project.budgetItems.filter(item => item.id !== itemId);
    await updateProject(projectId, { budgetItems: updatedBudgetItems });
  }
};
