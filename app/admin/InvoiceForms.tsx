'use client';
import { useActionState } from 'react';
import { Billing,Invoice } from '../../lib/admin/invoice-model';
import { Row,moneyLabel } from '../../lib/admin/model';
import { saveBilling,prepareInvoice,saveInvoice,issueInvoice,InvoiceState } from './invoice-actions';
import s from './admin.module.css';
const empty:InvoiceState={error:'',saved:false};
function Feedback({state}:{state:InvoiceState}){return <>{state.error&&<p role="alert" className={s.error}>{state.error}</p>}{state.saved&&<p role="status">Informations enregistrées.</p>}</>;}
export function BillingForm({billing}:{billing:Billing}){
 const [state,action,pending]=useActionState(saveBilling,empty);
 const fields:[keyof Billing,string,number][]=[['name','Nom professionnel',160],['email','E-mail',254],['phone','Téléphone / WhatsApp',40],['address','Adresse professionnelle complète',600],['registration','Identifiants d’entreprise / fiscaux (si applicables)',500],['tax_note','Mention fiscale applicable à vos prestations',1000],['payment_details','Instructions de règlement',1500]];
 return <form action={action} className={s.form}><fieldset className={s.fields} disabled={pending}><legend className={s.srOnly}>Informations de facturation</legend>{fields.map(([name,label,max])=><label key={name} className={max>300?s.wide:undefined}><span>{label}</span>{max>300?<textarea name={name} defaultValue={billing[name]} maxLength={max} rows={3}/>:<input name={name} type={name==='email'?'email':'text'} defaultValue={billing[name]} maxLength={max} required/>}</label>)}</fieldset><p className={s.meta}>Aucun taux ni régime fiscal n’est présumé. Renseignez la mention adaptée à votre situation, avec votre comptable si nécessaire. Les montants proviennent du total convenu de la mission ; le site ne calcule pas de TVA supplémentaire.</p><Feedback state={state}/><button className={s.primary} disabled={pending}>{pending?'Enregistrement…':'Enregistrer mes informations'}</button></form>;
}
export function PrepareInvoiceForm({missions,initialMission}:{missions:Row[];initialMission?:string}){
 const [state,action,pending]=useActionState(prepareInvoice,empty);
 return <form action={action} className={s.form}><label><span>Mission à facturer</span><select name="mission_id" required defaultValue={initialMission||''}><option value="">Choisir une mission</option>{missions.map(m=><option value={m.id} key={m.id}>{m.title} · {moneyLabel(Number(m.amount_cents),String(m.currency))}</option>)}</select></label><p className={s.meta}>Une facture par mission. Si elle existe déjà, elle sera ouverte sans doublon. Pour un suivi mensuel, créez une mission distincte par période facturée.</p><Feedback state={state}/><button className={s.primary} disabled={pending||!missions.length}>{pending?'Préparation…':'Préparer le brouillon'}</button></form>;
}
export function DraftInvoiceForm({invoice}:{invoice:Invoice}){
 const [state,action,pending]=useActionState(saveInvoice.bind(null,invoice.id,invoice.updated_at),empty);
 return <form action={action} className={s.form}><fieldset className={s.fields} disabled={pending}><legend className={s.srOnly}>Compléter le brouillon</legend><label className={s.wide}><span>Prestation facturée *</span><textarea name="description" defaultValue={invoice.description} rows={4} required maxLength={3000}/></label><label className={s.wide}><span>Adresse de facturation du client *</span><textarea name="client_address" defaultValue={invoice.client_address} rows={3} maxLength={600}/></label><label><span>Identifiants du client (si applicables)</span><textarea name="client_registration" defaultValue={invoice.client_registration} rows={2} maxLength={500}/></label><label><span>Échéance de paiement *</span><input type="date" name="due_date" defaultValue={invoice.due_date||''}/></label></fieldset><p className={s.meta}>Enregistrer actualise aussi les coordonnées du client, les informations de facturation et le montant depuis la mission. Relisez ensuite l’aperçu avant émission.</p><Feedback state={state}/><button className={s.primary} disabled={pending}>{pending?'Enregistrement…':'Enregistrer et actualiser le brouillon'}</button></form>;
}
export function IssueInvoiceForm({invoice}:{invoice:Invoice}){
 const [state,action,pending]=useActionState(issueInvoice.bind(null,invoice.id,invoice.updated_at),empty);
 return <form action={action}><label className={s.check}><input type="checkbox" name="confirm" value="yes" required/>J’ai enregistré et relu l’aperçu PDF, vérifié les coordonnées, la prestation, les montants et les mentions applicables.</label><p className={s.meta}>L’émission attribue un numéro définitif et fige la facture. Elle n’envoie aucun document au client. Pour une correction après émission, ne supprimez pas la facture : faites établir le document correctif adapté.</p><Feedback state={state}/><button className={s.primary} disabled={pending}>{pending?'Émission…':'Émettre la facture numérotée'}</button></form>;
}
