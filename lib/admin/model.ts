import { z } from 'zod';

export const entities = ['clients','missions','tasks','deliverables','payments','notes'] as const;
export type Entity = typeof entities[number];
export const routes: Record<Entity,string> = {clients:'clients',missions:'missions',tasks:'taches',deliverables:'livrables',payments:'paiements',notes:'notes'};
export const titles: Record<Entity,string> = {clients:'Clients',missions:'Missions',tasks:'Tâches',deliverables:'Livrables',payments:'Paiements',notes:'Notes internes'};
export type Row = { id:string; owner_id:string; created_at:string; updated_at:string; [key:string]: string|number|null };
export type Data = Record<Entity,Row[]>;
export const labels: Record<string,string> = {actif:'Actif',termine:'Terminé',pause:'En pause',suspendu:'Suspendu',a_faire:'À faire',en_cours:'En cours',livre:'Livré',validation:'En attente de validation',valide:'Validé',faible:'Faible',normale:'Normale',urgente:'Urgente',ponctuel:'Ponctuel',mensuel:'Mensuel',paye:'Payé',partiel:'Partiellement payé',attente:'En attente',retard:'En retard'};
const text = (max=10000) => z.string().trim().max(max).default('');
const required = (max=180) => z.string().trim().min(1,'Ce champ est obligatoire.').max(max);
export const uuid = z.string().uuid();
const optionalId = z.union([uuid,z.literal('')]).transform(v=>v||null);
export const date = z.string().refine(v=>!v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && Number(v.slice(0,4))>=1900 && Number(v.slice(0,4))<=2200 && !isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10)===v),'Date invalide.').transform(v=>v||null);
export function cents(value:string) {
  const normalized=value.trim().replace(',','.');
  if(!/^\d{1,9}(\.\d{1,2})?$/.test(normalized)) return NaN;
  const [whole,fraction='']=normalized.split('.');
  return Number(whole)*100+Number(fraction.padEnd(2,'0'));
}
const money = z.string().transform(cents).pipe(z.number().int().min(0).max(99999999999));
const relation={client_id:uuid,mission_id:optionalId};
const period={start_date:date,end_date:date};
const validPeriod=(v:{start_date:string|null;end_date:string|null})=>!v.start_date||!v.end_date||v.end_date>=v.start_date;
const periodError={message:'La fin doit suivre le début.',path:['end_date']};
export const schemas = {
  clients:z.object({name:required(160),company:text(160),whatsapp:text(40),email:text(254).refine(v=>!v||z.email().safeParse(v).success,'E-mail invalide.'),client_type:text(100),status:z.enum(['actif','termine','pause']),...period,notes:text()}).refine(validPeriod,periodError),
  missions:z.object({client_id:uuid,title:required(),description:text(),service:text(160),...period,due_date:date,amount_cents:money,currency:z.enum(['USD','EUR','CDF']),status:z.enum(['actif','termine','suspendu']),frequency:z.enum(['ponctuel','mensuel']),payment_terms:text(3000),notes:text()}).refine(validPeriod,periodError),
  tasks:z.object({...relation,title:required(),description:text(),priority:z.enum(['faible','normale','urgente']),due_date:date,status:z.enum(['a_faire','en_cours','termine']),notes:text()}),
  deliverables:z.object({...relation,title:required(),content_type:text(100),planned_on:date,delivered_on:date,status:z.enum(['a_faire','en_cours','livre','validation','valide']),url:text(2000).refine(v=>!v||(z.url().safeParse(v).success&&/^https?:\/\//i.test(v)),'Utilise un lien http ou https.'),notes:text()}).refine(v=>!['livre','validation','valide'].includes(v.status)||Boolean(v.delivered_on),{message:'Indique la date de livraison.',path:['delivered_on']}),
  payments:z.object({client_id:uuid,mission_id:uuid,amount_cents:money.refine(v=>v>0,'Le montant doit être positif.'),paid_on:date.refine(v=>v!==null,'Indique la date de paiement.'),method:text(100),notes:text()}),
  notes:z.object({...relation,title:required(),body:required(10000)}),
};
export function today(now=new Date()) { return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Kinshasa',year:'numeric',month:'2-digit',day:'2-digit'}).format(now); }
export function weekEnd(day:string) { const d=new Date(`${day}T12:00:00Z`); d.setUTCDate(d.getUTCDate()+(7-d.getUTCDay())%7); return d.toISOString().slice(0,10); }
export function dateLabel(value:unknown) { return typeof value==='string'&&value ? new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(value)) : 'Non renseignée'; }
export function moneyLabel(amount:number,currency:string) { return new Intl.NumberFormat('fr-FR',{style:'currency',currency,maximumFractionDigits:2}).format(amount/100); }
export function missionBalance(mission:Row,payments:Row[],day=today()) {
  const paid=payments.filter(p=>p.mission_id===mission.id).reduce((sum,p)=>sum+Number(p.amount_cents),0);
  const remaining=Number(mission.amount_cents)-paid;
  const status=remaining<=0?'paye':mission.due_date&&String(mission.due_date)<day?'retard':paid>0?'partiel':'attente';
  return {paid,remaining,status};
}
export function groupedMoney(rows: {currency:string;amount:number}[]) {
  const totals:Record<string,number>={}; for(const row of rows) totals[row.currency]=(totals[row.currency]||0)+row.amount;
  return Object.entries(totals).map(([currency,amount])=>moneyLabel(amount,currency)).join(' · ')||'Aucun montant';
}
export function rowTitle(row:Row) { return String(row.name||row.title||'Paiement'); }
export function isDelivered(row:Row) { return ['livre','validation','valide'].includes(String(row.status)); }
