const WEBHOOK_URL = 'https://linat92.app.n8n.cloud/webhook/0c84e47b-16d3-44da-8546-73cfe120d1c3';

const SALAS = {
  APM5A1:  { nombre: 'Sala 5 - A1',       cap: 5  },
  APM5A2:  { nombre: 'Sala 5 - A2',       cap: 5  },
  APM5A3:  { nombre: 'Sala 5 - A3',       cap: 5  },
  APM10B1: { nombre: 'Sala 10 - B1',      cap: 10 },
  APM10B2: { nombre: 'Sala 10 - B2',      cap: 10 },
  APM10B3: { nombre: 'Sala 10 - B3',      cap: 10 },
  APM10B4: { nombre: 'Sala 10 - B4',      cap: 10 },
  APM10B5: { nombre: 'Sala 10 - B5',      cap: 10 },
  APM25C1: { nombre: 'Sala 25 - C1',      cap: 25 },
  APM50D1: { nombre: 'Auditorio 50 - D1', cap: 50 }
};

document.getElementById('fecha').min = new Date().toISOString().split('T')[0];

function actualizarSala() {
  const id   = document.getElementById('sala_id').value;
  const info = document.getElementById('sala-info');
  info.textContent = (id && SALAS[id]) ? `Capacidad: ${SALAS[id].cap} personas` : '';
}

function mostrarError(id, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById('err-' + id);
  if (el)  el.classList.add('error');
  if (err) {
    if (msg) err.textContent = msg;
    err.classList.add('visible');
  }
}

function limpiarError(id) {
  const el  = document.getElementById(id);
  const err = document.getElementById('err-' + id);
  if (el)  el.classList.remove('error');
  if (err) err.classList.remove('visible');
}

function limpiarTodosErrores() {
  ['titulo','area','organizador','email','sala_id','asistentes','fecha','hora_inicio','hora_fin']
    .forEach(limpiarError);
}

function mostrarToast(msg, tipo) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (tipo === 'success' ? 'success' : 'error-toast');
  setTimeout(() => { t.className = 'toast'; }, 5000);
}

function setLoading(val) {
  const btn = document.querySelector('.btn-submit');
  const txt = document.getElementById('btn-text');
  const spn = document.getElementById('spinner');
  btn.disabled      = val;
  txt.style.display = val ? 'none'  : 'block';
  spn.style.display = val ? 'block' : 'none';
}

async function enviarReserva() {
  limpiarTodosErrores();

  const val    = id => document.getElementById(id).value.trim();
  let   valido = true;

  ['titulo','area','organizador','email','sala_id','asistentes','fecha','hora_inicio','hora_fin']
    .forEach(c => {
      if (!val(c)) { mostrarError(c); valido = false; }
    });

  if (val('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) {
    mostrarError('email', 'Correo inválido');
    valido = false;
  }

  if (val('hora_inicio') && val('hora_fin') && val('hora_fin') <= val('hora_inicio')) {
    mostrarError('hora_fin', 'La hora fin debe ser mayor que inicio');
    valido = false;
  }

  const salaId     = val('sala_id');
  const asistentes = parseInt(val('asistentes'));
  if (salaId && SALAS[salaId] && asistentes > SALAS[salaId].cap) {
    mostrarError('asistentes', `La sala tiene cap. ${SALAS[salaId].cap}. Selecciona otra sala.`);
    valido = false;
  }

  if (!valido) return;

  const payload = {
    titulo:      val('titulo'),
    organizador: val('organizador'),
    email:       val('email'),
    area:        val('area'),
    fecha:       val('fecha'),
    hora_inicio: val('hora_inicio'),
    hora_fin:    val('hora_fin'),
    asistentes:  asistentes,
    sala_id:     salaId
  };

  setLoading(true);

  try {
    const res  = await fetch(WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      mostrarToast('Reserva procesada. Revisa tu correo.', 'success');
      ['titulo','area','organizador','email','asistentes','fecha','hora_inicio','hora_fin']
        .forEach(id => { document.getElementById(id).value = ''; });
      document.getElementById('sala_id').value        = '';
      document.getElementById('sala-info').textContent = '';
    } else {
      mostrarToast(data.error || data.motivo || 'Error al procesar la reserva', 'error');
    }
  } catch (e) {
    mostrarToast('No se pudo conectar con n8n. Verifica la URL del webhook.', 'error');
  } finally {
    setLoading(false);
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') enviarReserva();
});