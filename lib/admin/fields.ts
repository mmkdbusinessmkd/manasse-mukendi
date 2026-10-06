import { Entity } from './model';
export type Field={name:string;label:string;type?:'text'|'email'|'tel'|'date'|'textarea'|'money'|'select'|'client'|'mission'|'url';required?:boolean;options?:string[];max?:number;hint?:string};
const client:Field={name:'client_id',label:'Client',type:'client',required:true};
const mission:Field={name:'mission_id',label:'Mission',type:'mission'};
const notes:Field={name:'notes',label:'Notes internes',type:'textarea'};
const title:Field={name:'title',label:'Titre',required:true,max:180};
const description:Field={name:'description',label:'Description',type:'textarea'};
const period:Field[]=[{name:'start_date',label:'Début',type:'date'},{name:'end_date',label:'Fin',type:'date'}];
export const fields:Record<Entity,Field[]>={
  clients:[{name:'name',label:'Nom du contact',required:true,max:160},{name:'company',label:'Entreprise ou marque',max:160},{name:'whatsapp',label:'Téléphone / WhatsApp',type:'tel',max:40},{name:'email',label:'Adresse e-mail',type:'email',max:254},{name:'client_type',label:'Type de client',max:100},{name:'status',label:'Statut',type:'select',options:['actif','pause','termine']},...period,notes],
  missions:[client,title,description,{name:'service',label:'Service vendu',max:160},...period,{name:'amount_cents',label:'Montant total convenu',type:'money',required:true},{name:'currency',label:'Devise',type:'select',options:['USD','CDF','EUR']},{name:'due_date',label:'Prochaine échéance de paiement',type:'date'},{name:'status',label:'Statut',type:'select',options:['actif','termine','suspendu']},{name:'frequency',label:'Fréquence',type:'select',options:['ponctuel','mensuel'],hint:'Mensuel décrit la collaboration. Le montant reste le total de cette mission ; aucun renouvellement automatique.'},{name:'payment_terms',label:'Modalités de paiement',type:'textarea',max:3000},notes],
  tasks:[client,mission,title,description,{name:'priority',label:'Priorité',type:'select',options:['normale','faible','urgente']},{name:'due_date',label:'Date limite',type:'date'},{name:'status',label:'Statut',type:'select',options:['a_faire','en_cours','termine']},notes],
  deliverables:[client,mission,title,{name:'content_type',label:'Type de contenu',max:100},{name:'planned_on',label:'Date prévue',type:'date'},{name:'delivered_on',label:'Date de livraison',type:'date'},{name:'status',label:'Statut',type:'select',options:['a_faire','en_cours','livre','validation','valide']},{name:'url',label:'Lien du livrable',type:'url',max:2000},notes],
  payments:[client,{...mission,required:true},{name:'amount_cents',label:'Montant reçu',type:'money',required:true,hint:'Enregistrer uniquement un paiement effectivement reçu. La devise est celle de la mission.'},{name:'paid_on',label:'Date de réception',type:'date',required:true},{name:'method',label:'Mode de paiement',max:100},notes],
  notes:[client,mission,title,{name:'body',label:'Note',type:'textarea',required:true}],
};
