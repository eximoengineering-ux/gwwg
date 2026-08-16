/* gwwg-tablet UI logic */

const state = {
    data: null,
    questKind: 'daily',
    view: 'jobs', // jobs | quests | job-detail
    detailJobId: null,
};

const $ = (sel) => document.querySelector(sel);

const inBrowser = !window.GetParentResourceName;
const resourceName = inBrowser ? 'gwwg-tablet' : window.GetParentResourceName();

function nui(cb, payload = {}) {
    if (inBrowser) return Promise.resolve({ ok: true });
    return fetch(`https://${resourceName}/${cb}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).catch(() => {});
}

/* ============ clock ============ */

function tickClock() {
    const now = new Date();
    $('#clock').textContent =
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}
setInterval(tickClock, 10000);
tickClock();

/* ============ view switching ============ */

function showView(name) {
    state.view = name;
    ['jobs', 'quests', 'job-detail'].forEach((v) => {
        $(`#view-${v}`).classList.toggle('hidden', v !== name);
    });
    document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.view === name || (name === 'job-detail' && tab.dataset.view === 'jobs'));
    });
}

document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
});

document.querySelectorAll('.pill').forEach((pill) => {
    pill.addEventListener('click', () => {
        state.questKind = pill.dataset.kind;
        document.querySelectorAll('.pill').forEach((p) => p.classList.toggle('active', p === pill));
        renderQuests();
    });
});

$('#backBtn').addEventListener('click', () => showView('jobs'));

/* ============ rendering ============ */

