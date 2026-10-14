import { getInvoice } from '../../../../../../lib/admin/invoices';
import { requireAdmin } from '../../../../../../lib/admin/supabase';
import { renderInvoice } from '../../../../../../lib/admin/invoice-pdf';
import { Row } from '../../../../../../lib/admin/model';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
 const {db,user}=await requireAdmin();
 const invoice=await getInvoice((await params).id);
 const payments:Row[]=[];
 for(let offset=0;;offset+=500){
  const {data,error}=await db.from('payments').select('id,owner_id,created_at,updated_at,mission_id,amount_cents,paid_on,method').eq('owner_id',user.id).eq('mission_id',invoice.mission_id).order('paid_on').order('id').range(offset,offset+499);
  if(error)return new Response('Impossible de vérifier les paiements. Réessayez.',{status:503,headers:{'Cache-Control':'no-store'}});
  payments.push(...data as Row[]);if(data.length<500)break;
  if(offset>=9500)return new Response('Trop de paiements pour un seul document. Contactez le support.',{status:422});
 }
 const bytes=await renderInvoice(invoice,payments);
 const filename=invoice.number||`brouillon-${invoice.id.slice(0,8)}`;
 return new Response(Buffer.from(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${filename}.pdf"`,'Cache-Control':'private, no-store, max-age=0','X-Content-Type-Options':'nosniff'}});
}
