import Link from 'next/link';
import { Entity,Row } from '../../lib/admin/model';
import s from './admin.module.css';
export default function InvoiceShortcut({entity,row}:{entity:Entity;row:Row}){
 if(!['clients','missions','payments'].includes(entity))return null;
 const query=entity==='clients'?`client=${row.id}`:`mission=${entity==='missions'?row.id:row.mission_id}`;
 return <section className={s.panel}><h2>Facturation</h2><p>Retrouvez les factures et préparez le PDF depuis la mission, sans ressaisir les paiements.</p><Link href={`/admin/factures?${query}`} className={s.primary}>Voir ou préparer une facture</Link></section>;
}
