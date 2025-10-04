// src/utils/storage.js
const KEY = "freelandser_users_v1";

export function getDB() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { users: [] };
  } catch {
    return { users: [] };
  }
}

export function setDB(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function getUserByWallet(walletAddress) {
  if (!walletAddress) return null;
  const db = getDB();
  return (
    db.users.find(
      (u) => u.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
    ) || null
  );
}

export function upsertUser(user) {
  const db = getDB();
  const i = db.users.findIndex(
    (u) => u.walletAddress?.toLowerCase() === user.walletAddress?.toLowerCase()
  );
  if (i > -1) db.users[i] = { ...db.users[i], ...user };
  else db.users.push(user);
  setDB(db);
  return user;
}

export function updateUser(walletAddress, patch) {
  const db = getDB();
  const i = db.users.findIndex(
    (u) => u.walletAddress?.toLowerCase() === walletAddress?.toLowerCase()
  );
  if (i === -1) return null;
  db.users[i] = { ...db.users[i], ...patch };
  setDB(db);
  return db.users[i];
}
