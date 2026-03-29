# e-modal

Un sistema de modales pensado para gente que no quiere pelearse con CSS ni JavaScript.

Lo enchufás… y funciona.
Literal.

---

## ¿Qué es esto?

**e-modal** es un script que te permite abrir modales usando solo HTML.

Sin frameworks.
Sin configurar nada raro.
Sin escribir funciones.

Es como darle superpoderes a un `<button>`.

---

## ¿Qué hace?

* Abre modales con un click
* Tiene animaciones listas
* Incluye estilos (dark, light, glass)
* Botones automáticos
* Cierre con click afuera o ESC
* Todo con atributos `data-*`

---

## Instalación

Solo agregás esto:

```html
<script src="https://e-cdn.github.io/libs/modal/v1_app.js"></script>
```

Y ya está.

No hay paso 2.

---

## Uso básico (sin JS)

```html
<button 
  data-modal
  data-title="Hola"
  data-content="Esto es un modal"
>
  Abrir
</button>
```

Click → aparece el modal.

---

## Opciones disponibles

Todo se configura con atributos HTML.

---

### Título y contenido

```html
data-title="Título"
data-content="Texto del modal"
```

---

### Animaciones

```html
data-animation="slide"
```

* `slide` → entra desde abajo
* (default) → zoom

---

### Temas

```html
data-theme="light"
data-theme="glass"
```

* `light` → fondo blanco
* `glass` → efecto vidrio
* (default) → oscuro

---

### Botones

```html
data-buttons="Cancelar:light,Aceptar:primary"
```

Formato:

```
Texto:tipo
```

Tipos:

* `primary`
* `danger`
* `light`

---

### Cerrar al hacer click afuera

```html
data-close-outside="false"
```

Por defecto está activado.

---

## Ejemplo completo

```html
<button 
  data-modal
  data-title="Confirmación"
  data-content="¿Estás seguro?"
  data-theme="glass"
  data-animation="slide"
  data-buttons="No:light,Sí:primary">
  Abrir modal
</button>
```

---

## Versiones

### v1_app.js

Primera versión estable.

✔ Modales funcionales
✔ HTML-only (sin JS)
✔ Animaciones básicas
✔ Temas incluidos
✔ Botones configurables

---

## Filosofía

Esto no intenta competir con React ni nada raro.

Es simplemente:

> “quiero un modal rápido sin pensar demasiado”

Y listo.

---

## Futuro

Ideas para próximas versiones:

* inputs dentro del modal
* formularios sin JS
* múltiples modales abiertos
* animaciones más avanzadas
* integración con otros módulos

---

## Ecosistema

Forma parte de:

* e-core → base
* e-modal → modales
* e-router → navegación
* e-store → estado
* e-fetch → datos

---

## Nota final

Si algo no funciona:

* revisá que el script cargue bien
* revisá que el botón tenga `data-modal`
* probá recargar

Si todo eso falla… bueno, ahí sí es magia negra 

---

Disfrutalo
