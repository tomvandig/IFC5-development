import "@typespec/http";

import "./ifcx-alpha.tsp";

using Http;

model Layer {
    id: string;
}

model LayerCommit
{
    msg: string;
    diff: IfcxFile;
}

model LayerCreateCommand {
    id: string;
    name: string;
    filter: string;
    federatedLayers: string[];
}


model LayerUpdateCommand {
    id: string;
    name: string;
}

model LayerDeleteCommand {
    id: string;
}

model HttpIfcxFile extends Http.File {
    contentType: "application/json";
}

@service
@route("/ifc/v5a/")
namespace IfcxApi {
    @route("/layers")
    namespace LayersApi {
        @route("")
        @get op list(): Layer[];
        
        @route("")
        @post op create(@body command: LayerCreateCommand): {
            @statusCode statusCode: 200;
        };
        
        @route("")
        @put op update(@body command: LayerUpdateCommand): {
            @statusCode statusCode: 200;
        };
        
        @route("")
        @delete op delete(@body command: LayerDeleteCommand): {
            @statusCode statusCode: 200;
        };
        
        @route("{id}")
        namespace LayerApi
        {
            @route("")
            @get op get(@path id: string): {
                @statusCode statusCode: 200;
                @body layer: Layer;
            } | {
                @statusCode statusCode: 404;
            };
            
            @route("/tree/*")
            @get op tree(@path id: string, @query recursive: boolean, @query compose: boolean): {
                @statusCode statusCode: 200;
                @body treenode: IfcxNode;
            } | {
                @statusCode statusCode: 404;
            };
            
            @route("/push")
            @put op push(@path id: string, @body ifcxFile: HttpIfcxFile): {
                @statusCode statusCode: 200;
            } | {
                @statusCode statusCode: 404;
            };
            
            @route("/pull")
            @get op pull(@path id: string): {
                @statusCode statusCode: 200;
                @body ifcxFile:  HttpIfcxFile;
            } | {
                @statusCode statusCode: 404;
            };
        }
    }
}