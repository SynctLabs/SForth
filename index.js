const CLIParser = require("./cli-parser");
const { readFileSync } = require("fs")
const InterpreterContext = require("./interpreter-ctx")

const { flags, filePath } = new CLIParser().parse(process.argv.slice(2))

src = readFileSync(filePath, { encoding: "utf-8" })

new InterpreterContext(flags).execute(src)