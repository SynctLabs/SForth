class CLIParser {
    constructor() {
        this.major = 1
        this.minor = 0
        this.patch = 0
        this.version = `${this.major}.${this.minor}.${this.patch}`
        this.flags = new Set([
            "--help", "-h",
            "--version", "-v",
            "--verbose", "-V",
            "--quiet", "-q"
        ])
    }

    print_usage() {
        console.log("Usage:")
        console.log("    sforth [--help | -h]")
        console.log("    sforth [--version | -v]")
        console.log("    sforth [--quiet | -q | --verbose | -V] <file_path>")
        console.log("Options:")
        console.log("    --help, -h       Show this help utility")
        console.log("    --version, -v    Display the sforth interpreter version")
        console.log("    --verbose, -V    Enable 'Ok' status print after operation")
        console.log("    --quiet, -q      Disable 'Ok' status print after operation")
    }

    parse(args) {
        if (args.length == 0) {
            this.print_usage()
            process.exit(1)
        } 

        /* 
            Only arguments starting with '-' are currently treated as flags,
            in other words, positional arguments (e.g, file paths) are not validated here.
            In the future, this will be useful to support multiple file inputs.
        */
        const unknownFlags = args.filter(arg => arg.startsWith("-") && !this.flags.has(arg))
        if (unknownFlags.length > 0) {
            unknownFlags.forEach(flag => console.error("Unknown flag:", flag))
            this.print_usage()
            process.exit(1)
        }

        /* 
            Here the flags precedence is established: the order in which they appear is not relevant.
            For example, help flags ("-h", "--help") have higher priority than version flags ("-v", "--version").
            This occurs because they are checked first, and if present, executed immediately, exiting successfully 
            and ignoring any other arguments.
        */
        if (args.includes("-h") || args.includes("--help")) {
            this.print_usage()
            process.exit(0)
        }

        if (args.includes("-v") || args.includes("--version")) {
            console.log(this.version)
            process.exit(0)
        }

        // Sets quiet as default, aiming friendly outputs for scripts
        let isQuiet = true

        if (args.includes("-q") || args.includes("--quiet")) {
            isQuiet = true
        }

        if (args.includes("-V") || args.includes("--verbose")) {
            isQuiet = false
        }

        const files = args.filter(arg => !arg.startsWith("-"))  
        if (files.length == 0) {
            console.error("File path expected")
            this.print_usage()
            process.exit(1)
        }

        return { 
            "flags": { "isQuiet": isQuiet }, // Holds runtime-relevant flags, making it easier to extend
            "filePath": files[0] 
        }
    }
}

module.exports = CLIParser