function esc(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

function renderHeader() {
    const p = state.data.player;
    $('#playerName').textContent = p.name;
    $('#avatar').textContent = (p.name || '?').trim().charAt(0).toUpperCase();
    $('#playerLevel').textContent = p.level;
    $('#playerXp').textContent = p.xp;
    $('#playerXpNext').textContent = p.xpNext;
    $('#xpFill').style.width = `${Math.min(100, (p.xp / Math.max(1, p.xpNext)) * 100)}%`;
}

function jobTags(job) {
    return `
        <span class="chip chip-lvl">LVL ${job.minLevel}</span>
        <span class="chip ${job.type === 'SOLO' ? 'chip-solo' : 'chip-coop'}">${job.type}</span>
        <span class="hero-role">${esc(job.role)}</span>`;
}

function renderJobs() {
    const jobs = state.data.jobs;
    $('#jobsCount').textContent = `${jobs.length} available`;

    const featured = jobs.find((j) => j.featured);
    $('#featuredJob').innerHTML = featured
        ? `
        <div class="job-hero theme-${featured.theme}" data-job="${featured.id}">
            <div class="hero-overlay"></div>
            <span class="featured-badge">&#9733; Featured</span>
            <div class="hero-tags">${jobTags(featured)}</div>
            <h1>${esc(featured.name)}</h1>
            <p>${esc(featured.description)}</p>
            <div><button class="btn btn-orange" data-view-job="${featured.id}">View Job &#8250;</button></div>
            <span class="hero-working live-dot">${featured.workers} working now</span>
        </div>`
        : '';

    $('#jobsGrid').innerHTML = jobs
        .filter((j) => !j.featured)
        .map(
            (job) => `
        <div class="job-card theme-${job.theme}" data-view-job="${job.id}">
            <div class="hero-overlay"></div>
            <span class="workers-badge">&#128101; ${job.workers}</span>
            <div class="hero-tags">${jobTags(job)}</div>
            <h3>${esc(job.name)}</h3>
            <p>${esc(job.description)}</p>
        </div>`
        )
        .join('');

    document.querySelectorAll('[data-view-job]').forEach((el) => {
        el.addEventListener('click', () => openJobDetail(el.dataset.viewJob));
    });
}

function renderQuests() {
    if (!state.data) return;
    const quests = state.data.quests[state.questKind] || [];
    $('#questsGrid').innerHTML = quests
        .map((q) => {
            const pct = Math.min(100, (q.progress / q.target) * 100);
            const claimable = !q.claimed && q.progress >= q.target;
            let foot;
            if (q.claimed) {
                foot = `<span class="quest-status">Claimed</span>`;
            } else if (claimable) {
                foot = `<button class="btn-claim" data-claim="${q.id}">&#127873; Claim</button>`;
            } else {
                foot = `<span class="quest-status">In Progress</span>`;
            }
            return `
        <div class="quest-card ${claimable ? 'claimable' : ''} ${q.claimed ? 'claimed' : ''}">
            <div class="quest-head">
                <span class="quest-title">${esc(q.name)}
                    <span class="chip ${q.kind === 'daily' ? 'chip-daily' : 'chip-weekly'}">${q.kind}</span>
                </span>
                <span class="quest-expiry">&#128337; ${q.kind === 'daily' ? 'Resets daily' : 'Resets weekly'}</span>
            </div>
            <p class="quest-desc">${esc(q.description)}</p>
            <div class="quest-progress-row">
                <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>
                <span class="quest-progress-label">${q.progress} / ${q.target}</span>
            </div>
            <div class="quest-foot">
                <span class="quest-rewards">
                    <span class="reward-xp">${q.xp.toLocaleString()} XP</span>
                    <span class="reward-cash">$${q.cash.toLocaleString()}</span>
                </span>
                ${foot}
            </div>
        </div>`;
        })
        .join('');

    document.querySelectorAll('[data-claim]').forEach((btn) => {
        btn.addEventListener('click', () =>
            nui('claimQuest', { kind: state.questKind, id: btn.dataset.claim })
        );
    });
}

/* ============ job detail / mine ============ */

function openJobDetail(jobId) {
    const job = state.data.jobs.find((j) => j.id === jobId);
    if (!job) return;
    state.detailJobId = jobId;

    $('#detailName').textContent = job.name;
    $('#detailDesc').textContent = job.description;
    $('#detailWorkers').textContent = `${job.workers} underground`;
    $('#detailCrewMeta').innerHTML = `&#9874; Owner + ${state.data.mine ? state.data.mine.maxHelpers : 4} helpers`;

    const isBusiness = job.business;
    $('#mineEmpty').classList.toggle('hidden', !isBusiness || state.data.hasMine);
    $('#minePanel').classList.toggle('hidden', !isBusiness || !state.data.hasMine);
    if (isBusiness && state.data.hasMine) renderMine();

    showView('job-detail');
}

function renderMine() {
    const m = state.data.mine;
    if (!m) return;
    $('#mineName').textContent = m.name;
    $('#mineLevel').textContent = m.level;
    $('#mineCrewCount').textContent = `${m.crew.length}/${m.maxHelpers + 1}`;
    $('#mineCells').textContent = m.cellsCreated.toLocaleString();
    $('#mineProcessed').textContent = m.processed.toLocaleString();
    $('#mineDevLabel').textContent =
        m.level >= m.maxLevel ? 'MAX level' : `${m.development} / ${m.developmentTarget} XP`;
    $('#mineDevFill').style.width =
        m.level >= m.maxLevel
            ? '100%'
            : `${Math.min(100, (m.development / Math.max(1, m.developmentTarget)) * 100)}%`;
    $('#crewCounter').textContent = `${m.crew.length}/${m.maxHelpers}`;
    if (document.activeElement !== $('#mineNameInput')) {
        $('#mineNameInput').value = m.name;
    }

    $('#crewList').innerHTML = m.crew.length
        ? m.crew
              .map(
                  (c) => `
        <div class="crew-row">
            <span class="crew-name">${esc(c.name)}</span>
            <span class="crew-status ${c.online ? 'online' : 'offline'}">${c.online ? 'ONLINE' : 'OFFLINE'}</span>
            <button class="crew-kick" data-kick="${esc(c.license)}" title="Remove">&#10005;</button>
        </div>`
              )
              .join('')
        : '<p class="muted center">The mine is currently empty.</p>';

    document.querySelectorAll('[data-kick]').forEach((btn) => {
        btn.addEventListener('click', () => nui('removeCrew', { license: btn.dataset.kick }));
    });
}

$('#createMineBtn').addEventListener('click', () => nui('createMine'));

$('#inviteBtn').addEventListener('click', () => {
    const id = parseInt($('#inviteInput').value, 10);
    if (!id) return;
    nui('inviteCrew', { targetId: id });
    $('#inviteInput').value = '';
});

$('#renameBtn').addEventListener('click', () => {
    const name = $('#mineNameInput').value.trim();
    if (name.length >= 3) nui('renameMine', { name });
});

/* ============ toast ============ */

let toastTimer = null;
function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
}

/* ============ NUI message pump ============ */

