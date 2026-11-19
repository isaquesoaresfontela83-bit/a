# Sabor da Emilly

Site do restaurante Sabor da Emilly, em Novo Gama (GO), com cardápio, fotos e montagem de pedidos para entrega ou retirada.

**Endereço:** 468, Lote 05, Novo Gama - GO, 72860-432.

## Funcionalidades

- Cardápio com preços, categorias e fotos fornecidas pelo restaurante.
- Carrinho com controle de quantidade e subtotal.
- Formulário com nome, endereço, entrega ou retirada, pagamento e observações.
- Mensagem de pedido preparada para compartilhar pelo WhatsApp.
- Combo dos Amigos com disponibilidade às quintas-feiras.
- Layout adaptado para celular e computador.

## Abrir a prévia em localhost no Windows (um clique)

1. No GitHub, selecione **Code → Download ZIP** na versão que contém o arquivo `ABRIR-LOCALHOST.bat`.
2. Extraia **todas** as pastas e arquivos do ZIP no computador.
3. Dê dois cliques em `ABRIR-LOCALHOST.bat`.
4. O navegador abrirá automaticamente em **http://localhost:8080**.
5. Para encerrar, feche a janela de terminal aberta pelo arquivo.

**Não é necessário instalar Java, Node.js ou Python.** O script usa o Windows PowerShell 5.1, incluído no Windows 10 e 11. O servidor aceita somente conexões do próprio computador (127.0.0.1), e não torna o site público. Se a porta 8080 já estiver ocupada, feche o aplicativo que a utiliza antes de iniciar.

Se você preferir usar Node.js ou Java, as opções abaixo continuam disponíveis.

## Executar com Java

Instale um **JDK 8 ou superior**, com os comandos `java` e `javac` disponíveis no terminal.

No Windows, abra um terminal na pasta deste repositório e execute:

```bat
run.bat
```

Acesse **http://localhost:8080**. Para escolher outra porta:

```bat
run.bat 8090
```

Para compilar e iniciar manualmente, crie a pasta `out` e execute:

```sh
javac -encoding UTF-8 -d out src/SaborDaEmilly.java
java -cp out SaborDaEmilly
```

## Alternativa com Node.js

Com Node.js 18 ou superior instalado:

```sh
npm start
```

Acesse **http://localhost:8080**. Não há dependências para instalar. Execute apenas um dos servidores por vez na mesma porta.

## Acesso pelo celular na mesma rede

Inicie o servidor Java ou Node.js no computador. No Windows, execute `ipconfig` para encontrar o IPv4 do Wi-Fi e abra `http://IP-DO-COMPUTADOR:8080` no celular conectado à mesma rede. Permita conexões de rede privada no firewall quando necessário.

O repositório armazena o código. Para disponibilizar o site na internet, é necessário configurar uma hospedagem.

## Organização

```text
ABRIR-LOCALHOST.bat     Abre a prévia no Windows com um clique
localhost.ps1           Servidor local sem dependências
public/
  index.html          Página e cardápio
  style.css           Aparência e adaptação para celular
  app.js              Carrinho, formulário e regras do combo
  images/             Fotos do restaurante
src/
  SaborDaEmilly.java   Servidor HTTP em Java
docs/
  CONFIGURACAO.md      Orientações de edição e funcionamento dos pedidos
preview.mjs           Servidor alternativo em Node.js
run.bat               Compila e inicia o servidor Java no Windows
package.json          Comando npm start
```

## Personalização e pedidos

Consulte [docs/CONFIGURACAO.md](docs/CONFIGURACAO.md) para editar o cardápio, as fotos e o envio pelo WhatsApp.

O fluxo atual prepara a mensagem do pedido. Ele não possui painel de pedidos, banco de dados, cobrança online nem confirmação automática pelo restaurante.
