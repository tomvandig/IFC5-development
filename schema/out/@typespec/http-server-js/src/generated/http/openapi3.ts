// Generated by Microsoft TypeSpec

export const openApiDocument = {
  openapi: "3.0.0",
  info: { title: "(title)", version: "0.0.0" },
  tags: [],
  paths: {
    "/ifc/v5a/dummy": {
      get: {
        operationId: "dummy",
        parameters: [],
        responses: {
          "200": {
            description: "The request has succeeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/IfcxFile" },
              },
            },
          },
        },
      },
    },
    "/ifc/v5a/layers": {
      get: {
        operationId: "LayersApi_list",
        parameters: [],
        responses: {
          "200": {
            description: "The request has succeeded.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/LayerResponse" },
                },
              },
            },
          },
        },
      },
      post: {
        operationId: "LayersApi_create",
        parameters: [],
        responses: { "200": { description: "The request has succeeded." } },
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LayerCreateCommand" },
            },
          },
        },
      },
      put: {
        operationId: "LayersApi_update",
        parameters: [],
        responses: { "200": { description: "The request has succeeded." } },
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LayerUpdateCommand" },
            },
          },
        },
      },
      delete: {
        operationId: "LayersApi_delete",
        parameters: [],
        responses: { "200": { description: "The request has succeeded." } },
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LayerDeleteCommand" },
            },
          },
        },
      },
    },
    "/ifc/v5a/layers/{id}": {
      get: {
        operationId: "LayerApi_get",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "The request has succeeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LayerResponse" },
              },
            },
          },
          "404": {
            description: "The server cannot find the requested resource.",
          },
        },
      },
    },
    "/ifc/v5a/layers/{id}/revisions": {
      get: {
        operationId: "LayerApi_revisions",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "The request has succeeded.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/LayerRevision" },
                },
              },
            },
          },
          "404": {
            description: "The server cannot find the requested resource.",
          },
        },
      },
    },
    "/ifc/v5a/layers/{id}/push": {
      put: {
        operationId: "LayerApi_push",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "The request has succeeded." },
          "404": {
            description: "The server cannot find the requested resource.",
          },
        },
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "string", format: "binary" },
            },
          },
        },
      },
    },
    "/ifc/v5a/layers/{id}/{revision}": {
      get: {
        operationId: "LayerHistory_get",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "revision",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "The request has succeeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LayerRevision" },
              },
            },
          },
        },
      },
    },
    "/ifc/v5a/layers/{id}/{revision}/ifcx": {
      get: {
        operationId: "LayerHistory_ifcx",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "revision",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "The request has succeeded.",
            content: {
              "application/json": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          "404": {
            description: "The server cannot find the requested resource.",
          },
        },
      },
    },
    "/ifc/v5a/layers/{id}/{revision}/tree/*": {
      get: {
        operationId: "LayerHistory_tree",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "revision",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "recursive",
            in: "query",
            required: true,
            schema: { type: "boolean" },
            explode: false,
          },
          {
            name: "collapse",
            in: "query",
            required: true,
            schema: { type: "boolean" },
            explode: false,
          },
          {
            name: "compose",
            in: "query",
            required: true,
            schema: { type: "boolean" },
            explode: false,
          },
        ],
        responses: {
          "200": {
            description: "The request has succeeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/IfcxNode" },
              },
            },
          },
          "404": {
            description: "The server cannot find the requested resource.",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      IfcxHeader: {
        type: "object",
        required: ["version", "author", "timestamp"],
        properties: {
          version: { type: "string" },
          author: { type: "string" },
          timestamp: { type: "string" },
        },
      },
      DataType: {
        type: "string",
        enum: [
          "Real",
          "Boolean",
          "Integer",
          "String",
          "DateTime",
          "Enum",
          "Array",
          "Object",
          "Relation",
        ],
      },
      QuantityKind: {
        type: "string",
        enum: [
          "Plane angle",
          "Thermodynamic temperature",
          "Electric current",
          "Time",
          "Frequency",
          "Mass",
          "Length",
          "Linear velocity",
          "Force",
          "Pressure",
          "Area",
          "Energy",
          "Power",
          "Volume",
        ],
      },
      EnumRestrictions: {
        type: "object",
        required: ["options"],
        properties: { options: { type: "array", items: { type: "string" } } },
      },
      ArrayRestrictions: {
        type: "object",
        required: ["value"],
        properties: {
          min: { type: "number" },
          max: { type: "number" },
          value: { $ref: "#/components/schemas/IfcxValueDescription" },
        },
      },
      ObjectRestrictions: {
        type: "object",
        required: ["values"],
        properties: {
          values: {
            type: "object",
            additionalProperties: {
              $ref: "#/components/schemas/IfcxValueDescription",
            },
          },
        },
      },
      RelationRestrictions: {
        type: "object",
        required: ["type"],
        properties: { type: { type: "string" } },
      },
      IfcxValueDescription: {
        type: "object",
        required: ["dataType"],
        properties: {
          dataType: { $ref: "#/components/schemas/DataType" },
          inherits: { type: "array", items: { type: "string" } },
          quantityKind: { $ref: "#/components/schemas/QuantityKind" },
          enumRestrictions: { $ref: "#/components/schemas/EnumRestrictions" },
          arrayRestrictions: { $ref: "#/components/schemas/ArrayRestrictions" },
          objectRestrictions: {
            $ref: "#/components/schemas/ObjectRestrictions",
          },
          relationRestrictions: {
            $ref: "#/components/schemas/RelationRestrictions",
          },
        },
      },
      IfcxSchema: {
        type: "object",
        required: ["value"],
        properties: {
          uri: { type: "string" },
          value: { $ref: "#/components/schemas/IfcxValueDescription" },
        },
      },
      path: { type: "string", pattern: "</[A-Za-z0-9_/.:]+>" },
      IfcxNode: {
        type: "object",
        required: ["identifier"],
        properties: {
          identifier: { $ref: "#/components/schemas/path" },
          children: {
            type: "object",
            additionalProperties: { type: "string", nullable: true },
          },
          inherits: {
            type: "object",
            additionalProperties: { type: "string", nullable: true },
          },
          attributes: { type: "object", additionalProperties: {} },
        },
      },
      IfcxFile: {
        type: "object",
        required: ["header", "schemas", "data"],
        properties: {
          header: { $ref: "#/components/schemas/IfcxHeader" },
          schemas: {
            type: "object",
            additionalProperties: { $ref: "#/components/schemas/IfcxSchema" },
          },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/IfcxNode" },
          },
        },
      },
      FederatedLayerRevision: {
        type: "object",
        required: ["layerID", "hash"],
        properties: { layerID: { type: "string" }, hash: { type: "string" } },
      },
      LayerRevision: {
        type: "object",
        required: ["hash"],
        properties: {
          hash: { type: "string" },
          origin: {
            type: "array",
            items: { $ref: "#/components/schemas/FederatedLayerRevision" },
          },
        },
      },
      LayerResponse: {
        type: "object",
        required: ["id", "name", "head", "federatedLayers"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          head: { $ref: "#/components/schemas/LayerRevision" },
          federatedLayers: {
            type: "array",
            items: { $ref: "#/components/schemas/FederatedLayerRevision" },
          },
        },
      },
      LayerCreateCommand: {
        type: "object",
        required: ["id", "name", "federatedLayers"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          federatedLayers: {
            type: "array",
            items: { $ref: "#/components/schemas/FederatedLayerRevision" },
          },
        },
      },
      LayerUpdateCommand: {
        type: "object",
        required: ["id", "name"],
        properties: { id: { type: "string" }, name: { type: "string" } },
      },
      LayerDeleteCommand: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string" } },
      },
    },
  },
};
