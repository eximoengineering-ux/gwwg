// Builds design/EmberRP-UI-All.html — one standalone file containing every artboard.
// Each artboard is embedded as an <iframe srcdoc> so per-board styles never collide.
import { readFileSync, writeFileSync } from 'node:fs';

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const DIR = join(ROOT, 'mockups');
const OUT = join(ROOT, 'EmberRP-UI-All.html');

const SECTIONS = [
  { name: 'Core & HUD', boards: [
    ['Main.dc.html', 'Brand & Design System', 860],
    ['HUD.dc.html', 'HUD — Status, Minimap, Vehicle', 720],
    ['Menu.dc.html', 'qb-menu — Context Menu', 720],
    ['Input.dc.html', 'qb-input — Form Dialog', 720],
    ['Target.dc.html', 'qb-target — Third Eye', 720],
    ['Radial.dc.html', 'qb-radialmenu — Orbital Menu', 720],
    ['Notify.dc.html', 'Notifications & Progressbar', 720],
  ]},
  { name: 'Screens & Apps', boards: [
    ['Multichar.dc.html', 'Multicharacter — Select', 720],
    ['Spawn.dc.html', 'Spawn Selector', 720],
    ['Phone.dc.html', 'Phone — EmberOS', 720],
    ['Inventory.dc.html', 'Inventory — Pockets & Trunk', 720],
    ['Banking.dc.html', 'Banking — Fleeca', 720],
    ['Shop.dc.html', 'Shop — 24/7', 720],
    ['Scoreboard.dc.html', 'Scoreboard — Players', 720],
    ['Management.dc.html', 'Boss Menu — Management', 720],
    ['Admin.dc.html', 'Admin Panel', 720],
    ['Clothing.dc.html', 'Wardrobe — Clothing', 720],
  ]},
  { name: 'EmberOS Phone', boards: [
    ['PhoneSettings.dc.html', 'EmberOS — Lock, Camera, Settings', 720],
    ['PhoneCalls.dc.html', 'Phone App — Keypad, Recents, In Call', 720],
    ['PhoneMsg.dc.html', 'Messages — Inbox, Chat, Contact', 720],
    ['PhoneBank.dc.html', 'Fleeca App — Home, Transfer, Receipt', 720],
    ['PhoneBirdy.dc.html', 'Birdy — Feed, Compose, Profile', 720],
    ['PhoneMail.dc.html', 'Mail & Alarms', 720],
    ['PhoneGarage.dc.html', 'Garage, Services & Crypto', 720],
  ]},
  { name: 'Extended Screens', boards: [
    ['Charcreate.dc.html', 'Multicharacter — Create & Delete', 720],
    ['Apartment.dc.html', 'Apartments — Select, Interior, Rent', 720],
    ['HUDStates.dc.html', 'HUD — States & Settings', 720],
    ['Hotbar.dc.html', 'Inventory — Hotbar & Item Actions', 720],
    ['Crafting.dc.html', 'Inventory — Crafting & Attachments', 720],
    ['ATM.dc.html', 'Banking — Street ATM', 720],
    ['GarageUI.dc.html', 'Garages — Terminal & Impound', 720],
    ['Ammunation.dc.html', 'Shops — Ammunation & Checkout', 720],
    ['Barber.dc.html', 'Appearance — Barber & Tattoo', 720],
  ]},
];

