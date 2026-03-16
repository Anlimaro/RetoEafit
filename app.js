const WEBHOOK_URL = 'https://linat92.app.n8n.cloud/webhook/0c84e47b-16d3-44da-8546-73cfe120d1c3';

async function enviarReserva() {
  limpiarTodosErrores();

  const val    = id => document.getElementById(id).value.trim();
  let   valido = true;

  ['titulo','area','organizador','email',,'asistentes','fecha','hora_inicio','hora_fin']
    .forEach(c => {
      if (!val(c)) { 
        mostrarError(c); 
        valido = false; 
      }
    });

  if (val('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) {
    mostrarError('email', 'Correo inválido');
    valido = false;
  }

  if (val('hora_inicio') && val('hora_fin') && val('hora_fin') <= val('hora_inicio')) {
    mostrarError('hora_fin', 'La hora fin debe ser mayor que inicio');
    valido = false;
  }

  const salaId = val('sala_id');
  const asistentes = parseInt(val('asistentes'));

  if (salaId && SALAS[salaId] && asistentes > SALAS[salaId].cap) {
    mostrarError('asistentes', `La sala tiene cap. ${SALAS[salaId].cap}. Selecciona otra sala.`);
    valido = false;
  }

  if (!valido) return;

  const payload = {
    titulo: val('titulo'),
    organizador: val('organizador'),
    correo: val('email'),
    area: val('area'),
    fecha: val('fecha'),
    hora_inicio: val('hora_inicio'),
    hora_fin: val('hora_fin'),
    asistentes: asistentes,
    sala_id: salaId
  };

  setLoading(true);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      mostrarToast('Reserva procesada. Revisa tu correo.', 'success');

      ['titulo','area','organizador','email','asistentes','fecha','hora_inicio','hora_fin']
        .forEach(id => {
          document.getElementById(id).value = '';
        });

      document.getElementById('sala_id').value = '';
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