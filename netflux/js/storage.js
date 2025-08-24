const KEY_USERS = 'netflux_users';
const KEY_SESSION = 'netflux_session';
const KEY_PROFILES = 'netflux_profiles';
const KEY_SELECTED_PROFILE = 'netflux_selected_profile';
const KEY_MY_LIST = 'netflux_my_list';
const KEY_PLAYBACK = 'netflux_playback';

function read(key, fallback) {
  return NetfluxUtils.safeJSONParse(localStorage.getItem(key), fallback);
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() { return read(KEY_USERS, []); }
export function saveUsers(users) { write(KEY_USERS, users); }

export function getSession() { return read(KEY_SESSION, null); }
export function setSession(session) { write(KEY_SESSION, session); }
export function clearSession() { localStorage.removeItem(KEY_SESSION); }

export function getProfiles(userId) {
  const all = read(KEY_PROFILES, {});
  return all[userId] || [];
}
export function saveProfiles(userId, profiles) {
  const all = read(KEY_PROFILES, {});
  all[userId] = profiles;
  write(KEY_PROFILES, all);
}

export function getSelectedProfileId(userId) {
  const map = read(KEY_SELECTED_PROFILE, {});
  return map[userId] || null;
}
export function setSelectedProfileId(userId, profileId) {
  const map = read(KEY_SELECTED_PROFILE, {});
  map[userId] = profileId;
  write(KEY_SELECTED_PROFILE, map);
}

export function getMyList(profileId) {
  const all = read(KEY_MY_LIST, {});
  return new Set(all[profileId] || []);
}
export function saveMyList(profileId, idsSet) {
  const all = read(KEY_MY_LIST, {});
  all[profileId] = Array.from(idsSet);
  write(KEY_MY_LIST, all);
}

export function getPlayback(profileId) {
  const all = read(KEY_PLAYBACK, {});
  return all[profileId] || {};
}
export function savePlayback(profileId, playbackMap) {
  const all = read(KEY_PLAYBACK, {});
  all[profileId] = playbackMap;
  write(KEY_PLAYBACK, all);
}

export function upsertUser(email, password) {
  const users = getUsers();
  const existing = users.find(u => u.email === email);
  if (existing) { throw new Error('Account already exists'); }
  const user = { id: NetfluxUtils.uid('user'), email, password };
  users.push(user);
  saveUsers(users);
  return user;
}

export function verifyUser(email, password) {
  const users = getUsers();
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) throw new Error('Invalid credentials');
  return found;
}

