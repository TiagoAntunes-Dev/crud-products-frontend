# ADO 3 - Stack Completa no Ar

## Projeto

Este README documenta minha aplicação web em produção. A stack é formada por front-end Angular, API Node.js/Express, banco MongoDB Atlas e deploy conectado ao GitHub.

Links do projeto:

- Front-end: https://TiagoAntunes-Dev.github.io/crud-products-frontend/
- API: https://crud-api-products.onrender.com/
- Repositório do front-end: https://github.com/TiagoAntunes-Dev/crud-products-frontend
- Repositório do back-end: https://github.com/TiagoAntunes-Dev/crud-api-products
- Banco: MongoDB Atlas, cluster `Cluster0`

## 1. Diagrama da Stack em Produção

![Diagrama da stack](./assets/diagrama-stack.png)

No meu projeto, o usuário acessa o front-end Angular pelo navegador. O Angular faz requisições HTTP para a API hospedada no Render usando JSON. A API recebe essas requisições, valida os dados, executa as regras de negócio e consulta o MongoDB Atlas. O banco retorna os documentos para a API, e a API devolve a resposta em JSON para o front-end.

O GitHub entra como repositório central do código. O front-end e o back-end ficam separados, e cada plataforma de hospedagem acompanha seu respectivo repositório para publicar novas versões quando acontece um `git push`.

## 2. Front-end Consumindo a API em Produção

O front-end foi desenvolvido com Angular e Angular Material. Ele está hospedado no GitHub Pages.

A URL pública da API está configurada no arquivo `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://crud-api-products.onrender.com/api'
};

export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api'
};
