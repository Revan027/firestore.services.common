import { Injectable, Query } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { addDoc, collection, CollectionReference, deleteDoc, DocumentData, DocumentReference, orderBy, query, QuerySnapshot, setDoc, updateDoc, where } from "firebase/firestore";
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { FirebaseCollectionEnum } from '../../constants/firebaseCollectionEnum';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  constructor(private firestore: Firestore, private auth: Auth) {
  }

  async signIn(){
    // on commence par ce connecter en anonyme
    const userCrdential = await signInAnonymously(this.auth);

    /* 
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log("user : ", user);
        // ...
      } 
      else {
        signInAnonymously(this.auth)
      }
    });*/
  }

  async createDocument(firebaseCollectionEnum: FirebaseCollectionEnum, object: object){
    return addDoc(collection(this.firestore, firebaseCollectionEnum),  { ...object }) // ... cast en array
  }

  async updateDocument(documentReference: DocumentReference, object: object){
    return await updateDoc(documentReference, object);
  }

  async deleteDocument(documentReference: DocumentReference){
    return deleteDoc(documentReference);
  }

  getCollectionRef(firebaseCollectionEnum: FirebaseCollectionEnum): CollectionReference<DocumentData, DocumentData>{
    return collection(this.firestore, firebaseCollectionEnum);
  }

  getDocumentRef(firebaseCollectionEnum: FirebaseCollectionEnum, id: string): DocumentReference<DocumentData, DocumentData>{
    return doc(this.firestore, firebaseCollectionEnum, id);
  }

  async getDocument<T>(firebaseCollectionEnum: FirebaseCollectionEnum, id: string){
    const ref = this.getDocumentRef(firebaseCollectionEnum, id);
    const docSnap = await getDoc(ref);

    return docSnap.data() as T;
  }

  async getDocuments<T>(firebaseCollectionEnum: FirebaseCollectionEnum, orderByAsc: string | null = null){
    const ref = collection(this.firestore, firebaseCollectionEnum);
    let docsSnap: QuerySnapshot<DocumentData, DocumentData>;

    if (orderByAsc != null){
      const q = query(ref, orderBy("latitude"));
      docsSnap = await getDocs(q);
    }
    else{
      docsSnap = await getDocs(ref);
    }
    
    return docsSnap.docs.map((item)=> {
      return Object.assign({id: item.id }, item.data()) as T;
    }) as T;
  }

  async search<T>(query: any){
    const docsSnap = await getDocs(query);

    return docsSnap.docs.map((item)=> {
      return Object.assign({id: item.id }, item.data()) as T;
    }) as T;
  }

  /*async getCollection<T>(firebaseCollectionEnum: FirebaseCollectionEnum): Promise<T>{
    //a mettre plus haut soit dans le constructeur soit en variable de classe. Observe en temps réel les changements sur les docs
    const collect = collection(this.firestore, firebaseCollectionEnum);

    return new Promise<T>(resolve => {
      collectionData(collect).subscribe(async (value) => {

        resolve(value as any)
      });
    });
 }*/
}
