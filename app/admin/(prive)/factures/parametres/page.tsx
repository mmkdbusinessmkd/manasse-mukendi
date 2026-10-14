import Link from 'next/link';
import { getBilling } from '../../../../../lib/admin/invoices';
import { BillingForm } from '../../../InvoiceForms';
import { PageHeading } from '../../../Views';
import s from '../../../admin.module.css';
export default async function Page(){const billing=await getBilling();return <><PageHeading title="Informations de facturation" description="Ces informations restent privées et apparaissent sur vos prochains documents."/><Link className={s.textLink} href="/admin/factures">Retour aux factures</Link><section className={s.panel}><BillingForm billing={billing}/></section><p className={s.meta}>Les factures déjà émises conservent leurs coordonnées d’origine. Après modification, actualisez chaque brouillon avant de l’émettre.</p></>;}
