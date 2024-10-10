# Anonymous Messenger - Frontend

Anonymous Messenger es una aplicación de mensajería anónima que permite a los usuarios intercambiar mensajes de forma segura y encriptada. Los mensajes se eliminan automáticamente después de 24 horas. La aplicación está diseñada para funcionar en la red de Tor y utiliza un manejo de claves públicas y privadas para garantizar la privacidad y seguridad de las comunicaciones.

## Características Principales

- **Mensajes anónimos**: Los usuarios no necesitan registrarse, solo elegir un nombre de usuario al iniciar un chat.
- **Llaves públicas**: Los usuarios comparten llaves públicas para iniciar o unirse a un chat.
- **Mensajes autodestructivos**: Los mensajes se eliminan después de 24 horas.
- **Envío de archivos**: Se pueden enviar imágenes o archivos adjuntos.
- **Previsualización de archivos**: Los archivos seleccionados pueden previsualizarse antes de ser enviados.

## Tecnologías Utilizadas

- **Frontend**: React, Vite, Tailwind CSS
- **Rutas**: React Router para navegación
- **Manejo de Estados**: React Hooks (`useState`, `useEffect`)

---

## Instalación y Configuración

1. Clona el repositorio:

    ```bash
    git clone https://github.com/MrCifristo/Freedom_Project.git
    cd anonymous-messenger
    ```

2. Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

3. Inicia el servidor de desarrollo:

    ```bash
    npm run dev
    ```

4. Abre la aplicación en tu navegador:

    ```
    http://localhost:5173
    ```

---

## Estructura del Proyecto

```bash
├── src
│   ├── components
│   │   ├── Header.jsx          # Encabezado global
│   │   ├── ChatBox.jsx         # Componente del chat con previsualización de archivos y envío de mensajes
│   └── pages
│       ├── Home.jsx            # Página principal
│       ├── ChatsFeed.jsx       # Página de chats activos, crear o unirse a chats
├── App.jsx                     # Punto de entrada de la aplicación
├── index.css                   # Estilos globales con Tailwind
└── main.jsx                    # Configuración inicial de React y Vite

```
## Instrucciones de Uso

### Crear un nuevo chat
1. Haz clic en el botón "Crear Nuevo Chat" en la página de Chats Activos.

2. Se generará una llave pública. Puedes copiarla y compartirla con otros usuarios para que se unan al chat.

3. Se abrirá una nueva pestaña con el nuevo chat.

### Unirse a un chat existente
1. ntroduce la llave pública de un chat existente en el campo correspondiente en "Unirse a un Chat".
2. Haz clic en el botón "Unirse".
### Envío de mensajes y archivos
1. Escribe tu mensaje en el campo de texto.
2. Para enviar archivos, haz clic en el botón "Seleccionar Archivo" y selecciona un archivo.
3. Haz clic en "Enviar" o presiona Enter para enviar el mensaje o archivo.
4. Si se selecciona un archivo, verás una previsualización antes de enviarlo.
