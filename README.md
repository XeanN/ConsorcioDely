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
    (site)/                  -> storefront público (home, catálogo, producto, legal...)
    admin/
      login/                 -> login, fuera del layout protegido
      (protected)/           -> todo lo que requiere sesión (sidebar + guard)
        productos/           -> CRUD de productos (lo usa el cliente)
        ejecutivas/           -> CRUD de números de WhatsApp (lo usa el cliente)
    api/upload/               -> Route Handler: sube imágenes a R2
    sitemap.ts, robots.ts     -> SEO dinámico
  components/
    admin/                   -> formularios y listas del panel
    site/                    -> Header, Footer, ProductCard, FloatingWhatsApp...
  lib/
    db.ts                    -> sql() — cliente de Neon para la app (sin Prisma)
    actions/                 -> Server Actions, un archivo por dominio
    session.ts, whatsapp.ts, media.ts, slug.ts, id.ts
prisma/
  schema.prisma              -> fuente de verdad del modelo de datos
  migrations/                -> migraciones aplicadas
scripts/
  seed-admin.ts               -> crea/actualiza el usuario admin
  seed-catalog-taxonomy.ts    -> categorías y marcas (interno, no editable desde el panel)
  seed-catalog-products.ts    -> carga inicial del catálogo real del PDF
  seed-site-content.ts        -> textos del sitio, configuración, ejecutivas iniciales
.github/workflows/deploy.yml  -> build + deploy en cada push a main
wrangler.jsonc                 -> bindings de Cloudflare (R2, variables públicas)
```

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

- **Productos** (`/admin/productos`): crear, editar, eliminar, mostrar/ocultar,
  y administrar las presentaciones (peso/SKU/foto) de cada producto. Elige
  categoría y marca de listas ya creadas — no puede crear categorías/marcas
  nuevas desde acá (ver siguiente sección).
- **Ejecutivas** (`/admin/ejecutivas`): números de WhatsApp para el reparto
  aleatorio de cotizaciones (botón "Cotizar" en cada producto y el botón
  flotante del sitio eligen una ejecutiva activa al azar).

### Lo que NO tiene pantalla en el panel (a propósito)

Categorías, marcas, textos del sitio ("quiénes somos", legales) y la
configuración general (teléfono, dirección, RUC) se manejan **por código**,
no por UI — son datos que cambian con poca frecuencia y su gestión quedó
deliberadamente fuera del panel del cliente. Para actualizarlos:

- Categorías/marcas nuevas → edita `scripts/seed-catalog-taxonomy.ts` y
  vuelve a correr `pnpm run seed:taxonomy`.
- Textos del sitio, teléfono, dirección, RUC, etc. → edita
  `scripts/seed-site-content.ts` y corre `pnpm run seed:content`.

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
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | Solo CI/deploy, no en runtime de la app | Sí |

## Infraestructura ya creada en Cloudflare

- **Worker**: `consorciodely-web`
- **R2**: bucket `consorciodely-media`, con acceso público habilitado
  (dominio `pub-*.r2.dev`)
- **Hyperdrive**: `consorciodely-db` — quedó creado pero **sin usar** (era
  para el driver `pg`, se reemplazó por `@neondatabase/serverless`; no
  cuesta nada dejarlo, se puede borrar sin afectar nada)

## Roadmap

Ver `Extras/Ideas Web.pdf` para el brief original. Fases completadas:

1. ✅ Autenticación del panel admin
2. ✅ Subida de imágenes a R2
3. ✅ CRUD de productos + catálogo real cargado
4. ✅ Contenido, configuración y ejecutivas (datos reales)
5. ✅ Storefront público
6. ✅ SEO técnico (sitemap, robots, JSON-LD, metadata, canonical)
7. ⏳ Dominio propio + QA final de lanzamiento

Además del roadmap original: branding real (colores/logo de dely.pe), mapa
de Google en Contacto, botón flotante de WhatsApp, y CRUD de Ejecutivas en
el panel (se agregó después, no estaba en el plan inicial).
