import { getSession, clearSession, getProfiles, saveProfiles, setSelectedProfileId } from './storage.js';

const { $, $all, uid } = window.NetfluxUtils;

function ensureLoggedIn() {
  const session = getSession();
  if (!session) {
    window.location.href = '/workspace/netflux/login.html';
  }
  return session;
}

function renderProfiles() {
  const session = ensureLoggedIn();
  const profiles = getProfiles(session.userId);
  const list = $('#profilesList');
  list.innerHTML = '';
  for (const p of profiles) {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="profile-tile" data-id="${p.id}">
        <img src="${p.avatar}" alt="${p.name}" class="avatar large" />
      </button>
      <div class="profile-name">${p.name}${p.isKids ? ' (Kids)' : ''}</div>
    `;
    list.appendChild(li);
  }
}

function createDefaultProfilesIfEmpty() {
  const session = ensureLoggedIn();
  let profiles = getProfiles(session.userId);
  if (profiles.length === 0) {
    profiles = [
      { id: uid('p'), name: 'You', isKids: false, avatar: '/workspace/netflux/assets/avatars/avatar1.jpg' },
      { id: uid('p'), name: 'Kids', isKids: true, avatar: '/workspace/netflux/assets/avatars/avatar2.jpg' }
    ];
    saveProfiles(session.userId, profiles);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const session = ensureLoggedIn();
  createDefaultProfilesIfEmpty();
  renderProfiles();

  $('#addProfileBtn').addEventListener('click', () => {
    const dlg = document.getElementById('profileDialog');
    dlg.showModal();
  });

  $('#profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get('name') || '').toString().trim();
    const isKids = !!form.get('isKids');
    if (!name) return;
    const profiles = getProfiles(session.userId);
    profiles.push({ id: uid('p'), name, isKids, avatar: `/workspace/netflux/assets/avatars/avatar${(profiles.length % 6) + 1}.jpg` });
    saveProfiles(session.userId, profiles);
    document.getElementById('profileDialog').close();
    renderProfiles();
  });

  document.getElementById('signOutBtn').addEventListener('click', () => {
    clearSession();
    window.location.href = '/workspace/netflux/index.html';
  });

  document.getElementById('profilesList').addEventListener('click', (e) => {
    const btn = e.target.closest('.profile-tile');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    setSelectedProfileId(session.userId, id);
    window.location.href = '/workspace/netflux/app.html';
  });
});

