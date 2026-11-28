import { assertOwner } from './workspace'
import { parseBackup } from './workspace-backup'
// Append-only checkpoint archive; no deletion or overwrite.
export class BackupVault {
  constructor(private factory: IDBFactory, private owner: string) { assertOwner(owner) }
  private open(): Promise<IDBDatabase> {
    return new Promise((resolve,reject)=>{
      const req=this.factory.open('aetheria-next-backup-vault-v1',1)
      let blocked=false
      req.onupgradeneeded=()=>{if(blocked){req.transaction?.abort();return} req.result.createObjectStore('checkpoints',{autoIncrement:true}).createIndex('owner','owner')}
      req.onblocked=()=>{blocked=true;reject(Error('Backup vault blocked'))}
      req.onerror=()=>reject(Error('Backup vault unavailable'))
      req.onsuccess=()=>{if(blocked){req.result.close();return} req.result.onversionchange=()=>req.result.close(); resolve(req.result)}
    })
  }
  async retain(text: string): Promise<void> {
    parseBackup(text, this.owner)
    const db = await this.open()
    try {
      await new Promise<void>((resolve,reject)=>{
        const tx=db.transaction('checkpoints','readwrite')
        tx.objectStore('checkpoints').add({owner:this.owner,text})
        tx.oncomplete=()=>resolve()
        tx.onabort=()=>reject(Error('Recovery checkpoint not retained'))
      })
    } finally {db.close()}
  }
  async latest(): Promise<string|null> {
    const db=await this.open()
    try {
      return await new Promise((resolve,reject)=>{
        const tx=db.transaction('checkpoints','readonly')
        const req=tx.objectStore('checkpoints').index('owner').openCursor(IDBKeyRange.only(this.owner),'prev')
        let result:string|null=null
        req.onsuccess=()=>{result=req.result?.value.text??null}
        tx.oncomplete=()=>resolve(result)
        tx.onabort=()=>reject(Error('Recovery checkpoint unavailable'))
      })
    } finally {db.close()}
  }
}
