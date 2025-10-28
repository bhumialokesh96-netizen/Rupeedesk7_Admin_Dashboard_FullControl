import { auth, db, signOut, fetchCollection, addDocument, setDocument, updateDocument, deleteDocument, getDocument } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const adminInfo = document.getElementById('adminInfo');
const signOutBtn = document.getElementById('signOutBtn');
const usersList = document.getElementById('usersList');
const inventoryList = document.getElementById('inventoryList');
const modal = document.getElementById('modal');
const settingsStatus = document.getElementById('settingsStatus');

let currentAdmin = null;

// Tabs
document.getElementById('tabUsers').onclick = () => showTab('users');
document.getElementById('tabInventory').onclick = () => showTab('inventory');
document.getElementById('tabSettings').onclick = () => showTab('settings');

function showTab(name) {
  document.getElementById('usersSection').style.display = name === 'users' ? '' : 'none';
  document.getElementById('inventorySection').style.display = name === 'inventory' ? '' : 'none';
  document.getElementById('settingsSection').style.display = name === 'settings' ? '' : 'none';
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('tab' + name.charAt(0).toUpperCase() + name.slice(1)).classList.add('active');
}

// Auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location = 'index.html';
    return;
  }
  currentAdmin = user;
  adminInfo.textContent = 'Signed in: ' + (user.email || user.uid);
  loadUsers();
});

signOutBtn.onclick = async () => {
  await signOut(auth);
  window.location = 'index.html';
};

// Users
document.getElementById('refreshUsers').onclick = loadUsers;
document.getElementById('addUserBtn').onclick = () => openUserModal();

async function loadUsers() {
  usersList.innerHTML = '';
  const snap = await fetchCollection('users');
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const div = document.createElement('div');
    div.className = 'user-card';
    div.innerHTML = `<div><strong>${escapeHtml(d.name || '')}</strong></div>
                     <div>${escapeHtml(d.phone || docSnap.id)}</div>
                     <div>Balance: ₹${(d.balance||0).toFixed(2)}</div>
                     <div>Sent today: ${d.dailySent||0}</div>
                     <div class="card-actions">
                       <button data-id="${docSnap.id}" class="edit-user">Edit</button>
                       <button data-id="${docSnap.id}" class="delete-user">Delete</button>
                     </div>`;
    usersList.appendChild(div);
  });
  // attach handlers
  document.querySelectorAll('.edit-user').forEach(b => b.onclick = (e) => openUserModal(e.target.dataset.id));
  document.querySelectorAll('.delete-user').forEach(b => b.onclick = (e) => deleteUser(e.target.dataset.id));
}

function openUserModal(userId) {
  modal.style.display = 'block';
  modal.innerHTML = '';
  const isEdit = !!userId;
  const container = document.createElement('div');
  container.className = 'modal-card';
  container.innerHTML = `<h3>${isEdit ? 'Edit' : 'Add'} User</h3>
    <label>Name</label><input id="m_name" type="text" />
    <label>Phone (doc id)</label><input id="m_phone" type="text" />
    <label>Balance</label><input id="m_balance" type="number" step="0.01" />
    <label>Daily Limit</label><input id="m_limit" type="number" />
    <div class="row"><button id="m_save">Save</button><button id="m_close">Close</button></div>`;
  modal.appendChild(container);

  if (isEdit) {
    getDocument('users/' + userId).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        container.querySelector('#m_name').value = d.name || '';
        container.querySelector('#m_phone').value = d.phone || userId;
        container.querySelector('#m_balance').value = d.balance || 0;
        container.querySelector('#m_limit').value = d.dailyLimit || 50;
      }
    });
  }

  container.querySelector('#m_close').onclick = () => { modal.style.display = 'none'; };
  container.querySelector('#m_save').onclick = async () => {
    const data = {
      name: container.querySelector('#m_name').value,
      phone: container.querySelector('#m_phone').value,
      balance: parseFloat(container.querySelector('#m_balance').value) || 0,
      dailyLimit: parseInt(container.querySelector('#m_limit').value) || 50,
      dailySent: 0,
      blocked: false
    };
    const docId = container.querySelector('#m_phone').value;
    await setDocument('users/' + docId, data);
    modal.style.display = 'none';
    loadUsers();
  };
}

