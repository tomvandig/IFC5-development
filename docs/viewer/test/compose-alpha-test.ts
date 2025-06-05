import { CycleError, ExpandNodeWithInput, InputNode, TreeNode } from "../compose-alpha";
import { describe, each, it } from "./util/cappucino";
import { expect } from "chai";

function MakeInputNode(path: string)
{
    return {
        path,
        children: {},
        inherits: {},
        attributes: {}
    } as InputNode;
}

function AddChild(nodes: Map<string, InputNode[]>, path: string, name: string, cs: string | null)
{
    if (!nodes.has(path))
    {
        nodes.set(path, [MakeInputNode(path)]);
    }
    nodes.get(path)![0].children[name] = cs;
}

function AddInherits(nodes: Map<string, InputNode[]>, path: string, name: string, cs: string | null)
{
    if (!nodes.has(path))
    {
        nodes.set(path, [MakeInputNode(path)]);
    }
    nodes.get(path)![0].inherits[name] = cs;
}

function AddAttribute(nodes: Map<string, InputNode[]>, path: string, name: string, attr: any)
{
    if (!nodes.has(path))
    {
        nodes.set(path, [MakeInputNode(path)]);
    }
    nodes.get(path)![0].attributes[name] = attr;
}

function NodeToJSON(node: TreeNode)
{
    let obj: any = {};
    obj.node = node.node;
    obj.children = {};
    obj.attributes = {};
    [...node.children.entries()].forEach(c => {
        obj.children[c[0]] = NodeToJSON(c[1]);
    });
    [...node.attributes.entries()].forEach(c => {
        obj.attributes[c[0]] = c[1];
    });
    return obj;
}

function PrintNode(node: TreeNode)
{
    console.log(JSON.stringify(NodeToJSON(node), null, 4));
}

