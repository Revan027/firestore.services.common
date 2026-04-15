import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { collection } from "firebase/firestore";
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

    /*onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log("user : ", user);
        // ...
      } 
      else {
        signInAnonymously(this.auth)
      }
    });*/
 }

  async getDocument<T>(firebaseCollectionEnum: FirebaseCollectionEnum, id: string){
    const ref = doc(this.firestore, firebaseCollectionEnum, id);
    const docSnap = await getDoc(ref);

    return docSnap.data() as T;
  }

  async getDocuments<T>(firebaseCollectionEnum: FirebaseCollectionEnum){
    const docsSnap = await getDocs(collection(this.firestore, firebaseCollectionEnum));

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
