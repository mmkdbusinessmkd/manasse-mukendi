'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '../../lib/admin/supabase';
import { entities, Entity, routes, schemas, uuid, today } from '../../lib/admin/model';

export type SaveState={error:string;fields:Record<string,string>;values:Record<string,string>;attempt:number};
const fail=(error:string,values:Record<string,string>,attempt:number,fields:Record<string,string>={}):SaveState=>({error,values,fields,attempt});
function dbMessage(code:string) {
  if(code==='23503'||code==='23001')return 'Cette fiche est liée à d’autres éléments, ou la mission ne correspond pas au client. Vérifie les liens. Pour conserver l’historique, privilégie le statut « Terminé ».';
  if(code==='23514')return 'Vérifie les dates et les montants. Un paiement ne peut pas dépasser le solde, ni une mission descendre sous le montant déjà reçu. Une livraison doit être datée.';
  return 'Enregistrement impossible. Vérifie la connexion et réessaie ; aucune confirmation n’a été reçue.';
}
export async function saveRecord(entity:Entity,id:string|null,previous:SaveState,form:FormData):Promise<SaveState>{
  const {db,user}=await requireAdmin();
  const values=Object.fromEntries([...form.entries()].filter((pair):pair is [string,string]=>typeof pair[1]==='string'));
  const attempt=previous.attempt+1;
  if(!entities.includes(entity)|| (id&&!uuid.safeParse(id).success))return fail('Demande invalide.',values,attempt);
  const parsed=schemas[entity].safeParse(values);
  if(!parsed.success)return fail('Vérifie les champs indiqués.',values,attempt,Object.fromEntries(parsed.error.issues.map(issue=>[String(issue.path[0]),issue.message])));
  const payload:Record<string,unknown>={...parsed.data,owner_id:user.id};
  if(entity==='payments'){
    if(String(payload.paid_on)>today())return fail('La réception d’un paiement ne peut pas être future.',values,attempt,{paid_on:'Choisis une date passée ou aujourd’hui.'});
    const {data:mission,error}=await db.from('missions').select('currency').eq('id',String(payload.mission_id)).eq('client_id',String(payload.client_id)).eq('owner_id',user.id).single();
    if(error||!mission)return fail('Choisis une mission appartenant à ce client.',values,attempt,{mission_id:'Mission invalide.'});
    payload.currency=mission.currency;
  }
  const creationId=values.creation_id;
  if(!id&&!uuid.safeParse(creationId).success)return fail('Recharge le formulaire avant de réessayer.',values,attempt);
  if(id&&!zVersion(values.version))return fail('Recharge la fiche avant de la modifier.',values,attempt);
  const query=id ? db.from(entity).update(payload).eq('id',id).eq('owner_id',user.id).eq('updated_at',values.version) : db.from(entity).insert({...payload,id:creationId});
  const {data,error}=await query.select('id');
  if(error){
    // A retry of the same create submission must not duplicate a payment.
    if(!id&&error.code==='23505'){
      const {data:existing}=await db.from(entity).select('id').eq('id',creationId).eq('owner_id',user.id).maybeSingle();
      if(existing){revalidatePath('/admin','layout');redirect(`/admin/${routes[entity]}/${existing.id}`);}
    }
    return fail(dbMessage(error.code),values,attempt);
  }
  if(!data?.length)return fail('Cette fiche a changé ou a été supprimée. Recharge-la avant de réessayer pour ne pas écraser une autre modification.',values,attempt);
  revalidatePath('/admin','layout');
  redirect(`/admin/${routes[entity]}/${data[0].id}`);
}
function zVersion(value:string){return typeof value==='string'&&value.length<=40&&!isNaN(Date.parse(value));}

export async function deleteRecord(entity:Entity,id:string,previous:SaveState,form:FormData):Promise<SaveState>{
  const {db,user}=await requireAdmin();
  if(!entities.includes(entity)||!uuid.safeParse(id).success||form.get('confirm')!=='yes')return fail('Coche la confirmation avant de supprimer.',{},previous.attempt+1);
  const version=String(form.get('version')||'');
  if(!zVersion(version))return fail('Recharge la fiche.',{},previous.attempt+1);
  const {data,error}=await db.from(entity).delete().eq('id',id).eq('owner_id',user.id).eq('updated_at',version).select('id');
  if(error)return fail(dbMessage(error.code),{},previous.attempt+1);
  if(!data?.length)return fail('La fiche a changé. Recharge-la avant de réessayer.',{},previous.attempt+1);
  revalidatePath('/admin','layout');redirect(`/admin/${routes[entity]}`);
}
