
# Reservas de Salas Automatizadas

> Solución práctica que conecta una interfaz web con un flujo automatizado en n8n, usando IA para la toma de decisiones y Google Sheets como base de datos ligera.

---

## 🚀 ¿Cómo funciona?

1. El usuario llena el formulario de reserva en la web.
2. La solicitud se envía a un Webhook en n8n.
3. Un agente de IA analiza la información y consulta las reservas existentes en Google Sheets.
4. El sistema valida:
	- Disponibilidad de la sala
	- Conflictos de horario
	- Capacidad de asistentes
5. Según el resultado:
	- Se confirma la reserva o se rechaza con una sugerencia.
6. El usuario recibe automáticamente un correo con el resultado.

---

## 🛠️ Tecnologías utilizadas

- **Frontend:** HTML, CSS, JavaScript
- **Automatización:** n8n
- **IA:** OpenAI (GPT-4o mini)
- **Base de datos:** Google Sheets
- **Correo:** Gmail API
- **Despliegue:** Vercel

---

## 📂 Estructura del proyecto

- `index.html` — Interfaz web
- `styles.css` — Estilos
- `app.js` / `script.js` — Lógica de reserva
- `api/reserva.js` — API para conectar con n8n
- `.env` — Variables de entorno (URL de n8n)

---

## 📦 Instrucciones para desplegar y subir a GitHub

1. Clona el repositorio o descarga los archivos.
2. Crea un archivo `.env` con la URL de tu webhook de n8n.
3. Instala dependencias si aplica.
4. Inicializa git y sube a GitHub:
	```bash
	git init
	git add .
	git commit -m "Primer commit"
	git remote add origin https://github.com/usuario/tu-repo.git
	git push -u origin main
	```

---

## ✉️ Contacto

Para dudas o soporte, contacta a [tu-email@dominio.com](mailto:tu-email@dominio.com)