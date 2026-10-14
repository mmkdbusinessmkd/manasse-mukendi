import { z } from 'zod';
import { date, Row } from './model';
export const billingDefaults = { name: 'Manassé Mukendi', email: 'contact@manasse-mukendi.com', phone: '+243838318812', address: '', registration: '', tax_note: '', payment_details: '' };
export const billingSchema = z.object({ name:z.string().trim().min(1).max(160), email:z.email().max(254), phone:z.string().trim().min(1).max(40), address:z.string().trim().max(600), registration:z.string().trim().max(500), tax_note:z.string().trim().max(1000), payment_details:z.string().trim().max(1500) });
export type Billing = z.infer<typeof billingSchema>;
export const draftSchema = z.object({ description:z.string().trim().min(1).max(3000), client_address:z.string().trim().max(600), client_registration:z.string().trim().max(500), due_date:date });
export type Invoice = { id:string; owner_id:string; mission_id:string; client_id:string; state:'draft'|'issued'; number:string|null; issued_on:string|null; due_date:string|null; description:string; client_address:string; client_registration:string; issuer:Partial<Billing>; customer:{name:string; company:string; email:string; phone:string}; amount_cents:number; currency:string; updated_at:string; created_at:string };
export function invoiceBalance(invoice:Invoice,payments:Row[]) {
  const paid=payments.filter(p=>p.mission_id===invoice.mission_id).reduce((n,p)=>n+Number(p.amount_cents),0);
  return { paid, remaining:Math.max(0,Number(invoice.amount_cents)-paid), label:invoice.state==='draft'?'Brouillon':paid>=Number(invoice.amount_cents)?'Payée':paid>0?'Partiellement payée':'À régler' };
}
export function invoiceReply(invoice:Invoice) {
  const text=`Bonjour ${invoice.customer.name},\n\nVeuillez trouver ma facture ${invoice.number || '(brouillon)'} concernant notre mission.\n\nBien à vous,\n${invoice.issuer.name || 'Manassé Mukendi'}`;
  const phone=invoice.customer.phone.replace(/[\s().-]/g,'').replace(/^00/,'+');
  return { email:invoice.customer.email?`mailto:${encodeURIComponent(invoice.customer.email)}?subject=${encodeURIComponent(`Facture ${invoice.number || ''}`)}&body=${encodeURIComponent(text)}`:null, whatsapp:/^\+[1-9]\d{7,14}$/.test(phone)?`https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(text)}`:null };
}
