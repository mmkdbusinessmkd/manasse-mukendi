'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { entities, routes, titles } from '../../lib/admin/model';
import s from './admin.module.css';
export default function AdminNav(){
  const path=usePathname();
  const [open,setOpen]=useState(false);
  const links=[['/admin','Vue d’ensemble'],...entities.map(e=>[`/admin/${routes[e]}`,titles[e]]),['/admin/calendrier','Échéances']];
  return <div><button type="button" className={s.menuToggle} aria-expanded={open} aria-controls="admin-navigation" onClick={()=>setOpen(!open)}>{open?'Fermer le menu':'Menu de gestion'}</button><nav id="admin-navigation" className={s.nav} data-open={open} aria-label="Gestion privée">{links.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={(href==='/admin'?path===href:path.startsWith(href))?'page':undefined}>{label}</Link>)}</nav></div>;
}
