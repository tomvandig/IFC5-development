import "@typespec/http";

import "./ifcx-alpha.tsp";

using Http;

model Layer {
  id: string;
}

model LayerCreateCommand {
  id: string;
}

@route("/layers")
interface LayerStore {
  @route("")
  @get list(): Layer[];
  
  @route("create")
  @post create(@body command: LayerCreateCommand): {
    @statusCode statusCode: 200;
  };

  @route("{id}")
  @get get(@path id: string): {
    @statusCode statusCode: 200;
    @body layer: Layer;
  } | {
    @statusCode statusCode: 404;
  };
}