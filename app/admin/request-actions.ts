'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../lib/admin/supabase';

export type FollowUpState = { error: string; saved: boolean; version: string };
const schema = z.object({ id: z.string().uuid(), status: z.enum(['nouveau', 'en_cours', 'contacte', 'archive']), notes: z.string().trim().max(5000), version: z.iso.datetime({ offset: true }) });
export async function updateRequest(id: string, previous: FollowUpState, form: FormData): Promise<FollowUpState> {
  const { db, user } = await requireAdmin();
  const result = schema.safeParse({ id, status: form.get('status'), notes: form.get('notes'), version: previous.version });
  if (!result.success) return { ...previous, saved: false, error: 'Vérifiez le statut et la longueur de la note.' };
  const { status, notes, version } = result.data;
  const { data, error } = await db.from('contact_requests').update({ status, notes }).eq('id', id).eq('owner_id', user.id).eq('updated_at', version).select('updated_at').maybeSingle();
  if (error) return { ...previous, saved: false, error: 'Le suivi n’a pas pu être enregistré. Réessayez.' };
  if (!data) return { ...previous, saved: false, error: 'Cette fiche a changé. Rechargez-la avant de modifier le suivi.' };
  revalidatePath('/admin/demandes', 'layout'); revalidatePath('/admin');
  return { error: '', saved: true, version: data.updated_at };
}
