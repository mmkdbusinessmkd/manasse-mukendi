import 'server-only';
import { cache } from 'react';
import { requireAdmin } from './supabase';
import { Data, entities, Row } from './model';

// Request-local memoization only: no shared or persistent cache for private data.
export const loadData=cache(async ():Promise<Data>=>{
  const {db,user}=await requireAdmin();
  const pairs=await Promise.all(entities.map(async entity=>{
    const rows:Row[]=[];
    for(let offset=0;;offset+=500){
      const {data,error}=await db.from(entity).select('*').eq('owner_id',user.id).order('id').range(offset,offset+499);
      if(error) throw new Error('La base privée est indisponible ou son installation est incomplète.');
      rows.push(...data as Row[]);
      if(data.length<500)break;
      if(offset>=49500)throw new Error('Volume important : une pagination dédiée est nécessaire. Aucun total partiel n’est affiché.');
    }
    return [entity,rows] as const;
  }));
  return Object.fromEntries(pairs) as Data;
});
