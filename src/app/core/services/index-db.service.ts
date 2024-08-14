import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { IndexDBStoreNames } from 'src/app/models/constants/index-db.constant';

@Injectable({ providedIn: 'root' })
export class IndexDBService {
  private db;

  constructor() {
    this.InitializeDB();
  }

  private async InitializeDB() {
    this.db = await openDB<any>('Lavi-QTVR-DB', 1, {
      upgrade(db) {
        db.createObjectStore(IndexDBStoreNames.LayoutData);
      },
    });
  }

  async Put(storeName, key, value) {
    await this.db.put(storeName, value, key);
  }

  async Get(storeName, key) {
    this.db = await openDB<any>('Lavi-QTVR-DB', 1);
    return await this.db.get(storeName, key);
  }

  async Delete(storeName, key) {
    return await this.db.delete(storeName, key);
  }
}
