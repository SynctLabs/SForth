const fs = require("fs")
const path = require("path")
const CLIParser = require("./cli-parser")

const { flags, filePath } = new CLIParser().parse(process.argv.slice(2))

let code = ""
let main = fs.readFileSync(filePath, { encoding: "utf-8" })
let line = 0

main = main.split("\n")
main.forEach((item, id) => {
    if (item[0] != "\\") {
        item = item.split("\\")
        code += `${item[0]}\n`
    }
})

code = code.trim().replaceAll("\n", " ").split(" ")

let stack = []
let words = []

let tokens = {
    "+": () => {
        if (stack.length >= 2) {
            let last = stack[stack.length - 1]
            stack.pop()
            last += stack[stack.length - 1]
            stack.pop()
            stack.push(last)
        } else {
            console.log("Error >> Stack need 2 or more values for operator '+'.")
        }
    },
    "-": () => {
        if (stack.length >= 2) {
            let last = stack[stack.length - 1]
            stack.pop()
            last -= stack[stack.length - 1]
            stack.pop()
            stack.push(last)
        } else {
            console.log("Error >> Stack need 2 or more values for operator '-   '.")
        }
    },
    "*": () => {
        if (stack.length >= 2) {
            let last = stack[stack.length - 1]
            stack.pop()
            last *= stack[stack.length - 1]
            stack.pop()
            stack.push(last)
        } else {
            console.log("Error >> Stack need 2 or more values for operator '*'.")
        }
    },
    "/": () => {
        if (stack.length >= 2) {
            let last = stack[stack.length - 1]
            stack.pop()
            last /= stack[stack.length - 1]
            stack.pop()
            stack.push(last)
        } else {
            console.log("Error >> Stack need 2 or more values for operator '/'.")
        }
    },
    "MOD": () => {
        if (stack.length >= 2) {
            let last = stack[stack.length - 1]
            stack.pop()
            last %= stack[stack.length - 1]
            stack.pop()
            stack.push(last)
        } else {
            console.log("Error >> Stack need 2 or more values for operator 'MOD'.")
        }
    },
    ".": () => {
        if (stack.length >= 1) {
            let last = stack[stack.length - 1]
            stack.pop()
            process.stdout.write(`${last}\n`)
        } else {
            console.log("Error >> Stack need 1 or more values for printing.")
        }
    },
    ".S": () => {
        console.log(`{${stack.join(", ")}}`)
    },
    "dup": () => {
        if (stack.length >= 1) {
            stack.push(stack[stack.length - 1] * 1)
        } else {
            console.log("Error >> Stack need 1 or more values for duplicating.")
        }
    },
    "drop": () => {
        if (stack.length >= 1) {
            stack.pop()
        } else {
            console.log("Error >> Stack need 1 or more values for dropping.")
        }
    },
    "swap": () => {
        if (stack.length >= 2) {
            let last = stack[stack.length - 2]
            stack.splice(stack.length - 2, 1)
            stack.push(last)
        } else {
            console.log("Error >> Stack need 2 or more values for swapping.")
        }
    },
    "over": () => {
        if (stack.length >= 2) {
            stack.push(stack[stack.length - 2])
        } else {
            console.log("Error >> Stack need 2 or more values for copying.")
        }
    },
    "emit": () => {
        if (stack.length >= 1) {
            process.stdout.write(String.fromCharCode(stack[stack.length - 1]))
        } else {
            console.log("Error >> Stack need 1 or more values for emit.")
        }
    },
    ":": (entry, id) => {
        let buffer = []
        let add = true
        for (let i = id + 1; i < code.length; i++) {
            if (code[i] == ";") {
                line = i
                break
            }
            if (entry[i] !== "") {
                buffer.push(entry[i])
                code[i] = ""
            }
            line = i
        }

        if (tokens[buffer[0]]) {
            console.log("Error >> Privated word used in struct:", buffer[0])
        } else words.push(buffer)
    },
    "=": () => {
        if (stack.length >= 2) {
            let b = stack.pop()
            let a = stack.pop()
            if (a == b) {
                stack.push(-1)
            } else {
                stack.push(0)
            }
        } else {
            console.log("Error >> Stack need 2 or more values for comparation.")
        }
    },
    "<>": () => {
        if (stack.length >= 2) {
            let b = stack.pop()
            let a = stack.pop()
            if (a != b) {
                stack.push(-1)
            } else {
                stack.push(0)
            }
        } else {
            console.log("Error >> Stack need 2 or more values for comparation.")
        }
    },
    "<": () => {
        if (stack.length >= 2) {
            let b = stack.pop()
            let a = stack.pop()
            if (a < b) {
                stack.push(-1)
            } else {
                stack.push(0)
            }
        } else {
            console.log("Error >> Stack need 2 or more values for comparation.")
        }
    },
    ">": () => {
        if (stack.length >= 2) {
            let b = stack.pop()
            let a = stack.pop()
            if (a > b) {
                stack.push(-1)
            } else {
                stack.push(0)
            }
        } else {
            console.log("Error >> Stack need 2 or more values for comparation.")
        }
    },
    "<=": () => {
        if (stack.length >= 2) {
            let b = stack.pop()
            let a = stack.pop()
            if (a <= b) {
                stack.push(-1)
            } else {
                stack.push(0)
            }
        } else {
            console.log("Error >> Stack need 2 or more values for comparation.")
        }
    },
    ">=": () => {
        if (stack.length >= 2) {
            let b = stack.pop()
            let a = stack.pop()
            if (a >= b) {
                stack.push(-1)
            } else {
                stack.push(0)
            }
        } else {
            console.log("Error >> Stack need 2 or more values for comparation.")
        }
    },
    "if": () => {
        if (stack.length >= 1) {
            let condition = stack.pop()
            if (condition === 0) {
                while (line < code.length && code[line].toLowerCase() != "else" && code[line].toLowerCase() != "then") {
                    line++
                }
            } else {
                let a = line
                while (a < code.length && code[a] != "else") {
                    a++
                }

                while(a < code.length && code[a] != "then") {
                    code[a] = ""
                    a++
                }
            }
        } else {
            console.log("Error >> Stack need 1 or more values for if.")
            return
        }
    },
    "else": () => {
        while (line < code.length && code[line].toLowerCase() !== "then") {
            line++
        }
    },
    "then": () => {},
    "cr": () => {
        console.log("")
    },
}

code = code
    .map(token => token.replace(/[\t\r]/g, '').trim())
    .filter(token => token.length > 0)


while (line < code.length) {
    let item = code[line]
    item = item.replaceAll("\t", "")
    item = item.replaceAll("\r", "")
    item = item.trim()

    if (Number.isInteger(parseInt(item))) {
        stack.push(parseInt(item))
    } else if (tokens[item]) {
        tokens[item](code, line)
    } else {
        words.forEach((word, index) => {
            if (word[0] == item) {
                code.splice(line, 1, ...word.slice(1))
                line--
            }
        })
    }
    
    // Prints "Ok" after EACH operation if not in quiet mode
    if (!flags.isQuiet) console.log(" Ok")

    line++
}