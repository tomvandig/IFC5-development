import { describe, each, it } from "./util/cappucino";
import { expect } from "chai";
import * as fs from "fs";
import { FetchRemoteSchemas, LoadIfcxFile, SchemaValidationError } from "../workflow-alpha";
import { components } from "../../../schema/out/ts/ifcx";

type IfcxFile = components["schemas"]["IfcxFile"];

describe("example file", () => {
    it("hello wall validates properly", async () => {
        let file = JSON.parse(fs.readFileSync("../../Hello Wall/hello-wall.ifcx").toString()) as IfcxFile;
        await FetchRemoteSchemas(file);
        expect(() => LoadIfcxFile(file)).to.not.throw();
    });
    it("signals validates properly", async () => {
        let file = JSON.parse(fs.readFileSync("../../Linear placement of signals/linear-placement-of-signal.ifcx").toString()) as IfcxFile;
        await FetchRemoteSchemas(file);
        expect(() => LoadIfcxFile(file)).to.not.throw();
    });
});