window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg || !msg.action) return;

    if (msg.action === 'open') {
        $('#tablet').classList.remove('hidden');
        showView('jobs');
    } else if (msg.action === 'close') {
        $('#tablet').classList.add('hidden');
    } else if (msg.action === 'setData') {
        state.data = msg.data;
        renderHeader();
        renderJobs();
        renderQuests();
        if (state.view === 'job-detail' && state.detailJobId) {
            openJobDetail(state.detailJobId);
        }
    } else if (msg.action === 'notify') {
        showToast(msg.message);
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') nui('close');
});

/* ============ browser preview (open index.html directly) ============ */

if (inBrowser) {
    state.data = {
        player: { name: 'test test', level: 1, xp: 120, xpNext: 250 },
        jobs: [
            { id: 'farming', name: 'Farming', role: 'Farmhand', type: 'SOLO', minLevel: 1, featured: true, theme: 'farm', business: false, workers: 0, description: 'Tend crops and livestock on Sandy Shores farms. Start as a Farmhand running watering and feeding tasks, then graduate to full crop cycles and livestock management. Hit Level 3 to unlock the right to buy your own farmhouse or greenhouse.' },
            { id: 'greenhouse', name: 'Greenhouse', role: 'Apprentice Gardener', type: 'SOLO', minLevel: 1, theme: 'greenhouse', business: false, workers: 0, description: "Climate-controlled growing. Plant the day's slate, harvest, and deposit. Hit Level 3 to unlock greenhouse ownership." },
            { id: 'postop', name: 'Post Op', role: 'Solo Courier', type: 'SOLO', minLevel: 1, theme: 'delivery', business: false, workers: 0, description: 'Pick up packages from the depot, load them into your vehicle, and deliver them across Los Santos.' },
            { id: 'mining', name: 'Mineral Mining', role: 'Surface Miner', type: 'CO-OP', minLevel: 1, theme: 'mine', business: true, workers: 37, description: 'Own a persistent mine, invite up to four helpers, expand its tunnels, and refine shared ore into valuable materials.' },
            { id: 'fieldwork', name: 'Field Work', role: 'Field Hand', type: 'CO-OP', minLevel: 1, theme: 'field', business: false, workers: 2, description: 'Agricultural day labor around the Grapeseed fields. Rake, plant, water and harvest by hand, tend livestock, then graduate to tractors and harvesters.' },
        ],
        quests: {
            daily: [
                { id: 'daily_catch', name: 'Daily Catch', description: 'Catch 30 fish today', target: 30, progress: 0, xp: 400, cash: 1200, kind: 'daily', claimed: false },
                { id: 'road_runner', name: 'Road Runner', description: 'Complete 8 deliveries', target: 8, progress: 0, xp: 500, cash: 1800, kind: 'daily', claimed: false },
                { id: 'rock_bottom', name: 'Rock Bottom', description: 'Mine 100 rock cells', target: 100, progress: 142, xp: 400, cash: 1200, kind: 'daily', claimed: false },
                { id: 'full_cart', name: 'Full Cart', description: 'Sort 2 full minecarts', target: 2, progress: 0, xp: 400, cash: 1300, kind: 'daily', claimed: false },
                { id: 'hot_metal', name: 'Hot Metal', description: 'Cast 3 ingots', target: 3, progress: 0, xp: 450, cash: 1500, kind: 'daily', claimed: false },
                { id: 'claim_developer', name: 'Claim Developer', description: 'Place or open 3 mine developments', target: 3, progress: 0, xp: 500, cash: 2000, kind: 'daily', claimed: false },
            ],
            weekly: [
                { id: 'master_angler', name: 'Master Angler', description: 'Catch 300 fish this week', target: 300, progress: 0, xp: 2500, cash: 8000, kind: 'weekly', claimed: false },
                { id: 'vein_hunter', name: 'Vein Hunter', description: 'Mine 600 rock cells', target: 600, progress: 204, xp: 2500, cash: 8000, kind: 'weekly', claimed: false },
                { id: 'highway_legend', name: 'Highway Legend', description: 'Complete 50 deliveries', target: 50, progress: 0, xp: 3000, cash: 12000, kind: 'weekly', claimed: false },
            ],
        },
        mine: {
            name: "Nawaf Alkhuzae's Mine", level: 3, maxLevel: 5, development: 127, developmentTarget: 250,
            cellsCreated: 127, processed: 0, maxHelpers: 4,
            crew: [{ license: 'license:abc', name: 'Abdullah Suliman', online: true }],
        },
        hasMine: true,
    };
    $('#tablet').classList.remove('hidden');
    renderHeader();
    renderJobs();
    renderQuests();
}
