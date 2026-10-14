import Link from 'next/link';
import { getRequest } from '../../../../../lib/admin/requests';
import { replyLinks, requestLabels } from '../../../../../lib/contact-request';
import { dateLabel } from '../../../../../lib/admin/model';
import { PageHeading } from '../../../Views';
import RequestFollowUp from '../../../RequestFollowUp';
import s from '../../../admin.module.css';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const request = await getRequest((await params).id);
  const links = replyLinks(request);
  return <>
    <Link className={s.textLink} href="/admin/demandes">Retour aux demandes</Link>
    <PageHeading title={request.name} description={`Reçue le ${dateLabel(request.created_at)} · ${request.service}`}/>
    <div className={s.columns}><section className={s.panel}>
      <h2>La demande</h2><dl className={s.requestDetails}>{Object.entries(requestLabels).map(([key, label]) => {
        const value = request[key as keyof typeof request];
        return value ? <div key={key}><dt>{label}</dt><dd>{value}</dd></div> : null;
      })}</dl>
      <small className={s.meta}>Référence : {request.id}</small>
    </section><div><section className={s.panel}><h2>Recontacter cette personne</h2><p>Un message est préparé. Vous pouvez le modifier avant de l’envoyer depuis votre messagerie ou WhatsApp.</p>
      <div className={s.actions}><a className={s.primary} href={links.email}>Répondre par e-mail</a>{links.whatsapp && <a className={s.secondary} href={links.whatsapp} target="_blank" rel="noreferrer">Ouvrir WhatsApp</a>}</div>
      <p className={s.meta}>Le site ne vérifie pas si ce numéro possède un compte WhatsApp. Ouvrir un bouton ne marque pas la demande comme contactée.</p>
    </section><section className={s.panel}><h2>Votre suivi</h2><RequestFollowUp id={request.id} status={request.status} notes={request.notes} version={request.updated_at}/></section></div></div>
  </>;
}
