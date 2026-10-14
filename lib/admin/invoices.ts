import 'server-only';
import { notFound } from 'next/navigation';
import { requireAdmin } from './supabase';
import { uuid } from './model';
import { billingDefaults, Billing, Invoice } from './invoice-model';
export async function getBilling():Promise<Billing> {
  const {db,user}=await requireAdmin();
  const {data,error}=await db.from('invoice_settings').select('name,email,phone,address,registration,tax_note,payment_details').eq('owner_id',user.id).maybeSingle();
  if(error)throw new Error('Les informations de facturation sont indisponibles.');
  return data || billingDefaults;
}
export async function getInvoice(id:string):Promise<Invoice> {
  const {db,user}=await requireAdmin();
  if(!uuid.safeParse(id).success)notFound();
  const {data,error}=await db.from('invoices').select('*').eq('id',id).eq('owner_id',user.id).maybeSingle();
  if(error)throw new Error('La facture est momentanément indisponible.');
  if(!data)notFound();
  return data;
}
export async function listInvoices(client?:string,mission?:string):Promise<Invoice[]> {
  const {db,user}=await requireAdmin();
  let query=db.from('invoices').select('*').eq('owner_id',user.id).order('created_at',{ascending:false});
  if(client)query=query.eq('client_id',client);
  if(mission)query=query.eq('mission_id',mission);
  const {data,error}=await query.limit(501);
  if(error)throw new Error('Les factures sont momentanément indisponibles.');
  if(data.length>500)throw new Error('Plus de 500 factures : filtrez par client pour consulter un historique complet.');
  return data;
}
