'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '../../lib/admin/supabase';
import { billingSchema,draftSchema } from '../../lib/admin/invoice-model';
import { uuid } from '../../lib/admin/model';
export type InvoiceState={error:string;saved:boolean};
const fail=(error:string):InvoiceState=>({error,saved:false});
function message(code:string){return code==='P0409'?'Les informations ont changé. Rechargez la page, enregistrez le brouillon puis relisez-le.':code==='23514'?'Complétez les adresses et une échéance à partir d’aujourd’hui. Vérifiez aussi que le montant de la mission est positif.':'Enregistrement non confirmé. Réessayez sans créer une autre mission.';}
export async function saveBilling(_:InvoiceState,form:FormData):Promise<InvoiceState>{
  const {db,user}=await requireAdmin(); const parsed=billingSchema.safeParse(Object.fromEntries(form));
  if(!parsed.success)return fail('Vérifiez les coordonnées et la longueur des champs.');
  const {error}=await db.from('invoice_settings').upsert({...parsed.data,owner_id:user.id});
  if(error)return fail('Les informations n’ont pas pu être enregistrées.');
  revalidatePath('/admin/factures','layout');return {error:'',saved:true};
}
export async function prepareInvoice(_:InvoiceState,form:FormData):Promise<InvoiceState>{
  const {db}=await requireAdmin(); const mission=uuid.safeParse(form.get('mission_id'));
  if(!mission.success)return fail('Choisissez une mission.');
  const {data,error}=await db.rpc('prepare_invoice',{p_mission:mission.data});
  if(error)return fail(message(error.code));
  revalidatePath('/admin','layout');redirect(`/admin/factures/${data}`);
}
export async function saveInvoice(id:string,version:string,_:InvoiceState,form:FormData):Promise<InvoiceState>{
  const {db}=await requireAdmin(); const parsed=draftSchema.safeParse(Object.fromEntries(form));
  if(!uuid.safeParse(id).success||!z.iso.datetime({offset:true}).safeParse(version).success||!parsed.success)return fail('Vérifiez les champs du brouillon.');
  const {data,error}=await db.rpc('save_invoice_draft',{p_id:id,p_version:version,p_description:parsed.data.description,p_address:parsed.data.client_address,p_registration:parsed.data.client_registration,p_due:parsed.data.due_date});
  if(error)return fail(message(error.code));
  revalidatePath('/admin','layout');redirect(`/admin/factures/${data}?enregistre=1`);
}
export async function issueInvoice(id:string,version:string,_:InvoiceState,form:FormData):Promise<InvoiceState>{
  const {db}=await requireAdmin();
  if(form.get('confirm')!=='yes'||!uuid.safeParse(id).success||!z.iso.datetime({offset:true}).safeParse(version).success)return fail('Relisez le brouillon et cochez la confirmation.');
  const {data,error}=await db.rpc('issue_invoice',{p_id:id,p_version:version});
  if(error)return fail(message(error.code));
  revalidatePath('/admin','layout');redirect(`/admin/factures/${data}`);
}
