// Use relative paths so API calls work regardless of domain/port
// This works for both local (http://localhost:3001) and Railway deployments
const apiBase = '/patients';
const doctorsApi = '/doctors';
const apptsApi = '/appointments';

const tabs = ['welcomeSection','patientsSection','doctorsSection','appointmentsSection'];
const show = id => {
  tabs.forEach(s=>document.getElementById(s).classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  // update active state
  document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
  if(id === 'patientsSection') document.getElementById('tabPatients').classList.add('active');
  if(id === 'doctorsSection') document.getElementById('tabDoctors').classList.add('active');
  if(id === 'appointmentsSection') document.getElementById('tabAppointments').classList.add('active');
};
document.getElementById('tabPatients').onclick = ()=>show('patientsSection');
document.getElementById('tabDoctors').onclick = ()=>show('doctorsSection');
document.getElementById('tabAppointments').onclick = ()=>show('appointmentsSection');
document.getElementById('enterDashboardBtn').onclick = ()=>show('patientsSection');

async function loadPatients(){
  try {
    const res = await fetch(`${apiBase}`);
    const patients = await res.json();
    const body = document.getElementById('patientsTable');
    body.innerHTML = patients.map(p => `
      <tr id="p-${p.id}">
        <td>${p.id}</td>
        <td id="pname-${p.id}">${p.name}</td>
        <td id="pemail-${p.id}">${p.email||''}</td>
        <td id="pnotes-${p.id}">${p.notes||''}</td>
        <td class="actions small"><button onclick="editPatient(${p.id})">Edit</button><button onclick="deletePatient(${p.id})" class="danger">Delete</button></td>
      </tr>`).join('');
    populatePatientSelect(patients);
  } catch(e) { console.error(e); }
}

document.getElementById('patientForm').onsubmit = async e=>{e.preventDefault();const body={ name: document.getElementById('p-name').value, email: document.getElementById('p-email').value, notes: document.getElementById('p-notes').value };try{const res = await fetch(`${apiBase}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });if(!res.ok){ alert('Failed to add patient'); return }document.getElementById('patientForm').reset();await loadPatients();}catch(err){alert('Error: '+err.message)}};

window.editPatient = function(id){const nameEl = document.getElementById(`pname-${id}`);const emailEl = document.getElementById(`pemail-${id}`);nameEl.innerHTML = `<input id="edit-name-${id}" value="${nameEl.innerText}">`;emailEl.innerHTML = `<input id="edit-email-${id}" value="${emailEl.innerText}">`;const row = document.getElementById(`p-${id}`);row.querySelector('.actions').innerHTML = `<button onclick="savePatient(${id})">Save</button><button onclick="loadPatients()">Cancel</button>`;};

window.savePatient = async function(id){const body = { name: document.getElementById(`edit-name-${id}`).value, email: document.getElementById(`edit-email-${id}`).value };try{const res = await fetch(`${apiBase}/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});if(!res.ok) throw new Error('Update failed');await loadPatients();}catch(e){alert(e.message)}};

window.deletePatient = async function(id){if(!confirm('Delete patient?')) return;try{ await fetch(`${apiBase}/${id}`, { method:'DELETE' }); document.getElementById(`p-${id}`).remove(); }catch(e){alert('Delete failed')}};

function populatePatientSelect(patients){const sel = document.getElementById('a-patient');sel.innerHTML = patients.map(p=>`<option value="${p.id}">${p.name} (${p.id})</option>`).join('');}

async function loadDoctors(){
  try{
    const res = await fetch(doctorsApi);
    const doctors = await res.json();
    const body = document.getElementById('doctorsTable');
    body.innerHTML = doctors.map(d=>`<tr id="d-${d.id}"><td>${d.id}</td><td id="dname-${d.id}">${d.name}</td><td id="dspec-${d.id}">${d.specialty||''}</td><td class="actions small"><button onclick="editDoctor(${d.id})">Edit</button><button onclick="deleteDoctor(${d.id})">Delete</button></td></tr>`).join('');
    const sel = document.getElementById('a-doctor');
    sel.innerHTML = doctors.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  }catch(e){console.error(e)}
}

window.editDoctor = function(id){
  const nameEl = document.getElementById(`dname-${id}`);
  const specEl = document.getElementById(`dspec-${id}`);
  nameEl.innerHTML = `<input id="edit-dname-${id}" value="${nameEl.innerText}">`;
  specEl.innerHTML = `<input id="edit-dspec-${id}" value="${specEl.innerText}">`;
  const row = document.getElementById(`d-${id}`);
  row.querySelector('.actions').innerHTML = `<button onclick="saveDoctor(${id})">Save</button><button onclick="loadDoctors()">Cancel</button>`;
};

