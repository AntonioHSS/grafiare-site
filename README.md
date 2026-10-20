# Grafiare — Catálogo e Orçamento (HTML/CSS/JS)

Site estático para a fábrica Grafiare. Catálogo por categorias (Impermeabilizantes, Tintas, Texturas e Complementos), boletim técnico por produto (sem preço) e orçamento enviado via WhatsApp.

## Como usar

1. Abra `index.html` no navegador (duplo clique) ou sirva com um servidor estático:
   - `npx serve .` / `python -m http.server 8080`
2. As imagens dos produtos ficam em `assets/images/`. Salve cada foto com o nome indicado em `js/products.js`.
3. Se a imagem não for encontrada, o site exibe um placeholder automaticamente.

## Configuração

- **Número WhatsApp / marca**: edite `js/app.js` no objeto `CONFIG` (campos `brand` e `whatsappNumber`).
- **Categorias**: edite `window.CATEGORIES` em `js/products.js`.
- **Produtos**: edite o array `window.PRODUCTS` em `js/products.js`. Campos: `id`, `name`, `category`, `image`, `description`, `bulletin` (array de linhas do boletim técnico).
- **Textos da home/sobre/endereço**: edite direto no `index.html` (seção `#sobre` e `#contato`).

## Estrutura

```
index.html
css/styles.css
js/products.js   <- dados do catálogo
js/app.js        <- lógica, carrinho e WhatsApp
assets/images/   <- fotos dos produtos
```

## Observações

- O carrinho/orçamento é salvo no `localStorage` do navegador.
- O envio do orçamento monta uma mensagem e abre o WhatsApp Web/app.
- Sem backend, sem preços (conforme solicitado). Para adicionar preços no futuro, inclua um campo `price` nos produtos e exiba nos cards.