import { getSession, getProfiles, getSelectedProfileId, getMyList, saveMyList, getPlayback, savePlayback, clearSession } from './storage.js';
import { catalog, getByCategory, searchCatalog } from './data.js';

const { $, $all, debounce } = window.NetfluxUtils;

function ensureProfile() {
  const session = getSession();
  if (!session) { window.location.href = '/workspace/netflux/login.html'; return null; }
  const profileId = getSelectedProfileId(session.userId);
  if (!profileId) { window.location.href = '/workspace/netflux/profiles.html'; return null; }
  const profile = getProfiles(session.userId).find(p => p.id === profileId);
  if (!profile) { window.location.href = '/workspace/netflux/profiles.html'; return null; }
  return { session, profile };
}

function pickFeatured(list) {
  return list[Math.floor(Math.random() * list.length)] || catalog[0];
}

function renderFeatured(item) {
  $('.featured-backdrop').style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.7), transparent 70%), url('${item.backdrop}')`;
  $('#featuredTitle').textContent = item.title;
  $('#featuredDesc').textContent = item.description;
  $('#playFeatured').onclick = () => openDetail(item);
  $('#addFeatured').onclick = () => toggleMyList(item.id);
}

function tileHTML(item) {
  return `
    <button class="tile" data-id="${item.id}" title="${item.title}">
      <img src="${item.poster}" alt="${item.title}" loading="lazy" />
      <div class="hover">
        <span class="chip">${item.year}</span>
      </div>
    </button>
  `;
}

function renderRow(containerId, items) {
  const el = document.getElementById(containerId);
  el.innerHTML = items.map(tileHTML).join('');
}

let state = { myList: new Set(), playback: {}, profileId: null };

function loadState(profileId) {
  state.profileId = profileId;
  state.myList = getMyList(profileId);
  state.playback = getPlayback(profileId);
}

function saveState() {
  saveMyList(state.profileId, state.myList);
  savePlayback(state.profileId, state.playback);
}

function toggleMyList(id) {
  if (state.myList.has(id)) state.myList.delete(id); else state.myList.add(id);
  saveState();
  refreshRows();
}

function openDetail(item) {
  const dlg = document.getElementById('detailDialog');
  document.getElementById('detailTitle').textContent = item.title;
  document.getElementById('detailDesc').textContent = item.description;
  document.getElementById('detailMeta').textContent = `${item.year} • ${item.rating} • ${item.durationMin}m`;
  const video = document.getElementById('detailVideo');
  const src = document.getElementById('detailSource');
  video.poster = item.backdrop;
  src.src = item.video;
  video.load();

  document.getElementById('detailAdd').onclick = () => toggleMyList(item.id);
  document.getElementById('detailPlay').onclick = () => {
    video.play();
  };
  document.getElementById('closeDetail').onclick = () => dlg.close();

  dlg.showModal();

  // Track progress
  video.addEventListener('timeupdate', () => {
    const seconds = Math.floor(video.currentTime);
    const duration = Math.floor(video.duration || item.durationMin * 60);
    state.playback[item.id] = { seconds, duration, watched: seconds / duration };
    savePlayback(state.profileId, state.playback);
  });
}

function refreshRows() {
  const continueItems = catalog.filter(c => {
    const pb = state.playback[c.id];
    return pb && pb.seconds > 0 && pb.watched < 0.95;
  });
  renderRow('row-continue', continueItems);
  renderRow('row-trending', getByCategory('Trending'));
  renderRow('row-popular', getByCategory('Popular'));

  // Very basic recommendations: pick items sharing any category with most watched
  const top = Object.entries(state.playback).sort((a,b) => (b[1]?.seconds||0) - (a[1]?.seconds||0))[0]?.[0];
  const base = catalog.find(c => c.id === top) || catalog[0];
  const recs = catalog.filter(c => c.id !== base.id && c.categories.some(cat => base.categories.includes(cat))).slice(0, 12);
  renderRow('row-recommended', recs);
}

function wireRowClicks() {
  document.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if (!tile) return;
    const id = tile.getAttribute('data-id');
    const item = catalog.find(c => c.id === id);
    if (item) openDetail(item);
  });
}

function wireSearch() {
  const input = document.getElementById('searchInput');
  const rows = $all('.row');
  const debounced = debounce(() => {
    const q = input.value.trim();
    if (!q) {
      rows.forEach(r => r.style.display = 'block');
      refreshRows();
      return;
    }
    const results = searchCatalog(q);
    rows.forEach(r => r.style.display = 'none');
    renderRow('row-trending', results);
    document.querySelector('[data-row="trending"]').style.display = 'block';
  }, 180);
  input.addEventListener('input', debounced);
}

function wireHeader(profile) {
  const avatarImg = document.getElementById('avatarImg');
  avatarImg.src = profile.avatar;
  document.getElementById('kidsBadge').style.display = profile.isKids ? 'inline-block' : 'none';
  document.getElementById('signOutLink').addEventListener('click', (e) => {
    e.preventDefault();
    clearSession();
    window.location.href = '/workspace/netflux/index.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const ctx = ensureProfile();
  if (!ctx) return;
  const { session, profile } = ctx;

  loadState(profile.id);
  wireHeader(profile);
  wireRowClicks();
  wireSearch();

  const featured = pickFeatured(getByCategory('Trending'));
  renderFeatured(featured);
  refreshRows();
});

