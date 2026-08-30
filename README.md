# Casa de Verano 🌊

Sitio simple para juntar las opciones de Airbnb y que la familia elija dónde alquilar en el verano.

## Cómo subirlo a GitHub Pages

1. Creá un repositorio nuevo en GitHub (puede ser público o privado si tenés GitHub Pro; para Pages gratis en cuentas free, tiene que ser público).
2. Subí estos 4 archivos a la raíz del repo: `index.html`, `style.css`, `app.js`, `houses.json`.
3. En el repo, andá a **Settings → Pages**.
4. En "Source" elegí la rama `main` (o `master`) y la carpeta `/ (root)`. Guardá.
5. Esperá un minuto y GitHub te va a dar un link tipo `https://tu-usuario.github.io/nombre-repo/`. Compartí ese link con la familia.

## Cómo agregar una casa nueva

Abrí `houses.json` y agregá un bloque nuevo a la lista, con el próximo número de `id`. Por ejemplo:

```json
{
  "id": 11,
  "title": "Nombre corto de la casa",
  "location": "Ciudad / zona",
  "url": "https://www.airbnb.com.ar/rooms/XXXXXXXXXX",
  "image": "URL de una foto (opcional, se puede copiar el link de la imagen de portada de Airbnb)",
  "guests": 8,
  "bedrooms": 3,
  "beds": 6,
  "baths": 2,
  "rating": 4.8,
  "reviews": 5,
  "blurb": "Una frase corta describiendo la casa",
  "amenities": ["Parrilla", "Wifi", "Estacionamiento"],
  "notes": ""
}
```

Solo `id`, `title`, `location` y `url` son obligatorios — el resto se puede dejar vacío (`null`, `0` o `[]`) y la tarjeta lo omite automáticamente.

Guardá el archivo, subí el cambio a GitHub (commit) y la página se actualiza sola.

## Funciones del sitio

- **Filtrar por zona** y **ordenar** (mejor puntuadas, más camas, favoritas primero).
- **Favoritas (♥)**: cada persona puede marcar sus favoritas tocando el corazón. Esto se guarda solo en su propio navegador/dispositivo (no es compartido entre todos), así cada uno vota a su gusto sin pisar el voto de los demás.
- Cada tarjeta linkea directo al posteo original de Airbnb.
