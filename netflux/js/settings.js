import { getSession, getProfiles, saveProfiles, getSelectedProfileId } from './storage.js';

const { $ } = window.NetfluxUtils;

document.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  if (!session) { window.location.href = '/workspace/netflux/login.html'; return; }
  const selectedId = getSelectedProfileId(session.userId);
  if (!selectedId) { window.location.href = '/workspace/netflux/profiles.html'; return; }

  const profiles = getProfiles(session.userId);
  const profile = profiles.find(p => p.id === selectedId);
  if (!profile) { window.location.href = '/workspace/netflux/profiles.html'; return; }

  const form = $('#settingsForm');
  form.name.value = profile.name;
  form.isKids.checked = !!profile.isKids;
  $('#currentAvatar').src = profile.avatar;

  $('#randomizeAvatar').addEventListener('click', () => {
    const idx = Math.floor(Math.random() * 6) + 1;
    const newAvatar = `/workspace/netflux/assets/avatars/avatar${idx}.jpg`;
    $('#currentAvatar').src = newAvatar;
    profile.avatar = newAvatar;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    profile.name = form.name.value.trim() || profile.name;
    profile.isKids = !!form.isKids.checked;
    saveProfiles(session.userId, profiles);
    alert('Saved');
  });
});

