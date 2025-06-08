import { db } from './config';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  CollectionReference,
} from 'firebase/firestore';

export interface Zone {
  id: string;
  action: '' | 'opening' | 'closing';
  name: string;
  status: 'in_progress' | 'closed' | 'opened';
}

const zonesRef: CollectionReference<Zone> = collection(
  db,
  process.env.EXPO_PUBLIC_COLLECTION_ID ?? ''
) as CollectionReference<Zone>;

export const getZones = async (): Promise<Zone[]> => {
  const snapshot = await getDocs(zonesRef);
  return snapshot.docs.map(doc => doc.data());
};

export const openDoor = async (): Promise<void> => {
  const documentId = process.env.EXPO_PUBLIC_DOCUMENT_ID ?? '';
  const doorDocRef = doc(db, process.env.EXPO_PUBLIC_COLLECTION_ID ?? '', documentId);
  await updateDoc(doorDocRef, {
    action: 'opening'
  })
}

export const closeDoor = async (): Promise<void> => {
  const documentId = process.env.EXPO_PUBLIC_DOCUMENT_ID ?? '';
  const doorDocRef = doc(db, process.env.EXPO_PUBLIC_COLLECTION_ID ?? '', documentId);
  await updateDoc(doorDocRef, {
    action: 'closing'
  })
}
