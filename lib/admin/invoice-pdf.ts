import { PDFDocument,StandardFonts,rgb } from 'pdf-lib';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Invoice,InvoiceDocument,invoiceBalance,invoiceDocumentTitle } from './invoice-model';
import { Row,moneyLabel,dateLabel,today } from './model';
// Node-only generation. No third-party document service receives client information.
export async function renderInvoice(invoice:Invoice,payments:Row[],document:InvoiceDocument=invoice.state==='draft'?'draft':'invoice') {
 const proforma=document==='proforma';
 const title=invoiceDocumentTitle(invoice,payments,document);
 const pdf=await PDFDocument.create();
 const regular=await pdf.embedFont(StandardFonts.Helvetica), bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 const green=rgb(.06,.25,.16), muted=rgb(.30,.39,.33), orange=rgb(.94,.46,.09);
 const logo=await pdf.embedPng(await readFile(path.join(process.cwd(),'public/images/brand/logo-mm.png')));
 const reference=proforma?`PF-${invoice.id.slice(0,8)}`:invoice.number||`BROUILLON ${invoice.id.slice(0,8)}`;
 pdf.setTitle(`${title} ${reference}`);pdf.setAuthor(invoice.issuer.name||'Manassé Mukendi');
 let page=pdf.addPage([595.28,841.89]), y=0;
 const safe=(text:string)=>[...text.replace(/[\u00a0\u202f]/g,' ').replace(/[\u2011\u2013\u2014]/g,'-')].map(c=>{try{regular.encodeText(c);return c;}catch{return `[U+${c.codePointAt(0)!.toString(16).toUpperCase()}]`;}}).join('');
 function header(){
   page.drawRectangle({x:0,y:833.89,width:595.28,height:8,color:green});
   const dim=logo.scaleToFit(135,52);page.drawImage(logo,{x:44,y:760,width:dim.width,height:dim.height});
   page.drawText(safe(title.toUpperCase()),{x:325,y:790,size:title.length>15?16:20,font:bold,color:green});
   page.drawText(safe(reference),{x:355,y:769,size:10,font:regular,color:muted});
   page.drawLine({start:{x:44,y:744},end:{x:551,y:744},thickness:1,color:orange});y=721;
 }
 header();
 function space(height=18){if(y-height<64){page=pdf.addPage([595.28,841.89]);header();}}
 function text(value:string,size=10,strong=false,color=green){
   const font=strong?bold:regular, max=507;
   for(const paragraph of String(value||'').split(/\r?\n/)){
     let line='';
     for(const word of safe(paragraph).split(' ')){
       if(font.widthOfTextAtSize(line+(line?' ':'')+word,size)<=max){line+=(line?' ':'')+word;continue;}
       if(line){space(size+6);page.drawText(line,{x:44,y,size,font,color});y-=size+6;line='';}
       for(const char of word){if(font.widthOfTextAtSize(line+char,size)>max){space(size+6);page.drawText(line,{x:44,y,size,font,color});y-=size+6;line='';}line+=char;}
     }
     space(size+6);if(line)page.drawText(line,{x:44,y,size,font,color});y-=size+6;
   }
 }
 function section(label:string){space(48);y-=12;text(label,10,true,muted);y-=3;}
 if(proforma){text('PROPOSITION DE FACTURATION',11,true,orange);text('Document pro forma - ne constitue pas une facture définitive ni une preuve de paiement.',9,false,muted);y-=8;}
 else if(invoice.state==='draft'){text('DOCUMENT DE TRAVAIL - NON EMIS',11,true,orange);text('A completer et valider avant toute utilisation comme facture.',9,false,muted);y-=8;}
 section('EMETTEUR');
 text(invoice.issuer.name||'Manassé Mukendi',13,true);
 if(invoice.issuer.address)text(invoice.issuer.address);
 text([invoice.issuer.email,invoice.issuer.phone].filter(Boolean).join(' | '));
 if(invoice.issuer.registration)text(invoice.issuer.registration);
 section('FACTURE A');
 text(invoice.customer.company||invoice.customer.name,13,true);
 if(invoice.customer.company)text(`Contact : ${invoice.customer.name}`);
 if(invoice.client_address)text(invoice.client_address);
 if(invoice.client_registration)text(invoice.client_registration);
 if(invoice.customer.email)text(invoice.customer.email);
 y-=9;text(`${proforma?'Pro forma du':'Date d’émission :'} ${proforma?dateLabel(today()):invoice.issued_on?dateLabel(invoice.issued_on):'Non émise'}${invoice.due_date?` | Echéance : ${dateLabel(invoice.due_date)}`:''}`,9,false,muted);
 section('PRESTATION');text(invoice.description,11);
 const balance=invoiceBalance(invoice,payments);
 space(proforma?70:118);y-=14;page.drawRectangle({x:44,y:y-(proforma?40:90),width:507,height:proforma?50:100,color:rgb(.93,.96,.94)});
 page.drawText(`Total convenu : ${safe(moneyLabel(Number(invoice.amount_cents),invoice.currency))}`,{x:58,y:y-12,font:bold,size:16,color:green});
 if(!proforma){
   page.drawText(`Reçu : ${safe(moneyLabel(balance.paid,invoice.currency))}`,{x:58,y:y-38,font:regular,size:11,color:green});
   page.drawText(`Reste à régler : ${safe(moneyLabel(balance.remaining,invoice.currency))}`,{x:58,y:y-65,font:bold,size:13,color:green});
 }
 y-=proforma?62:112;
 if(!proforma)text(`Statut : ${balance.label} | Situation des paiements au ${dateLabel(today())}`,9,false,muted);
 if(invoice.issuer.tax_note||invoice.issuer.payment_details){
   section(invoice.issuer.tax_note?'INFORMATIONS COMPLEMENTAIRES':'REGLEMENT');
   if(invoice.issuer.tax_note)text(invoice.issuer.tax_note,9);
   if(invoice.issuer.payment_details)text(invoice.issuer.payment_details,9);
 }
 const received=payments.filter(p=>p.mission_id===invoice.mission_id);
 if(!proforma&&received.length){section('PAIEMENTS ENREGISTRES');for(const payment of received)text(`${dateLabel(payment.paid_on)} | ${moneyLabel(Number(payment.amount_cents),invoice.currency)}${payment.method?` | ${payment.method}`:''}`,9);}
 for(const [index,p] of pdf.getPages().entries()){
   p.drawLine({start:{x:44,y:45},end:{x:551,y:45},thickness:.5,color:rgb(.78,.83,.79)});
   p.drawText(safe(`${reference} | manasse-mukendi.com`),{x:44,y:29,size:8,font:regular,color:muted});
   p.drawText(`${index+1} / ${pdf.getPageCount()}`,{x:516,y:29,size:8,font:regular,color:muted});
 }
 return pdf.save();
}
