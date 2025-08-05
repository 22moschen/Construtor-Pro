// src/services/resourceService.ts
import { db } from '@/lib/firebase';
import type { Material, Service } from '@/types';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const MATERIALS_COLLECTION = 'materials';
const SERVICES_COLLECTION = 'services';

// Helper para converter Timestamps
const mapResourceDocument = (document: any): any => {
  const data = document.data();
  return {
    id: document.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  };
};

// --- Materials ---
export const createMaterial = async (materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), {
    ...materialData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getMaterials = async (): Promise<Material[]> => {
  const q = query(collection(db, MATERIALS_COLLECTION), orderBy('name'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => mapResourceDocument(doc) as Material);
};

export const updateMaterial = async (id: string, materialData: Partial<Omit<Material, 'id' | 'createdAt'>>): Promise<void> => {
  const docRef = doc(db, MATERIALS_COLLECTION, id);
  await updateDoc(docRef, {
    ...materialData,
    updatedAt: serverTimestamp(),
  });
};

// Usamos setDoc com merge:true para o caso de o ID ser gerado no cliente e já existir.
// Se o ID é sempre do Firestore, updateDoc é mais idiomático para edição.
// Para este exemplo, vamos assumir que se é um novo item sem ID do Firestore, criamos um.
// Se é um item existente com ID, atualizamos.
export const saveMaterial = async (material: Partial<Material>): Promise<string> => {
  if (material.id) {
    const docRef = doc(db, MATERIALS_COLLECTION, material.id);
    await updateDoc(docRef, {
      ...material,
      updatedAt: serverTimestamp(),
    });
    return material.id;
  } else {
    const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), {
      ...material,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }
};


export const deleteMaterial = async (id: string): Promise<void> => {
  const docRef = doc(db, MATERIALS_COLLECTION, id);
  await deleteDoc(docRef);
};

// --- Services ---
export const createService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, SERVICES_COLLECTION), {
    ...serviceData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getServices = async (): Promise<Service[]> => {
  const q = query(collection(db, SERVICES_COLLECTION), orderBy('name'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => mapResourceDocument(doc) as Service);
};

export const updateService = async (id: string, serviceData: Partial<Omit<Service, 'id' | 'createdAt'>>): Promise<void> => {
  const docRef = doc(db, SERVICES_COLLECTION, id);
  await updateDoc(docRef, {
    ...serviceData,
    updatedAt: serverTimestamp(),
  });
};

export const saveService = async (service: Partial<Service>): Promise<string> => {
  if (service.id) {
    const docRef = doc(db, SERVICES_COLLECTION, service.id);
    await updateDoc(docRef, {
      ...service,
      updatedAt: serverTimestamp(),
    });
    return service.id;
  } else {
    const docRef = await addDoc(collection(db, SERVICES_COLLECTION), {
      ...service,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  const docRef = doc(db, SERVICES_COLLECTION, id);
  await deleteDoc(docRef);
};
