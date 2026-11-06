'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { entities, routes, titles } from '../../lib/admin/model';
import s from './admin.module.css';
export default function AdminNav({children}:{children?:React.ReactNode}){
  const path=usePathname();
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    if(!open)return;
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);document.getElementById('admin-menu-toggle')?.focus();}};
    document.addEventListener('keydown',close);
    return()=>document.removeEventListener('keydown',close);
  },[open]);
  const links=[['/admin','Vue d’ensemble'],['/admin/demandes','Demandes reçues'],['/admin/factures','Factures'],...entities.map(e=>[`/admin/${routes[e]}`,titles[e]]),['/admin/calendrier','Échéances']];
  return <div className={s.navWrap} data-open={open}><button id="admin-menu-toggle" type="button" className={s.menuToggle} aria-expanded={open} aria-controls="admin-navigation admin-nav-extras" onClick={()=>setOpen(!open)}>{open?'Fermer':'Menu'}<span aria-hidden="true">{open?'×':'☰'}</span></button><nav id="admin-navigation" className={s.nav} data-open={open} aria-label="Gestion privée">{links.map(([href,label],index)=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={(href==='/admin'?path===href:path.startsWith(href))?'page':undefined}><span className={s.navIndex} aria-hidden="true">{String(index+1).padStart(2,'0')}</span>{label}</Link>)}</nav><div id="admin-nav-extras" className={s.navExtras}>{children}</div></div>;
}
