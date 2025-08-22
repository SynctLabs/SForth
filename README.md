# SForth - Interpretador Forth do SynctLabs

**Versão:** 1.0.0
**Linguagem:** Node.js
**Autor:** SynctLabs

---

## Sumário

1. [O que é SForth](#o-que-é-sforth)
2. [Como instalar](#como-instalar)
3. [Flags para usar](#flags-para-usar)
4. [Como o código funciona](#como-o-código-funciona)
5. [Comandos que você pode usar](#comandos-que-você-pode-usar)
6. [Exemplos fáceis](#exemplos-fáceis)
7. [O que já funciona](#o-que-já-funciona)
8. [Coisas para melhorar](#coisas-para-melhorar)

---

## O que é SForth

SForth é um intepretador da linguagem de programação Forth. Ele foi feito usando Node.js. Com ele você pode:

* Guardar e mexer em números numa pilha (stack).
* Fazer contas (+, -, \*, /, MOD).
* Criar suas próprias palavras (funções).
* Usar `IF`, `ELSE` e `THEN` para tomar decisões no código.

É uma versão simples para aprender e brincar com Forth.

---

## Como instalar

1. Instale **Node.js** no computador.
2. Baixe ou clone o projeto.
3. Rode o programa pelo terminal:

```bash
sforth caminho/para/seu/arquivo.forth
```

Para ver a versão do SForth:

```bash
sforth -v
```

---

## Flags para usar

* `-v` : Mostra a versão.
* `-noexit` : Não mostra "Ok" depois de executar um comando, ela é utilizada dentro do script.
* `-vanish` : Mostra os comandos enquanto são executados, , ela é utilizada dentro do script.

---

## Como o código funciona

1. **Ler o arquivo:** O programa lê o arquivo Forth e ignora comentários (linhas que começam com `\`).
2. **Separar palavras:** O código é dividido em palavras que chamamos de tokens.
3. **Pilha e listas:**

   * `stack` : Pilha principal para os números.
   * `flags` : Lista de flags usadas.
   * `words` : Palavras criadas pelo usuário.
4. **Tokens:** Cada token é uma função que faz algo na pilha ou mostra resultados.
5. **Processar o código:** O programa lê cada token e executa em ordem.

---

## Comandos que você pode usar

| Comando                | O que faz                                                    |
| ---------------------- | ------------------------------------------------------------ |
| `+`                    | Soma os dois últimos números                                 |
| `-`                    | Subtrai o último pelo penúltimo                              |
| `*`                    | Multiplica os dois últimos                                   |
| `/`                    | Divide o penúltimo pelo último                               |
| `MOD`                  | Resto da divisão do penúltimo pelo último                    |
| `.`                    | Mostra o último número                                       |
| `.S`                   | Mostra todos os números da pilha                             |
| `dup`                  | Copia o último número                                        |
| `drop`                 | Apaga o último número                                        |
| `swap`                 | Troca os dois últimos números                                |
| `over`                 | Copia o penúltimo para o topo                                |
| `emit`                 | Mostra o caractere do último número ASCII                    |
| `:` e `;`              | Cria uma palavra nova                                        |
| `=`                    | Compara dois números (retorna -1 se iguais, 0 se diferentes) |
| `<>`                   | Compara dois números (retorna -1 se diferentes, 0 se iguais) |
| `<`, `>`, `<=`, `>=`   | Comparações matemáticas                                      |
| `if` / `else` / `then` | Faz decisões no código                                       |
| `cr`                   | Pula para a próxima linha                                    |

---

## Exemplos fáceis

### Somar números

```forth
10 20 + .
\ Mostra: 30
```

### Decisão simples

```forth
5 10 < if 100 . else 200 . then
\ Mostra: 100
```

### Criar uma palavra

```forth
: square dup * ;
5 square .
\ Mostra: 25
```

### Mostrar pilha completa

```forth
10 20 30 .S
\ Mostra: {10, 20, 30}
```
