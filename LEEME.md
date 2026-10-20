# Nico · Fuera del guion — landing

Web de una sola página, sin nada que instalar: HTML, CSS y un poco de JavaScript.

```
index.html         la landing
privacidad.html    política de privacidad
aviso-legal.html   aviso legal
css/estilos.css    colores, tipografías y diseño
js/config.js       ← LO QUE VAS A EDITAR: fechas, plazas, precios, contacto, fotos, vídeo
js/main.js         comportamiento (no hace falta tocarlo)
favicon.svg        icono de la pestaña
img/               crea esta carpeta para tus fotos
```

## Cambiar fechas, plazas, condiciones o contacto

Abre `js/config.js` con cualquier editor de texto (el Bloc de notas sirve), cambia
el texto entre comillas y guarda. Ese valor cambia en todos los sitios de la web donde aparece.

Lo que todavía está pendiente aparece en la web con un **recuadro discontinuo**:
todo valor que empiece por `[` (por ejemplo `"[hola@tudominio.com]"`). Cuando
pongas el dato real, quita los corchetes y el recuadro desaparece.

Los textos largos (manifiesto, FAQ, listas) se editan directamente en `index.html`.
Cada sección está marcada con un comentario como `<!-- ===== 3 · QUÉ ES ===== -->`.

## Fotos y vídeo

1. Crea una carpeta `img/` y mete tus fotos (JPG, unos 1600 px de lado largo).
2. En `js/config.js`, escribe la ruta en el hueco correspondiente:
   - `retratoNico: "img/nico-retrato.jpg"` (portada, vertical 4:5)
   - `fotoNicoTrabajando: "img/nico-trabajando.jpg"` (manifiesto, vertical 4:5)
   - `fotoPlaza1`, `fotoPlaza2` (personas seleccionadas, cuadradas)
3. Vídeo del manifiesto: pega el enlace de YouTube o Vimeo en `videoManifiesto`.
   También vale un archivo propio: `"video/manifiesto.mp4"`.

Mientras un hueco esté vacío, se ve un marcador que dice qué foto va ahí.

## Recibir las respuestas por email (Web3Forms)

1. Entra en https://web3forms.com y escribe el email donde quieres recibir las respuestas.
2. Te llega una clave (*access key*) a ese correo.
3. Pégala en `js/config.js` → `web3formsKey: "tu-clave"`.

Con eso, cada aplicación y cada alta en la lista de espera te llega como un email,
con el asunto "Nueva aplicación · Temporada 0 — Nombre" o "Lista de espera · Comunidad — Nombre".
Puedes responder directamente desde tu correo.

Sin la clave, los formularios funcionan en **modo de prueba**: validan los campos,
pero no envían nada y lo avisan en pantalla.

El plan gratuito de Web3Forms cubre 250 envíos al mes.

## Publicar

### Opción A · GitHub Pages
1. Crea una cuenta en https://github.com y un repositorio nuevo, por ejemplo `fuera-del-guion`.
2. En el repositorio, pulsa **Add file → Upload files** y arrastra **el contenido** de esta carpeta
   (no la carpeta en sí: `index.html` tiene que quedar en la raíz).
3. Ve a **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)`, y guarda.
4. En un par de minutos estará en `https://TU-USUARIO.github.io/fuera-del-guion/`.

### Opción B · Vercel
1. Crea una cuenta en https://vercel.com (puedes entrar con GitHub).
2. **Add New → Project** e importa el repositorio de GitHub de la opción A.
   No hay que configurar nada: es una web estática.
3. Cada vez que cambies algo en GitHub, Vercel la vuelve a publicar sola.

Las dos opciones son gratuitas y permiten conectar tu dominio (.com o .es) cuando lo tengas.

## Antes de publicar, revisa

- [ ] Clave de Web3Forms puesta y una prueba enviada a ti mismo.
- [ ] Email de contacto, nombre, NIF y dirección en `config.js` (sin corchetes).
- [ ] Fecha de cierre y fecha de anuncio de la convocatoria.
- [ ] Tope de la parte del éxito (`tope`), si ya está decidido.
- [ ] Privacidad y aviso legal revisados por un asesor (son textos base).
- [ ] La línea opcional sobre tu pareja en el manifiesto sigue comentada hasta tener su permiso.
