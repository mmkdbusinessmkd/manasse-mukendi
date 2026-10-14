import Link from 'next/link';
import { loadData } from '../../../../lib/admin/data';
import { listInvoices } from '../../../../lib/admin/invoices';
import { invoiceBalance } from '../../../../lib/admin/invoice-model';
import { moneyLabel,uuid } from '../../../../lib/admin/model';
import { PageHeading,Empty } from '../../Views';
import { PrepareInvoiceForm } from '../../InvoiceForms';
import s from '../../admin.module.css';
export default async function Page({searchParams}:{searchParams:Promise<{client?:string;mission?:string}>}){
 const query=await searchParams;
 const client=uuid.safeParse(query.client).success?query.client:undefined;
 const mission=uuid.safeParse(query.mission).success?query.mission:undefined;
 const [data,invoices]=await Promise.all([loadData(),listInvoices(client,mission)]);
 const missions=data.missions.filter(m=>(!client||m.client_id===client)&&(!mission||m.id===mission));
 return <><PageHeading title="Factures" description="Préparez une facture, validez-la puis suivez les paiements réellement reçus." action={<Link className={s.secondary} href="/admin/factures/parametres">Informations de facturation</Link>}/><section className={s.panel}><h2>Préparer une facture</h2><PrepareInvoiceForm missions={missions} initialMission={mission}/>{!missions.length&&<Link className={s.textLink} href="/admin/missions/nouveau">Créer une mission</Link>}</section><section className={s.panel}><div className={s.sectionHeading}><h2>Historique {client?'du client':mission?'de la mission':''}</h2>{(client||mission)&&<Link className={s.textLink} href="/admin/factures">Toutes les factures</Link>}</div>{invoices.length?<ul className={s.records}>{invoices.map(inv=>{const balance=invoiceBalance(inv,data.payments);return <li key={inv.id}><div><Link className={s.recordTitle} href={`/admin/factures/${inv.id}`}>{inv.number||'Brouillon'} · {inv.customer.company||inv.customer.name}</Link><p className={s.meta}>{inv.description.slice(0,160)}</p></div><div className={s.recordEnd}><span className={s.badge}>{balance.label}</span><strong>{moneyLabel(Number(inv.amount_cents),inv.currency)}</strong><small>Solde : {moneyLabel(balance.remaining,inv.currency)}</small></div></li>;})}</ul>:<Empty text="Aucune facture pour le moment. Préparez-en une depuis une mission."/>}</section></>;
}
