'use client';
import { useActionState, useState } from 'react';
import { Entity, labels, Row, routes, today } from '../../lib/admin/model';
import { fields } from '../../lib/admin/fields';
import { deleteRecord, saveRecord, SaveState } from './actions';
import s from './admin.module.css';

type Option={id:string;label:string;client_id?:string;currency?:string};
type Props={entity:Entity;row?:Row;clients:Option[];missions:Option[];creationId:string;initialClient?:string;initialMission?:string};
const empty:SaveState={error:'',fields:{},values:{},attempt:0};
export default function RecordForm(props:Props){
  const {entity,row}=props;
  const [state,action,pending]=useActionState(saveRecord.bind(null,entity,row?.id||null),empty);
  return <form action={action} className={s.form}>
    <input type="hidden" name="creation_id" value={props.creationId}/><input type="hidden" name="version" value={String(row?.updated_at||'')}/>
    <FormFields key={state.attempt} {...props} state={state} pending={pending}/>
    {state.error&&<p role="alert" className={s.error}>{state.error}</p>}
    <div className={s.actions}><button className={s.primary} disabled={pending}>{pending?'Enregistrement…':row?'Enregistrer les modifications':'Créer la fiche'}</button><a className={s.secondary} href={`/admin/${routes[entity]}`}>Retour à la liste</a></div>
  </form>;
}
function FormFields({entity,row,clients,missions,initialClient,initialMission,state,pending}:Props&{state:SaveState;pending:boolean}){
  const initial=(name:string)=>state.values[name]??(row?.[name]!=null ? name==='amount_cents'?(Number(row[name])/100).toFixed(2):String(row[name]) : name==='client_id'?initialClient||'':name==='mission_id'?initialMission||'':name==='paid_on'?today():'');
  const [clientId,setClientId]=useState(initial('client_id'));
  const [missionId,setMissionId]=useState(initial('mission_id'));
  const linked=missions.filter(m=>m.client_id===clientId);
  return <fieldset disabled={pending} className={s.fields}>
    <legend className={s.srOnly}>Informations de la fiche</legend>
    {fields[entity].map(field=>{
      const id=`field-${field.name}`;
      const message=state.fields[field.name];
      const common={id,name:field.name,required:field.required,'aria-invalid':Boolean(message),'aria-describedby':message?`${id}-error`:field.hint?`${id}-hint`:undefined};
      const immutable=entity==='payments'&&Boolean(row)&&(field.type==='client'||field.type==='mission');
      let control;
      if(field.type==='client')control=<><select {...common} value={clientId} disabled={immutable} onChange={e=>{setClientId(e.target.value);setMissionId('');}}><option value="">Choisir un client</option>{clients.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select>{immutable&&<input type="hidden" name={field.name} value={clientId}/>}</>;
      else if(field.type==='mission')control=<><select {...common} value={missionId} disabled={immutable} onChange={e=>setMissionId(e.target.value)}><option value="">{field.required?'Choisir une mission':'Sans mission précise'}</option>{linked.map(o=><option key={o.id} value={o.id}>{o.label}{entity==='payments'?` · ${o.currency}`:''}</option>)}</select>{immutable&&<input type="hidden" name={field.name} value={missionId}/>}</>;
      else if(field.type==='select')control=<select {...common} defaultValue={initial(field.name)||field.options?.[0]}>{field.options?.map(v=><option key={v} value={v}>{labels[v]||v}</option>)}</select>;
      else if(field.type==='textarea')control=<textarea {...common} defaultValue={initial(field.name)} maxLength={field.max||10000} rows={4}/>;
      else control=<input {...common} type={field.type==='money'?'text':field.type||'text'} inputMode={field.type==='money'?'decimal':undefined} defaultValue={initial(field.name)} maxLength={field.max||180} min={field.type==='date'?'1900-01-01':undefined} max={field.name==='paid_on'?today():field.type==='date'?'2200-12-31':undefined}/>;
      return <label key={field.name} className={field.type==='textarea'?s.wide:undefined} htmlFor={id}><span>{field.label}{field.required?' *':''}</span>{control}{field.hint&&<small id={`${id}-hint`}>{field.hint}</small>}{message&&<small className={s.error} id={`${id}-error`}>{message}</small>}</label>;
    })}
  </fieldset>;
}
export function DeleteForm({entity,row}:{entity:Entity;row:Row}){
  const [state,action,pending]=useActionState(deleteRecord.bind(null,entity,row.id),empty);
  return <details className={s.dangerZone}><summary>Supprimer cette fiche</summary><p>Cette action est définitive. Les fiches ayant des éléments liés ne peuvent pas être supprimées. Une suppression de paiement recalcule le solde de la mission.</p><form action={action}><input type="hidden" name="version" value={row.updated_at}/><label className={s.check}><input type="checkbox" name="confirm" value="yes" required/>Je confirme la suppression de cette fiche.</label>{state.error&&<p role="alert" className={s.error}>{state.error}</p>}<button className={s.danger} disabled={pending}>{pending?'Suppression…':'Supprimer définitivement'}</button></form></details>;
}