window.saveDoctor = async function(id){
  const body = { name: document.getElementById(`edit-dname-${id}`).value, specialty: document.getElementById(`edit-dspec-${id}`).value };
  try{
    const res = await fetch(`${doctorsApi}/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    if(!res.ok) throw new Error('Update failed');
    await loadDoctors();
  }catch(e){alert(e.message)}
};

document.getElementById('doctorForm').onsubmit = async e=>{e.preventDefault();const body = { name: document.getElementById('d-name').value, specialty: document.getElementById('d-specialty').value };try{const res = await fetch(doctorsApi, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });if(!res.ok) throw new Error('Failed to create doctor');document.getElementById('doctorForm').reset();await loadDoctors();}catch(e){alert(e.message)}};
window.deleteDoctor = async id=>{ if(!confirm('Delete doctor?')) return; try{ await fetch(`${doctorsApi}/${id}`,{ method:'DELETE' }); loadDoctors(); }catch(e){alert('Delete failed')} };

async function loadAppointments(){
  try{
    const res = await fetch(apptsApi);
    const appts = await res.json();
    const rows = appts.map(a=>`<tr id="a-${a.id}"><td>${a.id}</td><td id="ap-p-${a.id}">${a.patient?.name||''}</td><td id="ap-d-${a.id}">${a.doctor?.name||''}</td><td id="ap-t-${a.id}">${a.datetime}</td><td class="actions small"><button onclick="editAppointment(${a.id})">Edit</button><button onclick="deleteAppointment(${a.id})">Delete</button></td></tr>`).join('');
    document.getElementById('appointmentsTable').innerHTML = rows;
  }catch(e){console.error(e)}
}

window.editAppointment = async function(id){
  try{
    const [aRes, pRes, dRes] = await Promise.all([fetch(`${apptsApi}/${id}`), fetch(apiBase), fetch(doctorsApi)]);
    if(!aRes.ok) throw new Error('Failed fetching appointment');
    const appt = await aRes.json();
    const patients = await pRes.json();
    const doctors = await dRes.json();
    const row = document.getElementById(`a-${id}`);
    const patientOptions = patients.map(p=>`<option value="${p.id}" ${p.id===appt.patient?.id? 'selected':''}>${p.name}</option>`).join('');
    const doctorOptions = doctors.map(d=>`<option value="${d.id}" ${d.id===appt.doctor?.id? 'selected':''}>${d.name}</option>`).join('');
    const dtVal = appt.datetime ? new Date(appt.datetime).toISOString().slice(0,16) : '';
    row.innerHTML = `<td>${id}</td><td><select id="edit-ap-p-${id}">${patientOptions}</select></td><td><select id="edit-ap-d-${id}">${doctorOptions}</select></td><td><input id="edit-ap-t-${id}" type="datetime-local" value="${dtVal}"></td><td class="actions small"><button onclick="saveAppointment(${id})">Save</button><button onclick="loadAppointments()">Cancel</button></td>`;
  }catch(e){alert(e.message)}
};

window.saveAppointment = async function(id){
  try{
    const body = { patientId: Number(document.getElementById(`edit-ap-p-${id}`).value), doctorId: Number(document.getElementById(`edit-ap-d-${id}`).value), datetime: document.getElementById(`edit-ap-t-${id}`).value };
    const res = await fetch(`${apptsApi}/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    if(!res.ok) throw new Error('Update failed');
    await loadAppointments();
  }catch(e){alert(e.message)}
};

document.getElementById('appointmentForm').onsubmit = async e=>{e.preventDefault();const body = { patientId: Number(document.getElementById('a-patient').value), doctorId: Number(document.getElementById('a-doctor').value), datetime: document.getElementById('a-datetime').value };try{const res = await fetch(apptsApi, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });if(!res.ok) throw new Error('Failed to create appointment');document.getElementById('appointmentForm').reset();await loadAppointments();}catch(e){alert(e.message)}};
window.deleteAppointment = async id=>{ if(!confirm('Delete appointment?')) return; try{ await fetch(`${apptsApi}/${id}`,{ method:'DELETE' }); loadAppointments(); }catch(e){alert('Delete failed')} };

loadPatients(); loadDoctors(); loadAppointments();
// show welcome first
show('welcomeSection');
