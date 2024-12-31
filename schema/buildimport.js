console.log(`building import...`);

import * as fs from "node:fs";

let folder = "./out/@typespec/json-schema";
let outputFileName = "Ifc5SchemaMap.json";

let schemas = fs.readdirSync(folder);

let schemaMap = [];
schemas.forEach((schemaFileName) => {
    let path = `${folder}/${schemaFileName}`;

    if (fs.statSync(path).isFile() && schemaFileName !== outputFileName)
    {
        console.log(path);
        let json = JSON.parse(fs.readFileSync(path).toString());
        schemaMap.push(json);
    }
})

console.log(schemaMap);

fs.writeFileSync(`${folder}/${outputFileName}`, JSON.stringify(schemaMap, null, 4));