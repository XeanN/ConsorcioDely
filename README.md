# Consorcio Dely — sitio web

Sitio institucional + catálogo de productos para **Consorcio Dely S.A.C.**
(fabricación, envasado y distribución de abarrotes). El panel administrativo
permite al cliente gestionar su catálogo de productos y las ejecutivas de
venta que reciben cotizaciones por WhatsApp; el resto del contenido del sitio
(textos, categorías, marcas, datos legales) se administra internamente por
código.

**Sitio en producción:** https://consorciodely-web.angel-xp-pb.workers.dev

## Stack

| Pieza | Tecnología | Por qué |
|---|---|---|
| Framework | Next.js 16 (App Router) | — |
| Hosting | Cloudflare Workers (vía [OpenNext](https://opennext.js.org/cloudflare)) | Gratis para uso comercial, CDN global, sin límite de ancho de banda |
| Base de datos | Neon Postgres | Postgres serverless, capa gratis generosa |
| Acceso a datos (app) | SQL crudo vía [`@neondatabase/serverless`](https://github.com/neondatabase/serverless) | Ver nota abajo — Prisma Client no funciona de forma confiable en el runtime de Workers |
| Acceso a datos (scripts) | Prisma + `pg` | Los scripts corren en Node normal, sin restricciones de Workers |
| Imágenes | Cloudflare R2 | Sin costo de egress, bucket público para servir directo |
| Auth | Cookie de sesión firmada (HMAC-SHA256, Web Crypto) | Un solo rol de usuario — no vale la pena el riesgo de compatibilidad de Auth.js/NextAuth con Workers |
| CI/CD | GitHub Actions | Build + deploy automático en cada push a `main` |
| Estilos | Tailwind CSS 4 | — |

### Por qué SQL crudo y no Prisma en la app

Esto es importante si vas a tocar `src/lib/db.ts` o cualquier Server
Action/página: **la app en producción (todo lo que corre dentro del Worker
de Cloudflare) usa `sql()` de `@neondatabase/serverless`, no Prisma Client.**

Se intentó tres veces hacer funcionar el motor de queries de Prisma dentro
del runtime de Workers (que exige que los módulos WebAssembly se carguen
como imports estáticos, no compilados en tiempo de ejecución) y cada intento
falló de una forma distinta — ver el historial de commits alrededor de
`fix: bypass Prisma's WASM query compiler for the Workers app entirely` para
el detalle completo. La solución fue dejar de pelear contra el bundler:
las páginas/Server Actions que corren en el Worker usan SQL directo, y
Prisma se reserva para los **scripts** (`scripts/*.ts`), que corren en Node
normal vía `tsx` y nunca se empaquetan para Workers.

Si necesitas agregar una consulta nueva en una página o Server Action, sigue
el patrón de `src/lib/actions/products.ts` (SQL crudo, `zod` para validar,
`revalidatePath`/`redirect` después de escribir).

## Estructura del proyecto

```
src/
  app/
    (site)/                  -> storefront público
      page.tsx                 home (hero, carrusel de categorías, muro de marcas...)
      catalogo/                 catálogo con sidebar de categorías + buscador
      catalogo/[categoria]/     misma vista filtrada a una categoría (mismo componente)
      producto/[slug]/          ficha de producto (SKU, presentación por caja, tabla nutricional)
      quienes-somos/ (+ historia, proposito, presencia, equipo)
      contacto/, legal/
    admin/
      login/                 -> login, fuera del layout protegido
      (protected)/           -> todo lo que requiere sesión (sidebar + guard + proxy.ts)
        productos/           -> CRUD de productos (lo usa el cliente)
        ejecutivas/           -> CRUD de números de WhatsApp (lo usa el cliente)
        redes-sociales/       -> edita Facebook/Instagram/X/TikTok/YouTube (lo usa el cliente)
    api/upload/               -> Route Handler: sube imágenes a R2
    sitemap.ts, robots.ts     -> SEO dinámico
  proxy.ts                   -> bloquea /admin no autenticado ANTES de renderizar
                                 (antes "middleware.ts" — ver nota de seguridad abajo)
  components/
    admin/                   -> formularios y listas del panel
    site/                    -> Header, Footer, ProductCard, CatalogFilter,
                                 CategoryCarousel, BrandWall, FloatingWhatsApp...
  lib/
    db.ts                    -> sql() — cliente de Neon para la app (sin Prisma)
    actions/                 -> Server Actions, un archivo por dominio
    category-images.ts       -> imagen de referencia por categoría (slug -> URL)
    session.ts, whatsapp.ts, media.ts, slug.ts, id.ts
prisma/
  schema.prisma              -> fuente de verdad del modelo de datos
  migrations/                -> migraciones aplicadas
scripts/
  seed-admin.ts                  -> crea/actualiza el usuario admin
  seed-catalog-taxonomy.ts       -> categorías/marcas base (interno, no editable desde el panel)
  seed-catalog-products.ts       -> catálogo real original (11 productos del PDF inicial)
  seed-catalog-batch2.ts         -> segundo lote: ~34 categorías y ~63 marcas adicionales
  split-variants-into-products.ts -> migración ya ejecutada (ver "Un producto = un tamaño" abajo)
  update-aceite-lenysol-details.ts / -nutrition.ts -> SKU/caja/descripción/tabla nutricional reales
  update-mermelada-lenysol-nutrition.ts            -> tabla nutricional real (con % por 100 g)
  seed-site-content.ts           -> textos del sitio, configuración, ejecutivas iniciales
.github/workflows/deploy.yml  -> build + deploy en cada push a main
wrangler.jsonc                 -> bindings de Cloudflare (R2, variables públicas)
```

### Un producto = un tamaño (no hay variantes agrupadas)

El modelo `Variant` sigue existiendo en el schema, pero **ya no se usa para
los productos reales**: por pedido del cliente, cada tamaño/presentación
(ej. "Aceite Vegetal Lenysol 200 ml" y "...5 L Botella Amarilla") es su
propio `Product` — propia card, propia ficha/URL, se activa/desactiva por
separado. `sku` y `packSize` ("Caja x N Unidades") viven directamente en
`Product` (no en `Variant`) por este motivo. La migración que separó los
productos agrupados originales ya corrió (`split-variants-into-products.ts`)
y no hace falta volver a correrla.

## Requisitos previos

- Node.js 22+
- pnpm (`corepack enable` si no lo tienes, o `npm i -g pnpm`)
- Una cuenta de [Neon](https://neon.tech) con un proyecto Postgres creado
- Para desplegar: cuenta de Cloudflare con Workers y R2 activados

## Configuración local, paso a paso

1. **Clona el repo e instala dependencias:**

   ```bash
   git clone https://github.com/XeanN/ConsorcioDely.git
   cd ConsorcioDely
   pnpm install
   ```

   `pnpm install` corre automáticamente `prisma generate` y `wrangler types`
   (genera `cloudflare-env.d.ts`, los tipos de los bindings de Cloudflare) —
   no necesitas correr nada aparte.

2. **Copia `.env.example` a `.env`** y completa los valores:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` / `DIRECT_URL`: desde tu proyecto en Neon → **Connection
     Details** → copia la variante **Pooled** (para `DATABASE_URL`) y la
     **Direct** (para `DIRECT_URL`, sin `-pooler` en el host).
   - `AUTH_SECRET`: genera uno con
     `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`: las credenciales que quieras
     para tu primer usuario admin.
   - `MEDIA_PUBLIC_BASE_URL`: la URL pública de tu bucket R2 (ver sección
     "Cloudflare" más abajo) — en local puedes dejar cualquier valor si
     todavía no vas a probar subida de imágenes.
   - `SITE_URL`: `http://localhost:3000` está bien para desarrollo local.

3. **Crea las tablas en tu base de Neon:**

   ```bash
   pnpm exec prisma migrate deploy
   ```

4. **Carga los datos iniciales** (en este orden — categorías/marcas antes
   que productos):

   ```bash
   pnpm run seed:admin      # tu usuario para entrar a /admin
   pnpm run seed:taxonomy   # categorías y marcas
   pnpm run seed:products   # catálogo real del PDF (opcional, útil para probar)
   pnpm run seed:content    # textos del sitio, datos de contacto, ejecutivas
   ```

   Todos son idempotentes — puedes volver a correrlos sin duplicar datos.

5. **Levanta el servidor:**

   ```bash
   pnpm dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) para el sitio público,
   y [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   para el panel (con el email/password que pusiste en `SEED_ADMIN_EMAIL`).

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo (Next.js, Turbopack) |
| `pnpm build` | Build de producción (valida que todo compile) |
| `pnpm lint` | ESLint |
| `pnpm run seed:admin` | Crea/actualiza el usuario admin (lee `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` de `.env`) |
| `pnpm run seed:taxonomy` | Crea las categorías y marcas base |
| `pnpm run seed:products` | Carga el catálogo real (productos + presentaciones) |
| `pnpm run seed:content` | Carga textos del sitio, `site_settings` y ejecutivas de venta |
| `pnpm run cf-typegen` | Regenera `cloudflare-env.d.ts` a mano (ya corre solo en `postinstall`) |
| `pnpm run preview` | Compila para Workers y lo sirve localmente con `wrangler` (⚠️ no funciona en Windows nativo, ver abajo) |
| `pnpm run deploy` | Compila y despliega a Cloudflare Workers a mano (normalmente lo hace CI) |

## Panel administrativo

Login: `/admin/login`. Después de entrar, el cliente solo tiene acceso a:

- **Productos** (`/admin/productos`): crear, editar, eliminar, mostrar/ocultar
  cada producto (nombre, categoría, marca, foto, SKU, "Caja x N Unidades",
  descripción, tabla nutricional). Elige categoría y marca de listas ya
  creadas — no puede crear categorías/marcas nuevas desde acá (ver siguiente
  sección). Como cada tamaño es su propio producto (ver nota arriba), cada
  uno se edita por separado; la sección "Presentaciones" dentro de la ficha
  queda para el caso excepcional de que un mismo producto sí tenga variantes.
- **Ejecutivas** (`/admin/ejecutivas`): números de WhatsApp para el reparto
  aleatorio de cotizaciones (botón "Cotizar" en cada producto y el botón
  flotante del sitio eligen una ejecutiva activa al azar).
- **Redes sociales** (`/admin/redes-sociales`): URLs de Facebook, Instagram,
  X, TikTok y YouTube — se muestran como íconos en el footer solo si están
  configuradas.

La protección de `/admin` corre en `src/proxy.ts` (edge, antes de que
cualquier página se renderice) — no solo en el layout — porque un
`redirect()` dentro de un layout no evita que páginas hijas ya hayan hecho
sus queries a la base antes de que el redirect surta efecto (se detectó con
`curl` directo a una ruta protegida: el redirect llegaba bien, pero el
payload de React ya traía datos reales filtrados). Si agregas una ruta
nueva bajo `/admin`, confirma que el `matcher` de `proxy.ts` la cubra.

### Lo que NO tiene pantalla en el panel (a propósito)

Categorías, marcas, textos del sitio ("quiénes somos", legales) y la
configuración general (teléfono, dirección, RUC) se manejan **por código**,
no por UI — son datos que cambian con poca frecuencia y su gestión quedó
deliberadamente fuera del panel del cliente. Para actualizarlos:

- Categorías/marcas nuevas → edita `scripts/seed-catalog-taxonomy.ts` (lote
  original) o `scripts/seed-catalog-batch2.ts` (segundo lote, ~34 categorías
  más) y vuelve a correr el script correspondiente. Ambos son idempotentes:
  reutilizan categoría/marca si el slug ya existe, y si el producto
  categoría+marca ya existe no lo duplica.
- Textos del sitio, teléfono, dirección, RUC, etc. → edita
  `scripts/seed-site-content.ts` y corre `pnpm run seed:content`.
- SKU, "Caja x N Unidades", descripción y tabla nutricional por producto →
  no hay script genérico para esto todavía (son datos que el cliente va
  dando producto por producto). El patrón ya usado es un script chico de
  una sola vez, tipo `scripts/update-aceite-lenysol-details.ts`: un mapa
  `slug -> datos reales`, `UPDATE products ... WHERE slug = ...`. Cópialo
  para la siguiente marca/producto que el cliente mande.

## Despliegue

Cada push a `main` dispara `.github/workflows/deploy.yml`:

1. `pnpm install` + `pnpm run build` (build normal de Next.js).
2. `opennextjs-cloudflare build` (empaqueta para el runtime de Workers).
3. Si están configurados los secrets de Cloudflare, despliega con
   `opennextjs-cloudflare deploy`. Si no están, el build igual se valida
   pero el deploy se salta con una advertencia (no falla el workflow).

### Secrets necesarios en GitHub

`Settings → Secrets and variables → Actions → Repository secrets`:

- `CLOUDFLARE_API_TOKEN` — token con permisos de Workers (dashboard de
  Cloudflare → My Profile → API Tokens → plantilla "Edit Cloudflare
  Workers").
- `CLOUDFLARE_ACCOUNT_ID` — visible en cualquier vista de Workers & Pages
  del dashboard.

### Variables/secrets del Worker en producción

Estas **no** van en GitHub — se setean una vez directo en Cloudflare con
`wrangler secret put <NOMBRE>` (usando el mismo `CLOUDFLARE_API_TOKEN` de
arriba, exportado como variable de entorno local):

- `DATABASE_URL` — connection string pooled de Neon.
- `AUTH_SECRET` — el mismo valor que generaste para tu `.env` local.

Las variables que no son secretas (`MEDIA_PUBLIC_BASE_URL`, `SITE_URL`) están
declaradas directamente en `wrangler.jsonc` (`"vars"`) porque no hay ningún
problema en que sean públicas/estén en el repo.

### ⚠️ Compilar para Workers en Windows

`opennextjs-cloudflare build` **no funciona de forma confiable en Windows
nativo** (la propia herramienta lo advierte: necesita symlinks, que
requieren Developer Mode activado, y aun así hay fallas conocidas). Por eso
CI corre en `ubuntu-latest` — **no intentes depurar un build fallido de
Workers probando en tu máquina Windows**; confía en el resultado de GitHub
Actions, o usa WSL2 si necesitas iterar localmente.

## Variables de entorno

| Variable | Dónde se usa | Secreta |
|---|---|---|
| `DATABASE_URL` | App (Neon, pooled) y scripts | Sí |
| `DIRECT_URL` | Solo `prisma migrate` | Sí |
| `AUTH_SECRET` | Firma de la cookie de sesión del admin | Sí |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Solo `seed:admin`, no se usa en runtime | Sí (son credenciales) |
| `MEDIA_PUBLIC_BASE_URL` | Construir URLs públicas de imágenes de R2 | No |
| `SITE_URL` | Canonical, sitemap, JSON-LD, Open Graph | No |
| `GA_MEASUREMENT_ID` | Google Analytics 4 (`src/app/layout.tsx`) — vacío = desactivado | No |
| `GOOGLE_SITE_VERIFICATION` | Etiqueta de verificación de Search Console — vacío = desactivado | No |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | Solo CI/deploy, no en runtime de la app | Sí |

## Google Analytics y Search Console

El código ya está listo (`@next/third-parties` para GA4, `metadata.verification`
de Next.js para Search Console) pero **ninguno de los dos está activo
todavía** — faltan los IDs reales, que solo se consiguen entrando a cada
herramienta de Google (no se pueden generar desde acá). Correo disponible
para crear las propiedades: `consorciodely.digital@gmail.com`.

1. **Google Analytics 4**: entra a [analytics.google.com](https://analytics.google.com)
   con esa cuenta → crear propiedad → "Flujo de datos" tipo Web, con la URL
   del sitio (`https://consorciodely-web.angel-xp-pb.workers.dev`, o el
   dominio propio si ya está conectado) → copia el **Measurement ID**
   (`G-XXXXXXXXXX`).
2. **Search Console**: entra a [search.google.com/search-console](https://search.google.com/search-console)
   con la misma cuenta → "Agregar propiedad" → tipo **"Prefijo de URL"** (no
   "Dominio", porque no requiere verificación por DNS) → método de
   verificación **"Etiqueta HTML"** → copia solo el valor del atributo
   `content` (no la etiqueta completa).
3. Pega ambos valores en `wrangler.jsonc` → `"vars"` →
   `GA_MEASUREMENT_ID` y `GOOGLE_SITE_VERIFICATION`, y también en `.env`
   local si quieres probarlo en desarrollo. Confirma la verificación en
   Search Console (botón "Verificar") después de que el deploy con el
   nuevo valor esté en producción.
4. Una vez verificado en Search Console, envía el sitemap: Search Console →
   "Sitemaps" → pega `sitemap.xml` (la ruta completa ya la genera
   `src/app/sitemap.ts` dinámicamente desde la base de datos).

## Infraestructura ya creada en Cloudflare

- **Worker**: `consorciodely-web`
- **R2**: bucket `consorciodely-media`, con acceso público habilitado
  (dominio `pub-*.r2.dev`)
- **Hyperdrive**: `consorciodely-db` — quedó creado pero **sin usar** (era
  para el driver `pg`, se reemplazó por `@neondatabase/serverless`; no
  cuesta nada dejarlo, se puede borrar sin afectar nada)

## Roadmap

Ver `Extras/Ideas Web.pdf` para el brief original. Fases del plan inicial:

1. ✅ Autenticación del panel admin
2. ✅ Subida de imágenes a R2
3. ✅ CRUD de productos + catálogo real cargado
4. ✅ Contenido, configuración y ejecutivas (datos reales)
5. ✅ Storefront público
6. ✅ SEO técnico (sitemap, robots, JSON-LD, metadata, canonical)
7. ⏳ Dominio propio + QA final de lanzamiento — **sigue pendiente**, el
   sitio corre en `*.workers.dev`

Agregado después, fuera del plan original:

- Branding real (colores/logo de dely.pe), mapa de Google en Contacto,
  botón flotante de WhatsApp.
- CRUD de Ejecutivas y de Redes sociales en el panel.
- Segundo lote de catálogo: ~34 categorías y ~63 marcas más (ver
  `seed-catalog-batch2.ts`) — **106 productos en total** en la base.
- Migración "un producto = un tamaño" (ver sección arriba) — SKU y
  "Caja x N Unidades" pasaron de `Variant` a `Product`.
- Carrusel de categorías y muro de marcas en el home (`CategoryCarousel`,
  `BrandWall`), catálogo con sidebar de categorías + buscador (reemplaza
  la vista agrupada anterior).
- Corrección de seguridad: `src/proxy.ts` bloquea `/admin` antes de
  renderizar (ver sección "Panel administrativo").
- Limpieza de contenido: se quitaron afirmaciones de "distribución a nivel
  nacional" y una cifra inventada de colaboradores — **la empresa no
  distribuye ni hace reparto todavía**, solo atiende de forma física en
  tienda, por WhatsApp y por llamada. Si agregas texto nuevo al sitio, no
  reintroduzcas lenguaje de reparto/cobertura nacional/envíos a menos que
  el cliente confirme que eso cambió.
- Google Analytics 4 y Search Console: código listo, falta activar con los
  IDs reales (ver sección arriba).

### Pendientes / para retomar en otra sesión

- **SKU, caja y tabla nutricional reales**: solo cargados para Aceite
  Vegetal Lenysol (10 productos) y Mermelada Lenysol (3 productos). Los
  otros ~93 productos del segundo lote (y el resto del catálogo original)
  siguen sin esos datos — se completan producto por producto a medida que
  el cliente los va dando (ver patrón de script en la sección de arriba).
- **Fotos reales de producto**: la mayoría de productos todavía usa fotos
  de stock genéricas (Unsplash) como referencia visual, no fotos reales
  del producto. El cliente las puede subir desde el panel cuando las
  tenga; mientras tanto son conocidas y aceptadas como referenciales.
- **Google Analytics / Search Console**: código lista, falta que el
  cliente genere los IDs en Google (ver sección dedicada arriba) y los
  pegue en `wrangler.jsonc`.
- **Dominio propio**: Fase 7 del plan original, no iniciada.
- Antes de dar por cerrado cualquier trabajo nuevo: `pnpm run lint` +
  `pnpm run build` en local, y confirmar el deploy en GitHub Actions +
  spot-check en el sitio en vivo (el build de Workers no es confiable en
  Windows nativo, ver advertencia arriba — confía en CI).