describe("composition expansion", () => {

    it("adds children", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "parentclass", "child", "childclass");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child).to.exist;
    });

    it("rejects cycles", () => {
        let nodes = new Map<string, InputNode[]>();

        AddInherits(nodes, "childclass", "ih", "parentclass");
        AddInherits(nodes, "parentclass", "ih", "childclass");

        expect(() => ExpandNodeWithInput("parentclass", nodes)).to.throw(CycleError);
    });

    it("adds children of children", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "childclass", "child2", "otherchildclass");
        AddChild(nodes, "parentclass", "child1", "childclass");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child1.children.child2).to.exist;
    });

    it("adds children of child path", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "parentclass/child1", "child2", "otherchildclass");
        AddChild(nodes, "parentclass", "child1", "childclass");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child1.children.child2).to.exist;
    });

    it("adds children of inherit", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "inheritedclass", "child", "otherchildclass");
        AddInherits(nodes, "parentclass", "inherit1", "inheritedclass");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child).to.exist;
    });

    it("adds children of child path of inherit", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "inheritedclass/child", "child2", "otherchildclass");
        AddChild(nodes, "inheritedclass", "child", "otherchildclass");
        AddInherits(nodes, "parentclass", "inherit1", "inheritedclass");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child.children.child2).to.exist;
    });

    it("adds children of nested inherit", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "inheritedclass2", "child", "otherchildclass");
        AddInherits(nodes, "inheritedclass1", "inherit2", "inheritedclass2");
        AddInherits(nodes, "parentclass", "inherit1", "inheritedclass1");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child).to.exist;
    });

    it("adds children of deep inherit path", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "otherchildclass2", "child3", "otherchildclass3");
        AddChild(nodes, "otherchildclass", "child2", "otherchildclass2");
        AddChild(nodes, "inheritedclass2", "child", "otherchildclass");
        AddInherits(nodes, "inheritedclass1", "inherit2", "inheritedclass2");
        
        AddInherits(nodes, "parentclass", "inherit1", "inheritedclass1/child/child2");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child3).to.exist;
    });

    it("adds children of deep inherit path with nesting", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "otherchildclass/child2", "child3", "otherchildclass3");
        AddChild(nodes, "otherchildclass", "child2", "otherchildclass2");
        AddChild(nodes, "inheritedclass2", "child", "otherchildclass");
        AddInherits(nodes, "inheritedclass1", "inherit2", "inheritedclass2");
        
        AddInherits(nodes, "parentclass", "inherit1", "inheritedclass1/child/child2");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child3).to.exist;
    });

    it("adds children of deep child path with nesting", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "otherchildclass/child2", "child3", "otherchildclass3");
        AddChild(nodes, "otherchildclass", "child2", "otherchildclass2");
        AddChild(nodes, "inheritedclass2", "child", "otherchildclass");
        AddInherits(nodes, "inheritedclass1", "inherit2", "inheritedclass2");
        
        AddChild(nodes, "parentclass", "child1", "inheritedclass1/child/child2");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child1.children.child3).to.exist;
    });

    it("adds attributes of deep child path with nesting", () => {
        let nodes = new Map<string, InputNode[]>();

        AddAttribute(nodes, "otherchildclass/child2", "attr", true);
        AddChild(nodes, "otherchildclass", "child2", "otherchildclass2");
        AddChild(nodes, "inheritedclass2", "child", "otherchildclass");
        AddInherits(nodes, "inheritedclass1", "inherit2", "inheritedclass2");
        
        AddChild(nodes, "parentclass", "child1", "inheritedclass1/child/child2");

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.child1.attributes.attr).to.exist;
    });

    it("overrides inherited attributes with direct attributes", () => {
        let nodes = new Map<string, InputNode[]>();

        AddAttribute(nodes, "otherchildclass", "attr", 1);
        AddInherits(nodes, "parentclass", "ih", "otherchildclass");

        AddAttribute(nodes, "parentclass", "attr", 2);

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.attributes.attr).to.equal(2);
    });

    it("delete removes children in order", () => {
        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "parentclass", "c1", null);
        AddChild(nodes, "parentclass", "c1", "child");
        AddChild(nodes, "parentclass", "c2", "child");
        AddChild(nodes, "parentclass", "c2", null);

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.children.c1).to.exist;
        expect(root.children.c2).to.not.exist;
    });

    it("delete removes attributes in order", () => {
        let nodes = new Map<string, InputNode[]>();

        AddAttribute(nodes, "parentclass", "a1", null);
        AddAttribute(nodes, "parentclass", "a1", "a");
        AddAttribute(nodes, "parentclass", "a2", "a");
        AddAttribute(nodes, "parentclass", "a2", null);

        let root = NodeToJSON(ExpandNodeWithInput("parentclass", nodes));
        expect(root.attributes.a1).to.exist;
        expect(root.attributes.a2).to.not.exist;
    });

    it("delete removes inherits in order", () => {
        let nodes = new Map<string, InputNode[]>();

        AddAttribute(nodes, "a", "a1", "a");

        AddInherits(nodes, "c1", "i1", null);
        AddInherits(nodes, "c1", "i1", "a");
        AddInherits(nodes, "c2", "i2", "a");
        AddInherits(nodes, "c2", "i2", null);

        let c1 = NodeToJSON(ExpandNodeWithInput("c1", nodes));
        let c2 = NodeToJSON(ExpandNodeWithInput("c2", nodes));

        expect(c1.attributes.a1).to.exist;
        expect(c2.attributes.a1).to.not.exist;
    });

    it("adds children of children", () => {

        let nodes = new Map<string, InputNode[]>();

        AddChild(nodes, "obj1", "c3", "obj4");
        AddChild(nodes, "obj1", "c4", "obj5");

        AddChild(nodes, "obj1/c3", "c7", "obj5");
        
        AddInherits(nodes, "a", "i1", "obj1");
        AddChild(nodes, "a", "c1", "obj2");
        AddChild(nodes, "a", "c2", "obj3");

        AddChild(nodes, "a/c4", "c8", "obj5");

        let root = NodeToJSON(ExpandNodeWithInput("a", nodes));
        expect(root.children.c3.children.c7).to.exist;
        expect(root.children.c4.children.c8).to.exist;
        expect(root.children.c1).to.exist;
        expect(root.children.c2).to.exist;
    });
})

