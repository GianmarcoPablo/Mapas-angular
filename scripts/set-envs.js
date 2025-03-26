const { writeFileSync, mkdirSync } = require("fs")

require("dotenv").config()


const targetPath = "./src/environments/environment.ts"
const targetPathDev = "./src/environments/environment.development.ts"
const mapboxkey = process.env["MAPBOX_KEY"]

if (!mapboxkey) {
    throw new Error("MAPBOX_KEY IS NOT SET")
}


const envFileContent = `

    export const environment = {
        mapboxkey: "${mapboxkey}"
    };

`

mkdirSync("./src/environments", { recursive: true })

writeFileSync(targetPath, envFileContent)
writeFileSync(targetPathDev, envFileContent)