async function deleteUser(id) {
  if (!confirm('Delete user ' + id + '?')) return;
  await deleteDocument('users/' + id);
  loadUsers();
}

// Inventory
document.getElementById('refreshInv').onclick = loadInventory;
document.getElementById('addInvBtn').onclick = () => openInvModal();

async function loadInventory() {
  inventoryList.innerHTML = '';
  const snap = await fetchCollection('inventory');
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const div = document.createElement('div');
    div.className = 'inv-card';
    div.innerHTML = `<div><strong>${escapeHtml(d.message||'')}</strong></div>
                     <div>Target: ${escapeHtml(d.target||'')}</div>
                     <div>Price: ₹${(d.price||0).toFixed(2)}</div>
                     <div>Status: ${d.sent ? 'SENT' : 'PENDING'}</div>
                     <div class="card-actions">
                       <button data-id="${docSnap.id}" class="edit-inv">Edit</button>
                       <button data-id="${docSnap.id}" class="delete-inv">Delete</button>
                       <button data-id="${docSnap.id}" class="mark-sent">Mark Sent</button>
                     </div>`;
    inventoryList.appendChild(div);
  });
  document.querySelectorAll('.edit-inv').forEach(b => b.onclick = (e) => openInvModal(e.target.dataset.id));
  document.querySelectorAll('.delete-inv').forEach(b => b.onclick = (e) => deleteInv(e.target.dataset.id));
  document.querySelectorAll('.mark-sent').forEach(b => b.onclick = (e) => markInvSent(e.target.dataset.id));
}

function openInvModal(docId) {
  modal.style.display = 'block';
  modal.innerHTML = '';
  const isEdit = !!docId;
  const container = document.createElement('div');
  container.className = 'modal-card';
  container.innerHTML = `<h3>${isEdit ? 'Edit' : 'Add'} Inventory</h3>
    <label>Target (phone)</label><input id="i_target" type="text" />
    <label>Message</label><textarea id="i_message"></textarea>
    <label>Price</label><input id="i_price" type="number" step="0.01" value="0.20" />
    <label>Sent</label><select id="i_sent"><option value="false">false</option><option value="true">true</option></select>
    <div class="row"><button id="i_save">Save</button><button id="i_close">Close</button></div>`;
  modal.appendChild(container);

  if (isEdit) {
    getDocument('inventory/' + docId).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        container.querySelector('#i_target').value = d.target || '';
        container.querySelector('#i_message').value = d.message || '';
        container.querySelector('#i_price').value = d.price || 0.2;
        container.querySelector('#i_sent').value = d.sent ? 'true' : 'false';
      }
    });
  }

  container.querySelector('#i_close').onclick = () => { modal.style.display = 'none'; };
  container.querySelector('#i_save').onclick = async () => {
    const data = {
      target: container.querySelector('#i_target').value,
      message: container.querySelector('#i_message').value,
      price: parseFloat(container.querySelector('#i_price').value) || 0.2,
      sent: container.querySelector('#i_sent').value === 'true'
    };
    if (isEdit) {
      await updateDocument('inventory/' + docId, data);
    } else {
      await addDocument('inventory', data);
    }
    modal.style.display = 'none';
    loadInventory();
  };
}

async function deleteInv(id) {
  if (!confirm('Delete inventory ' + id + '?')) return;
  await deleteDocument('inventory/' + id);
  loadInventory();
}

async function markInvSent(id) {
  await updateDocument('inventory/' + id, { sent: true });
  loadInventory();
}

// Settings
document.getElementById('saveSettings').onclick = async () => {
  const rate = parseFloat(document.getElementById('rateInput').value) || 0.20;
  const limit = parseInt(document.getElementById('limitInput').value) || 50;
  await setDocument('config/settings', { ratePerSms: rate, dailyLimit: limit });
  settingsStatus.textContent = 'Saved';
};

// Utilities
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
