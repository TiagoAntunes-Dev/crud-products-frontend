# Product Manager — Frontend

Interface web para gerenciamento de produtos construída com Angular 17 e Angular Material. Consome a [Product CRUD API](https://github.com/TiagoAntunes-Dev/crud-api-products) com autenticação JWT, relacionamento entre entidades e proteção de rotas. O projeto evoluiu de um front-end conectado a um servidor local para uma aplicação completa em produção, com deploy automático via GitHub Pages.

Projeto desenvolvido como parte dos estudos para o curso de Sistemas para Internet do Senac.

🔗 **Aplicação em produção:** https://TiagoAntunes-Dev.github.io/crud-products-frontend/  
🔗 **API consumida:** https://crud-api-products.onrender.com

---

## 🚀 Tecnologias Utilizadas

* **Angular 17** — Framework frontend com componentes standalone, signals e novo fluxo de controle (`@if`, `@for`).
* **Angular Material** — Biblioteca de componentes UI seguindo o Material Design (tema Deep Purple/Amber).
* **TypeScript** — Tipagem estática que garante segurança nos contratos com a API.
* **RxJS** — Gerenciamento de operações assíncronas com Observables (`forkJoin`, `tap`, `pipe`).
* **Angular Router** — Navegação com lazy loading e proteção de rotas via Guards.
* **HttpClient + Interceptor** — Requisições HTTP com injeção automática do token JWT em todas as chamadas autenticadas.
* **LocalStorage** — Persistência da sessão do usuário entre recarregamentos de página.

---

## 📁 Arquitetura do Projeto

```
product-manager/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth.guard.ts            # Redireciona para /login se não autenticado
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts      # Injeta Bearer token em toda requisição HTTP
│   │   ├── models/
│   │   │   ├── auth.model.ts            # Interfaces: User, AuthResponse, LoginPayload
│   │   │   ├── category.model.ts        # Interface: Category
│   │   │   └── product.model.ts         # Interface: Product (com Category populada)
│   │   ├── pages/
│   │   │   ├── categories/              # Listagem de categorias
│   │   │   ├── category-form/           # Formulário de criação de categoria
│   │   │   ├── dashboard/               # Estatísticas em tempo real
│   │   │   ├── login/                   # Tela de autenticação
│   │   │   ├── product-form/            # Formulário de criação e edição
│   │   │   ├── products/                # Listagem de produtos com busca
│   │   │   └── register/                # Criação de conta
│   │   ├── services/
│   │   │   ├── auth.service.ts          # Login, register, logout, token
│   │   │   ├── category.service.ts      # CRUD de categorias
│   │   │   └── product.service.ts       # CRUD de produtos
│   │   ├── shared/
│   │   │   └── header/                  # Navbar com menu e info do usuário
│   │   ├── app.component.ts             # Componente raiz
│   │   ├── app.config.ts                # Providers: router, HTTP, interceptor, animations
│   │   └── app.routes.ts                # Rotas com lazy loading e canActivate
│   ├── environments/
│   │   └── environment.ts               # URL base da API
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 🔐 Fluxo de Autenticação

```
Usuário acessa /dashboard
        ↓
  authGuard verifica
  localStorage tem token?
        ↓
   NÃO → redireciona      SIM → permite acesso
   para /login                  ↓
        ↓              authInterceptor injeta
   Faz login            Authorization: Bearer <token>
        ↓               em TODAS as requisições HTTP
   API retorna JWT
        ↓
   Token salvo no
   localStorage
        ↓
   Redireciona para
   /dashboard
```

O `authInterceptor` é um **interceptor funcional do Angular 17** registrado globalmente no `app.config.ts` via `provideHttpClient(withInterceptors([authInterceptor]))`. Ele lê o token do `localStorage` e adiciona o header `Authorization` automaticamente — o desenvolvedor não precisa lembrar de adicionar o token em cada chamada HTTP.

---

## 🗺️ Rotas da Aplicação

| Rota                    | Componente         | Guard | Descrição                        |
|-------------------------|--------------------|-------|----------------------------------|
| `/`                     | —                  | —     | Redireciona para `/dashboard`    |
| `/login`                | LoginComponent     | ❌    | Tela de login                    |
| `/register`             | RegisterComponent  | ❌    | Criação de conta                 |
| `/dashboard`            | DashboardComponent | ✅    | Estatísticas gerais              |
| `/products`             | ProductsComponent  | ✅    | Listagem com busca e filtro      |
| `/products/new`         | ProductFormComponent | ✅  | Formulário de criação            |
| `/products/edit/:id`    | ProductFormComponent | ✅  | Formulário de edição             |
| `/categories`           | CategoriesComponent | ✅   | Listagem de categorias           |
| `/categories/new`       | CategoryFormComponent | ✅ | Formulário de criação            |

Todas as rotas protegidas usam `canActivate: [authGuard]`. Tentativas de acesso sem token são redirecionadas para `/login` automaticamente.

---

## 📋 Funcionalidades

### Dashboard
- Cards com estatísticas em tempo real: total de produtos, total de categorias, itens em estoque e valor total do inventário
- Dados carregados em paralelo com `forkJoin` (duas chamadas simultâneas à API)
- Ações rápidas para as principais páginas

### Produtos
- Listagem completa com categoria populada (exibida como badge colorido)
- Busca em tempo real por nome ou categoria
- Criação com seleção de categoria via `<mat-select>` populado da API
- Edição com pré-preenchimento do formulário (modo edit detectado pelo `:id` na rota)
- Exclusão com confirmação

### Categorias
- Listagem com data de criação
- Criação com validação de nome único
- Exclusão bloqueada pelo back-end quando há produtos vinculados — o front-end exibe a mensagem de erro retornada pela API (`409 Conflict`)

### Autenticação
- Registro com validação de formulário reativo (nome, e-mail, senha mínima de 6 caracteres)
- Login com feedback de erro genérico (não revela se o e-mail existe)
- Logout limpa o `localStorage` e redireciona para `/login`
- Sessão persiste entre recarregamentos via `localStorage`

---

## ⚙️ Decisões Técnicas

- **Componentes Standalone** — sem `NgModule`, cada componente declara seus próprios imports. Padrão do Angular 17.
- **Lazy Loading** — todas as rotas usam `loadComponent()`. O bundle inicial é menor e cada página só é carregada quando acessada.
- **Interceptor Funcional** — padrão do Angular 17, substituindo a abordagem de classe com `HttpInterceptor`. Registrado uma vez no `app.config.ts`.
- **Guard Funcional** — `CanActivateFn` sem classe, injetando dependências via `inject()`.
- **Reactive Forms** — formulários com `FormGroup` e `FormControl` para validação síncrona antes de qualquer requisição HTTP.
- **`forkJoin` no Dashboard** — as chamadas para `/api/products` e `/api/categories` são disparadas em paralelo. Se feitas em sequência, o tempo de carregamento seria a soma dos dois. Em paralelo, é o maior dos dois.

---

## 🛠️ Como executar localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado
* [Angular CLI](https://angular.io/cli) instalado (`npm install -g @angular/cli`)
* Back-end rodando (local ou no Render)

### Passo a passo

**1. Clone o repositório:**
```bash
git clone https://github.com/TiagoAntunes-Dev/crud-products-frontend.git
cd crud-products-frontend
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Verifique a URL da API em `src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://crud-api-products.onrender.com/api'
};
```

**4. Inicie o servidor de desenvolvimento:**
```bash
ng serve
```

Acesse `http://localhost:4200` no navegador.

---

## ☁️ Deploy

| Serviço        | Plataforma    | Detalhes                                        |
|----------------|---------------|-------------------------------------------------|
| Front-end      | GitHub Pages  | Build estático — deploy via `angular-cli-ghpages` |
| API consumida  | Render        | https://crud-api-products.onrender.com          |
| Banco de dados | MongoDB Atlas | M0 Free Tier — AWS / São Paulo                  |

**Comando de deploy:**
```bash
ng build --base-href "https://TiagoAntunes-Dev.github.io/crud-products-frontend/"
npx angular-cli-ghpages --dir=dist/product-manager/browser
```

---

## 🗺️ Próximos Passos

- [ ] **Paginação** — navegação por páginas na listagem de produtos
- [ ] **Filtro por categoria** — dropdown para filtrar produtos por categoria selecionada
- [ ] **Upload de imagem** — integração com serviço de storage para imagem dos produtos
- [ ] **Testes unitários** — cobertura dos serviços e guards com Jest
- [ ] **PWA** — transformar em Progressive Web App para funcionar offline
