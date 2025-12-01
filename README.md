ZenSlide 🖥️

[!NOTE]
Enfoque Zen: ZenSlide está diseñada para eliminar distracciones. No hay menús complejos, ni cientos de botones innecesarios. Solo tú y tu contenido, con una interfaz que fluye.

ZenSlide es una aplicación web minimalista y potente para crear presentaciones directamente desde el navegador. Ofrece una interfaz limpia, edición directa sobre las diapositivas ("WYSIWYG") y exportación a formatos estándar de la industria.

✨ Características Principales

🎨 Diseño Minimalista: Interfaz limpia que maximiza el espacio de trabajo.

✏️ Edición en vivo: Escribe directamente sobre las diapositivas. Lo que ves es lo que obtienes.

🧩 Plantillas Inteligentes: Selección rápida de estructuras: Título, Texto, Dos columnas, Citas y Datos grandes.

🖥️ Modo Presentación: Vista a pantalla completa sin distracciones para exponer tus ideas.

📱 Responsive: Funciona perfectamente tanto en escritorio como en dispositivos móviles.

📤 Exportación Real

A diferencia de otras herramientas web sencillas, ZenSlide genera archivos reales y útiles:

📄 PDF: Genera documentos de alta calidad listos para imprimir o compartir.

📊 PPTX: Crea archivos nativos de PowerPoint totalmente editables, mapeando tus textos a cajas de texto reales.

🛠️ Tecnologías Usadas

El proyecto está construido con un stack moderno para garantizar velocidad y mantenibilidad:

React: Librería principal de UI.

Vite: Empaquetador ultra-rápido para una experiencia de desarrollo fluida.

Tailwind CSS: Estilos y diseño responsivo sin salir del HTML.

Lucide React: Iconografía limpia y consistente.

PptxGenJS & jsPDF: Motores potentes para la generación de documentos en el cliente.

🚀 Instalación y Uso Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu ordenador en cuestión de segundos.

Prerrequisitos: Necesitas tener instalado Node.js en tu sistema.

# 1. Clonar el repositorio
git clone [https://github.com/ierikcraft/ZenSlide.git](https://github.com/ierikcraft/ZenSlide.git)
cd ZenSlide

# 2. Instalar dependencias
npm install

# 3. Ejecutar el proyecto
npm run dev


[!TIP]
Verás un enlace en la terminal (normalmente http://localhost:5173). ¡Ábrelo en tu navegador y listo!

⚠️ Solución de problemas comunes

[!WARNING]
Error de scripts en Windows (PowerShell):
Si al ejecutar npm recibes un error de seguridad en PowerShell, es porque Windows bloquea la ejecución de scripts por defecto. Ejecuta este comando como administrador para solucionarlo:

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser


[!IMPORTANT]
¿La web se ve sin estilos?
Si los estilos de Tailwind no cargan, asegúrate de que el servidor de desarrollo está corriendo correctamente. Si el problema persiste, el proyecto incluye una configuración de respaldo automática mediante CDN en index.html que cargará los estilos desde internet.

📦 Despliegue

Este proyecto está optimizado para ser desplegado en Vercel o Netlify. Simplemente importa este repositorio desde tu panel y el despliegue será automático.

Contribuyendo

¡Las Pull Requests son bienvenidas! Si tienes ideas para nuevas plantillas o mejoras en la exportación, no dudes en contribuir.

Licencia

ZenSlide está disponible bajo la licencia MIT.

<p align="center">
Creado con ❤️ por <a href="https://www.google.com/search?q=https://github.com/ierikcraft">ierikcraft</a>
</p>
