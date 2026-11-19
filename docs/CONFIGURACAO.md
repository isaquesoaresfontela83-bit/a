# Configuração do site

## Cardápio e fotos

Edite os nomes, descrições e preços em `public/index.html`. Os valores de cada item são usados pelo carrinho em `public/app.js`.

As fotos ficam em `public/images/`. Ao trocar uma imagem, atualize o caminho correspondente no HTML ou no CSS. Os estilos de apresentação ficam em `public/style.css`.

## Entrega e retirada

O formulário coleta nome, endereço quando houver entrega, forma de pagamento e observações. O subtotal considera os produtos; a taxa de entrega precisa ser combinada com o restaurante.

Os dados do carrinho ficam na memória do navegador e são perdidos ao recarregar a página.

## WhatsApp do restaurante

Atualmente o botão de finalizar abre o WhatsApp com a mensagem pronta para o cliente escolher o destinatário. O telefone do restaurante ainda precisa ser informado.

Para direcionar os pedidos ao restaurante, preencha a configuração no início de `public/index.html` com o código do Brasil (55), o DDD e o número, apenas com dígitos:

```text
<meta name="whatsapp-number" content="55DDDNUMERO">
```

Substitua `55DDDNUMERO` pelo número real. O cliente ainda precisa enviar a mensagem no WhatsApp, e o restaurante precisa confirmar o pedido.

## Combo dos Amigos

O preço do combo e a verificação de quinta-feira ficam em `public/app.js`. A disponibilidade usa o relógio do dispositivo e calcula o dia no fuso de Brasília. A inclusão e a finalização ficam bloqueadas fora de quinta-feira.

Essa regra é executada no navegador. Para uma validação centralizada e um controle completo de pedidos, será necessário acrescentar um serviço de pedidos no servidor.
