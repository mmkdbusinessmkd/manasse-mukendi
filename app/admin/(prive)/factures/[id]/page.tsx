import Link from 'next/link';
import { getInvoice } from '../../../../../lib/admin/invoices';
import { loadData } from '../../../../../lib/admin/data';
import { invoiceBalance,invoiceReply,invoiceDocumentTitle } from '../../../../../lib/admin/invoice-model';
import { moneyLabel,dateLabel } from '../../../../../lib/admin/model';
import { PageHeading,Records } from '../../../Views';
import { DraftInvoiceForm,IssueInvoiceForm } from '../../../InvoiceForms';
import s from '../../../admin.module.css';
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{enregistre?:string}>}){
 const inv=await getInvoice((await params).id), data=await loadData(), query=await searchParams;
 const payments=data.payments.filter(p=>p.mission_id===inv.mission_id);
 const balance=invoiceBalance(inv,payments);
 const title=invoiceDocumentTitle(inv,payments,inv.state==='draft'?'draft':'invoice');
 const reply=invoiceReply(inv,payments), proformaReply=invoiceReply(inv,payments,'proforma');
 const paymentUrl=`/admin/paiements/nouveau?client=${inv.client_id}&mission=${inv.mission_id}`;
 return <>
  <Link href="/admin/factures" className={s.textLink}>Retour aux factures</Link>
  <PageHeading title={inv.number?`${title} · ${inv.number}`:'Pro forma et facture'} description={`${inv.customer.company||inv.customer.name} · ${inv.description}`}/>
  {query.enregistre&&<p role="status" className={s.notice}>Informations enregistrées. Vos documents sont à jour.</p>}
  <div className={s.stats}>{[['Total convenu',Number(inv.amount_cents)],['Paiements reçus',balance.paid],['Reste à régler',balance.remaining]].map(([label,value])=><div className={s.stat} key={label}><span>{label}</span><strong>{moneyLabel(Number(value),inv.currency)}</strong></div>)}</div>
  {inv.state==='draft'&&<section className={s.panel}>
   <h2>Informations du document</h2>
   <p>Les adresses et identifiants sont facultatifs. Seuls les champs marqués d’un astérisque sont nécessaires pour finaliser la facture.</p>
   <Link href="/admin/factures/parametres" className={s.textLink}>Mes coordonnées de facturation</Link>
   <DraftInvoiceForm invoice={inv}/>
  </section>}
  <section className={s.panel}>
   <h2>1. Avant paiement : pro forma</h2>
   <p>Présentez la prestation et le montant au client. La pro forma n’est pas une facture définitive ni une preuve de paiement.</p>
   <div className={s.actions}>
    <a className={s.primary} href={`/admin/factures/${inv.id}/pdf?document=proforma`}>Télécharger la pro forma</a>
    {proformaReply.email&&<a className={s.secondary} href={proformaReply.email}>Préparer l’e-mail</a>}
    {proformaReply.whatsapp&&<a className={s.secondary} href={proformaReply.whatsapp} target="_blank" rel="noreferrer">Préparer WhatsApp</a>}
   </div>
   <p className={s.meta}>Téléchargez le PDF puis joignez-le au message. Aucun document n’est envoyé automatiquement. La pro forma reflète les dernières informations enregistrées.</p>
  </section>
  <section className={s.panel}>
   <h2>2. Après paiement : facture</h2>
   <p>{balance.remaining===0?'Le montant total est enregistré comme reçu. La facture définitive portera la mention « Facture acquittée ».':balance.paid>0?'Un acompte est enregistré. La facture indiquera le montant reçu et le solde restant ; elle sera acquittée une fois le paiement complet enregistré.':'Enregistrez le paiement réellement reçu. La mention « Facture acquittée » apparaîtra seulement lorsque le total aura été payé.'}</p>
   <div className={s.actions}>
    <Link className={s.secondary} href={paymentUrl}>Enregistrer un paiement reçu</Link>
    <a className={s.primary} href={`/admin/factures/${inv.id}/pdf`}>{inv.state==='draft'?'Vérifier l’aperçu de la facture':`Télécharger ${title==='Facture acquittée'?'la facture acquittée':'la facture'}`}</a>
   </div>
   {inv.state==='draft'?<><h3>Finaliser la facture</h3><IssueInvoiceForm invoice={inv}/></>:<>
    <p>Émise le {dateLabel(inv.issued_on)} · Date limite de paiement : {dateLabel(inv.due_date)}</p>
    <p className={s.meta}>Les informations de la facture sont figées. Le même numéro est conservé après paiement ; le PDF indique alors la situation actualisée.</p>
    <div className={s.actions}>{reply.email&&<a className={s.secondary} href={reply.email}>Préparer l’e-mail</a>}{reply.whatsapp&&<a className={s.secondary} href={reply.whatsapp} target="_blank" rel="noreferrer">Préparer WhatsApp</a>}</div>
    <p className={s.meta}>Joignez vous-même le PDF au message : ces boutons ne l’attachent pas et ne l’envoient pas automatiquement.</p>
   </>}
  </section>
  <section className={s.panel}><h2>Paiements de cette mission</h2><Records entity="payments" rows={payments} data={data}/><Link className={s.textLink} href={`/admin/missions/${inv.mission_id}`}>Voir la mission</Link></section>
 </>;
}
