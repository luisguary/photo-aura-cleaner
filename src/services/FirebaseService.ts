
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage } from "../lib/firebase";

export class FirebaseService {
  // Firestore methods
  
  /**
   * Añade un documento a una colección
   */
  static async addDocument(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      console.log("Documento creado con ID:", docRef.id);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error al añadir documento:", error);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los documentos de una colección
   */
  static async getCollection(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener colección:", error);
      throw error;
    }
  }
  
  /**
   * Obtiene documentos filtrados de una colección
   */
  static async getFilteredDocuments(collectionName: string, field: string, value: any) {
    try {
      const q = query(collection(db, collectionName), where(field, "==", value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener documentos filtrados:", error);
      throw error;
    }
  }
  
  /**
   * Obtiene un documento por su ID
   */
  static async getDocumentById(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        console.log("No existe el documento!");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener documento:", error);
      throw error;
    }
  }
  
  /**
   * Actualiza un documento
   */
  static async updateDocument(collectionName: string, docId: string, data: any) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      console.log("Documento actualizado correctamente");
      return { id: docId, ...data };
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      throw error;
    }
  }
  
  /**
   * Elimina un documento
   */
  static async deleteDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      console.log("Documento eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      throw error;
    }
  }
  
  // Storage methods
  
  /**
   * Sube un archivo al storage
   */
  static async uploadFile(path: string, file: File) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Archivo subido correctamente:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir archivo:", error);
      throw error;
    }
  }
  
  /**
   * Obtiene la URL de descarga de un archivo
   */
  static async getFileURL(path: string) {
    try {
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error al obtener URL de archivo:", error);
      throw error;
    }
  }
  
  /**
   * Elimina un archivo del storage
   */
  static async deleteFile(path: string) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      console.log("Archivo eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      throw error;
    }
  }
}
