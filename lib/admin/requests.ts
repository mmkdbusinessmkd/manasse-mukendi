import 'server-only';
import { notFound } from 'next/navigation';
import { requireAdmin } from './supabase';
import { uuid } from './model';
import { ContactRequest, RequestStatus } from '../contact-request';

export type InboxRequest = ContactRequest & { id: string; status: RequestStatus; notes: string; created_at: string; updated_at: string };
const columns = 'id,name,email,phone,service,message,entreprise,secteur,site_ou_reseaux,probleme_communication,motivation_programme,status,notes,created_at,updated_at';
export async function getRequest(id: string): Promise<InboxRequest> {
  const { db, user } = await requireAdmin();
  if (!uuid.safeParse(id).success) notFound();
  const { data, error } = await db.from('contact_requests').select(columns).eq('owner_id', user.id).eq('id', id).maybeSingle();
  if (error) throw new Error('Les demandes sont momentanément indisponibles.');
  if (!data) notFound();
  return data as InboxRequest;
}
export async function listRequests(status: string, page: number) {
  const { db, user } = await requireAdmin();
  let query = db.from('contact_requests').select('id,name,email,phone,service,status,created_at', { count: 'exact' }).eq('owner_id', user.id);
  if (status) query = query.eq('status', status);
  const { data, error, count } = await query.order('created_at', { ascending: false }).order('id').range((page - 1) * 20, page * 20 - 1);
  if (error) throw new Error('Les demandes sont momentanément indisponibles.');
  return { rows: data as Pick<InboxRequest, 'id' | 'name' | 'email' | 'phone' | 'service' | 'status' | 'created_at'>[], count: count || 0 };
}
