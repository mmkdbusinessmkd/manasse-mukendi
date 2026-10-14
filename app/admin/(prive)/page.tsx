import { loadData } from '../../../lib/admin/data';
import { Dashboard } from '../Views';
import Link from 'next/link';
import s from '../admin.module.css';
export default async function Page(){return <><div className={s.panel}><h2>Demandes du site</h2><p>Consultez les nouveaux messages et préparez vos réponses par e-mail ou WhatsApp.</p><Link href="/admin/demandes?statut=nouveau" className={s.primary}>Voir les nouvelles demandes</Link></div><Dashboard data={await loadData()}/></>;}
