class InterpreterContext {
    constructor (flags) {
        this.stack = []
        this.userWords = {}
        this.flags = flags
        this.builtinWords = {
            "+": { 
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a + b)
                }
            },
            "-": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a - b)
                }
            },
            "*": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a * b)
                }
            },
            "/": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a / b)
                }
            },
            "mod": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a % b)
                }
            },
            ".": {
                expects: 1,
                code: () => {
                    process.stdout.write(`${this.stack.pop()}`)
                }
            },
            ".s": {
                expects: 0,
                code: () => {
                    process.stdout.write(`{${this.stack.join(", ")}}`)
                }
            },
            "dup": {
                expects: 1,
                code: () => {
                    this.stack.push(this.stack[this.stack.length - 1])
                }
            },
            "drop": {
                expects: 1,
                code: () => this.stack.pop()
            },
            "swap": {
                expects: 2, 
                code: () => {
                    let top = this.stack.length - 1
                    let prev = this.stack.length - 2
                    this.stack[top], this.stack[prev] = this.stack[prev], this.stack[top]
                }
            },
            "over": {
                expects: 2,
                code: () => {
                    this.stack.push(this.stack[this.stack.length - 2])
                }
            },
            "emit": {
                expects: 1,
                code: () => {
                    let char = String.fromCharCode(this.stack.pop())
                    process.stdout.write(char)
                }
            },
            ":": {
                expects: 0,
                code: (tokens, idx) => {
                    const name = tokens[idx + 1]
                    if (!name) {
                        process.stderr.write("Error >> Missing word name after ':'")
                        process.exit(1)
                    } 

                    if (name in this.builtinWords) {
                        process.stderr.write(`Error >> Attempt to redefine builtin word '${name}'`)
                        process.exit(1)
                    }

                    let body = []
                    let i = idx + 2
                    for (; i < tokens.length && tokens[i] !== ";"; i++) body.push(tokens[i])
                    
                    if (tokens[i] !== ";") {
                        process.stderr.write("Error >> Missing ';' to close word definition")
                        process.exit(1)
                    }

                    this.userWords[name] = () => this.run(body)
                    return i // Index to jump to
                    
                }
            },
            "=": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a === b ? -1 : 0)
                }
            },
            "<>": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a !== b ? -1 : 0)
                }
            },
            "<": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a < b ? -1 : 0)
                }
            },
            ">": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a > b ? -1 : 0)
                }
            },
            "<=": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a <= b ? -1 : 0)
                }
            },
            ">=": {
                expects: 2,
                code: () => {
                    let b = this.stack.pop()
                    let a = this.stack.pop()
                    this.stack.push(a >= b ? -1 : 0)
                }
            },
            "if": {
                expects: 1,
                code: (tokens, idx) => {
                    let i = idx + 1
                    let code = []
                    
                    let condition = this.stack.pop()
                    if (condition === 0) {
                        while (i < tokens.length && tokens[i] !== "else" && tokens[i] !== "then") i++

                        if (tokens[i] === "else") {
                            i++
                            while (i < tokens.length && tokens[i] !== "then") code.push(tokens[i++])
                        }
                    } else {
                        while (i < tokens.length && tokens[i] !== "else" && tokens[i] !== "then") code.push(tokens[i++])

                        if (tokens[i] === "else") {
                            while (i < tokens.length && tokens[i] !== "then") i++;
                        }
                    }

                    if (tokens[i] !== "then") {
                        process.stderr.write("Expected 'then' to end if")
                        process.exit(1)
                    }

                    this.run(code)
                    return i
                }
            },
            "else": () => {},
            "then": () => {},
            "cr": {
                expects: 0,
                code: () => {
                    process.stdout.write("\n")
                    process.stdout.flush()
                }
            },
        }
    }

    checkStack(operator, expect_items) {
        if (expect_items > this.stack.length) {
            process.stderr.write(`Error >> Word '${operator}' need(s) at least ${expect_items} item(s) on the stack, got ${this.stack.length} instead.`)
            return false
        }
        return true
    }

    tokenize(src) {
        return src
            .split("\n")
            .map(line => line.split("\\", 1)[0].trim()) // Ignore comments taking anything before the very first "\"
            .filter(line => line.length > 0) // Remove empty lines
            .join(" ")
            // Normalize spaces. Every whitespace character sequence is turned into a single space,
            .replace(/\s+/g, " ") 
            .split(" ") // Split the source code in tokens
            .map(line => line.toLowerCase()) // Makes words case-insensitive
    }

    run(tokens) {
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i]

            if (Number.isInteger(parseInt(token))) {
                this.stack.push(parseInt(token))
            } else if (token === ":"  || token === "if") {
                i = this.builtinWords[token].code(tokens, i)
            } else if (token in this.builtinWords) {
                if (this.checkStack(token, this.builtinWords[token].expects)) {
                    this.builtinWords[token].code()
                }
            } else if (token in this.userWords) {
                this.userWords[token]()
            } else {
                process.stderr.write(`Error >> Undefined word ${token}`)
            }
            
            if (!this.flags.isQuiet) {
                process.stdout.write("Ok")
            }
        }
    }

    execute(src) {
        this.run(this.tokenize(src))
    }
}

module.exports = InterpreterContext