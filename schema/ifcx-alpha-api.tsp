import "@typespec/http";

import "./ifcx-alpha.tsp";

using Http;

model LayerRevision
{
    hash: string;
    origin?: FederatedLayerRevision[];
}

model FederatedLayerRevision
{
    layerID: string;
    hash: string;
}

model Layer {
    id: string;
    name: string;
    revisions: LayerRevision[];
    federatedLayers: FederatedLayerRevision[];
}

model LayerCreateCommand {
    id: string;
    name: string;
    federatedLayers: FederatedLayerRevision[];
}

model LayerUpdateCommand {
    id: string;
    name: string;
    federatedLayers: FederatedLayerRevision[];
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
            
            @route("/push")
            @put op push(@path id: string, @body ifcxFile: HttpIfcxFile): {
                @statusCode statusCode: 200;
            } | {
                @statusCode statusCode: 404;
            };
            
            @route("{revision}")
            namespace LayerHistory
            {
                @route("")
                @get op get(@path id: string, @path revision: string): LayerRevision;
    
                @route("ifcx")
                @get op ifcx(@path id: string, @path revision: string): {
                    @statusCode statusCode: 200;
                    @body ifcxFile:  HttpIfcxFile;
                } | {
                    @statusCode statusCode: 404;
                };

                @route("/tree/*")
                @get op tree(@path id: string, @path revision: string, @query recursive: boolean, @query collapse: boolean, @query compose: boolean): {
                    @statusCode statusCode: 200;
                    @body treenode: IfcxNode;
                } | {
                    @statusCode statusCode: 404;
                };
            }
        }
    }
}