function boardDoc(file) {
  const raw = readFileSync(`${DIR}/${file}`, 'utf8');
  const helmet = raw.match(/<helmet>([\s\S]*?)<\/helmet>/);
  if (!helmet) throw new Error(`no helmet in ${file}`);
  const afterHelmet = raw.slice(raw.indexOf('</helmet>') + '</helmet>'.length);
  const body = afterHelmet.slice(0, afterHelmet.indexOf('</x-dc>')).trim();
  return `<!doctype html><html><head><meta charset="utf-8">${helmet[1]}</head><body style="margin:0;overflow:hidden">${body}</body></html>`;
}

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let toc = '';
let sections = '';
for (const sec of SECTIONS) {
  toc += `<div class="tocSec"><div class="tocH">${sec.name}</div>`;
  let cards = '';
  for (const [file, title, h] of sec.boards) {
    const id = slug(title);
    toc += `<a href="#${id}">${title}</a>`;
    cards += `
    <div class="card" id="${id}">
      <div class="cardHead"><span class="cardTitle">${title}</span><span class="cardFile">${file}</span></div>
      <div class="frameWrap" data-h="${h}"><iframe loading="lazy" scrolling="no" width="1280" height="${h}" srcdoc="${esc(boardDoc(file))}"></iframe></div>
    </div>`;
  }
  toc += `</div>`;
  sections += `<h2 class="secH">${sec.name}</h2>${cards}`;
}

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ember RP — UI Collection</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #0C0B0A; color: #F5F1EC; font-family: 'Instrument Sans', 'Segoe UI', system-ui, sans-serif; }
  .h { font-family: 'Space Grotesk', 'Segoe UI', system-ui, sans-serif; }
  header { padding: 46px 28px 30px; border-bottom: 1px solid rgba(255,255,255,0.08); background: radial-gradient(900px 400px at 70% 0%, rgba(255,122,31,0.12) 0%, rgba(255,122,31,0) 60%), #0C0B0A; }
  .mark { display: inline-flex; align-items: center; gap: 10px; }
  .flame { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #FF7A1F, #E8540E); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 26px rgba(255,122,31,0.35); }
  h1 { font-family: 'Space Grotesk', sans-serif; font-size: 26px; margin: 0; letter-spacing: 0.02em; }
  .sub { color: #A8A29C; font-size: 13px; margin-top: 8px; max-width: 720px; line-height: 1.6; }
  nav { padding: 18px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; gap: 34px; flex-wrap: wrap; }
  .tocH { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #FF7A1F; margin-bottom: 8px; }
  .tocSec a { display: block; color: #A8A29C; text-decoration: none; font-size: 12.5px; padding: 2.5px 0; }
  .tocSec a:hover { color: #FFB56B; }
  main { padding: 10px 28px 60px; max-width: 1360px; margin: 0 auto; }
  .secH { font-family: 'Space Grotesk', sans-serif; font-size: 15px; letter-spacing: 0.12em; text-transform: uppercase; color: #F5F1EC; margin: 44px 0 6px; padding-left: 12px; border-left: 3px solid #FF7A1F; }
  .card { margin-top: 22px; border: 1px solid rgba(255,255,255,0.09); border-radius: 16px; overflow: hidden; background: #171512; }
  .cardHead { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .cardTitle { font-family: 'Space Grotesk', sans-serif; font-size: 13.5px; font-weight: 700; }
  .cardFile { font-size: 10.5px; color: #6B655F; font-family: ui-monospace, monospace; }
  .frameWrap { position: relative; width: 100%; overflow: hidden; }
  .frameWrap iframe { border: 0; display: block; transform-origin: 0 0; pointer-events: none; }
  footer { text-align: center; color: #6B655F; font-size: 11px; padding: 26px; border-top: 1px solid rgba(255,255,255,0.06); letter-spacing: 0.08em; }
</style>
</head>
<body>
<header>
  <div class="mark">
    <div class="flame"><svg width="18" height="18" viewBox="0 0 24 24" fill="#17100A"><path d="M12 2C9 7 14 8.5 14 12a3.5 3.5 0 0 1-7 .3C5.4 13.8 4.5 15.6 4.5 17.5A7.5 7.5 0 0 0 19.5 17c0-6.5-5.5-8-7.5-15z"/></svg></div>
    <h1>EMBER RP — UI Collection</h1>
  </div>
  <div class="sub">Every interface designed for the FiveM QBCore server, in a single file. Dark ember style: near-black glass panels, ember-cut corners, #FF7A1F accent, Space Grotesk + Instrument Sans, fully animated. New designs get appended to this file.</div>
</header>
<nav>${toc}</nav>
<main>${sections}</main>
<footer>EMBER RP &middot; PLACEHOLDER IDENTITY &middot; DESIGN MOCKUPS &middot; NUI CODE FOLLOWS APPROVAL</footer>
<script>
  function fit() {
    document.querySelectorAll('.frameWrap').forEach(w => {
      const s = Math.min(1, w.clientWidth / 1280);
      const f = w.querySelector('iframe');
      f.style.transform = 'scale(' + s + ')';
      w.style.height = (parseInt(w.dataset.h, 10) * s) + 'px';
    });
  }
  addEventListener('resize', fit); fit();
</script>
</body>
</html>
`;

writeFileSync(OUT, page);
console.log('wrote', OUT, Math.round(page.length / 1024) + 'KB');