import { components } from "../../../schema/out/ts/ifcx";
import { Diff, Federate, LoadIfcxFile, SchemaValidationError } from "../workflow-alpha";
import { SchemasToOpenAPI } from "../schema-alpha";
import { ExampleFile, ExampleFileMissingSchema, ExampleFileWithSchema } from "./example-file";
type IfcxFile = components["schemas"]["IfcxFile"];

function DefaultFile(valueOfAttribute: any)
{
    return {
        header: {
            id: "",
            version: "",
            author: "",
            timestamp: ""
        },
        using: [],
        schemas: {
            "attribute": {
                uri: "http://www.example.com/attribute",
                value: {
                    dataType: "String"
                }
            },
            "fixed_attribute": {
                uri: "http://www.example.com/fixed_attribute",
                value: {
                    dataType: "Boolean"
                }
            },
        },
        data: [{
            path: "root",
            children: {},
            inherits: {},
            attributes: {
                "attribute": valueOfAttribute,
                "fixed_attribute": true
            }
        }]
    } as IfcxFile;
}

describe("workflows", () => {
    it("allow federation", () => {
        let file1 = DefaultFile("a");
        let file2 = DefaultFile("b");

        let federated1 = Federate([file1, file2]);
        let federated2 = Federate([file2, file1]);
``
        let root1 = NodeToJSON(LoadIfcxFile(federated1));
        let root2 = NodeToJSON(LoadIfcxFile(federated2));

        expect(root1.attributes.attribute).to.equal("b");
        expect(root2.attributes.attribute).to.equal("a");
        expect(root1.attributes.fixed_attribute).to.exist;
        expect(root2.attributes.fixed_attribute).to.exist;
    });

    it("allow diffs", () => {
        let file1 = DefaultFile("a");
        let file2 = DefaultFile("b");

        let diff = Diff(file1, file2);
        let root = NodeToJSON(LoadIfcxFile(diff));

        expect(diff.data.length).to.equal(1);
        expect(root.attributes.attribute).to.equal("b");
        expect(root.attributes.fixed_attribute).to.not.exist;
    });
    
    it("allow federating diffs", () => {
        let file1 = DefaultFile("a");
        let file2 = DefaultFile("b");

        let diff = Diff(file1, file2);
        let federated = Federate([file1, diff]);

        let root = NodeToJSON(LoadIfcxFile(federated));
        expect(root.attributes.attribute).to.equal("b");
        expect(root.attributes.fixed_attribute).to.exist;
    });
})

describe("schemas", () => {
    it("can generate openAPI", () => {
        let openAPISchema = SchemasToOpenAPI(ExampleFile());

        // TODO
        expect(openAPISchema.length).to.equal(720);
    });

    it("throws error if attribute references unknown schema ID", () => {
        expect(() => LoadIfcxFile(ExampleFileMissingSchema())).to.throw(SchemaValidationError);
    });

    it("throws error if attributes fail to validate", () => {
        expect(() => LoadIfcxFile(ExampleFileWithSchema("Boolean", null))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFileWithSchema("String", null))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFileWithSchema("DateTime", null))).to.throw(SchemaValidationError);
        
        expect(() => LoadIfcxFile(ExampleFileWithSchema("Enum", null))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::enum", [null]))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::enum", "d"))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::enum", "c"))).to.not.throw(SchemaValidationError);
        
        expect(() => LoadIfcxFile(ExampleFileWithSchema("Integer", null))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFileWithSchema("Real", null))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFileWithSchema("Relation", null))).to.throw(SchemaValidationError);

        expect(() => LoadIfcxFile(ExampleFileWithSchema("Object", false))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::object", [null]))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::object", {val1: ""}))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::object", {val1: "", val2: "d"}))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::object", {val1: false, val2: "a"}))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::object", {val1: "", val2: "a"}))).to.not.throw(SchemaValidationError);
        
        expect(() => LoadIfcxFile(ExampleFileWithSchema("Array", null))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::array", [false]))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::array", ["d"]))).to.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::array", []))).to.not.throw(SchemaValidationError);
        expect(() => LoadIfcxFile(ExampleFile("example::array", ["a"]))).to.not.throw(SchemaValidationError);
    });
});