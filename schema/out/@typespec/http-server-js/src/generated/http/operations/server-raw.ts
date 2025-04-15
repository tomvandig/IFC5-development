// Generated by Microsoft TypeSpec

import { HttpContext } from "../../helpers/router.js";

import {
  isHttpResponder as __isHttpResponder_0,
  HTTP_RESPONDER as __httpResponderSymbol_1,
} from "../../helpers/http.js";

import {
  IfcxApi,
  IfcxFile,
  LayerResponse,
  LayerCreateCommand,
  LayerUpdateCommand,
  LayerDeleteCommand,
  LayerRevision,
  HttpIfcxFile,
  IfcxNode,
} from "../../models/all/index.js";

import { LayersApi } from "../../models/all/ifcx-api/index.js";

import { parseHeaderValueParameters } from "../../helpers/header.js";

import {
  CreateResult,
  UpdateResult,
  DeleteResult,
} from "../../models/synthetic.js";

import { LayerApi } from "../../models/all/ifcx-api/layers-api/index.js";

import { LayerHistory } from "../../models/all/ifcx-api/layers-api/layer-api.js";

export async function ifcx_api_dummy(
  __ctx_2: HttpContext,
  __operations_4: IfcxApi,
): Promise<void> {
  let __result_3: IfcxFile;

  try {
    __result_3 = await __operations_4.dummy(__ctx_2);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_2);
    } else throw e;
  }

  __ctx_2.response.setHeader("content-type", "application/json");
  __ctx_2.response.end(JSON.stringify(__result_3));
}

export async function layers_api_list(
  __ctx_6: HttpContext,
  __operations_8: LayersApi,
): Promise<void> {
  let __result_7: LayerResponse[];

  try {
    __result_7 = await __operations_8.list(__ctx_6);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_6);
    } else throw e;
  }

  __ctx_6.response.end();
}

export async function layers_api_create(
  __ctx_10: HttpContext,
  __operations_12: LayersApi,
): Promise<void> {
  const __contentType_15 = parseHeaderValueParameters(
    __ctx_10.request.headers["content-type"] as string | undefined,
  );
  if (__contentType_15?.value !== "application/json") {
    return __ctx_10.errorHandlers.onInvalidRequest(
      __ctx_10,
      "/ifc/v5a/layers",
      `unexpected "content-type": '${__contentType_15?.value}', expected '"application/json"'`,
    );
  }

  const __command_14 = (await new Promise(function parseCommand(
    resolve,
    reject,
  ) {
    const chunks: Array<Buffer> = [];
    __ctx_10.request.on("data", function appendChunk(chunk) {
      chunks.push(chunk);
    });
    __ctx_10.request.on("end", function finalize() {
      try {
        const body = Buffer.concat(chunks).toString();
        resolve(JSON.parse(body));
      } catch {
        __ctx_10.errorHandlers.onInvalidRequest(
          __ctx_10,
          "/ifc/v5a/layers",
          "invalid JSON in request body",
        );
        reject();
      }
    });
    __ctx_10.request.on("error", reject);
  })) as LayerCreateCommand;

  let __result_11: CreateResult;

  try {
    __result_11 = await __operations_12.create(__ctx_10, __command_14);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_10);
    } else throw e;
  }

  __ctx_10.response.statusCode = __result_11.statusCode;
  delete (__result_11 as any).statusCode;
  __ctx_10.response.end();
}

export async function layers_api_update(
  __ctx_16: HttpContext,
  __operations_18: LayersApi,
): Promise<void> {
  const __contentType_21 = parseHeaderValueParameters(
    __ctx_16.request.headers["content-type"] as string | undefined,
  );
  if (__contentType_21?.value !== "application/json") {
    return __ctx_16.errorHandlers.onInvalidRequest(
      __ctx_16,
      "/ifc/v5a/layers",
      `unexpected "content-type": '${__contentType_21?.value}', expected '"application/json"'`,
    );
  }

  const __command_20 = (await new Promise(function parseCommand(
    resolve,
    reject,
  ) {
    const chunks: Array<Buffer> = [];
    __ctx_16.request.on("data", function appendChunk(chunk) {
      chunks.push(chunk);
    });
    __ctx_16.request.on("end", function finalize() {
      try {
        const body = Buffer.concat(chunks).toString();
        resolve(JSON.parse(body));
      } catch {
        __ctx_16.errorHandlers.onInvalidRequest(
          __ctx_16,
          "/ifc/v5a/layers",
          "invalid JSON in request body",
        );
        reject();
      }
    });
    __ctx_16.request.on("error", reject);
  })) as LayerUpdateCommand;

  let __result_17: UpdateResult;

  try {
    __result_17 = await __operations_18.update(__ctx_16, __command_20);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_16);
    } else throw e;
  }

  __ctx_16.response.statusCode = __result_17.statusCode;
  delete (__result_17 as any).statusCode;
  __ctx_16.response.end();
}

export async function layers_api_delete(
  __ctx_22: HttpContext,
  __operations_24: LayersApi,
): Promise<void> {
  const __contentType_27 = parseHeaderValueParameters(
    __ctx_22.request.headers["content-type"] as string | undefined,
  );
  if (__contentType_27?.value !== "application/json") {
    return __ctx_22.errorHandlers.onInvalidRequest(
      __ctx_22,
      "/ifc/v5a/layers",
      `unexpected "content-type": '${__contentType_27?.value}', expected '"application/json"'`,
    );
  }

  const __command_26 = (await new Promise(function parseCommand(
    resolve,
    reject,
  ) {
    const chunks: Array<Buffer> = [];
    __ctx_22.request.on("data", function appendChunk(chunk) {
      chunks.push(chunk);
    });
    __ctx_22.request.on("end", function finalize() {
      try {
        const body = Buffer.concat(chunks).toString();
        resolve(JSON.parse(body));
      } catch {
        __ctx_22.errorHandlers.onInvalidRequest(
          __ctx_22,
          "/ifc/v5a/layers",
          "invalid JSON in request body",
        );
        reject();
      }
    });
    __ctx_22.request.on("error", reject);
  })) as LayerDeleteCommand;

  let __result_23: DeleteResult;

  try {
    __result_23 = await __operations_24.delete(__ctx_22, __command_26);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_22);
    } else throw e;
  }

  __ctx_22.response.statusCode = __result_23.statusCode;
  delete (__result_23 as any).statusCode;
  __ctx_22.response.end();
}

export async function layer_api_get(
  __ctx_28: HttpContext,
  __operations_30: LayerApi,
  id: string,
): Promise<void> {
  let __result_29:
    | { statusCode: 200; layer: LayerResponse }
    | { statusCode: 404 };

  try {
    __result_29 = await __operations_30.get(__ctx_28, id);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_28);
    } else throw e;
  }

  if ("statusCode" in __result_29 && __result_29.statusCode === 200) {
    __ctx_28.response.statusCode = __result_29.statusCode;
    __ctx_28.response.setHeader("content-type", "application/json");
    __ctx_28.response.end(JSON.stringify(__result_29.layer));
  } else if ("statusCode" in __result_29 && __result_29.statusCode === 404) {
    __ctx_28.response.statusCode = __result_29.statusCode;
    delete (__result_29 as any).statusCode;
    __ctx_28.response.end();
  }
}

export async function layer_api_revisions(
  __ctx_32: HttpContext,
  __operations_34: LayerApi,
  id: string,
): Promise<void> {
  let __result_33:
    | { statusCode: 200; layer: LayerRevision[] }
    | { statusCode: 404 };

  try {
    __result_33 = await __operations_34.revisions(__ctx_32, id);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_32);
    } else throw e;
  }

  if ("statusCode" in __result_33 && __result_33.statusCode === 200) {
    __ctx_32.response.statusCode = __result_33.statusCode;
    __ctx_32.response.setHeader("content-type", "application/json");
    __ctx_32.response.end(JSON.stringify(__result_33.layer));
  } else if ("statusCode" in __result_33 && __result_33.statusCode === 404) {
    __ctx_32.response.statusCode = __result_33.statusCode;
    delete (__result_33 as any).statusCode;
    __ctx_32.response.end();
  }
}

export async function layer_api_push(
  __ctx_36: HttpContext,
  __operations_38: LayerApi,
  id: string,
): Promise<void> {
  const __contentType_41 = parseHeaderValueParameters(
    __ctx_36.request.headers["content-type"] as string | undefined,
  );
  if (__contentType_41?.value !== "application/json") {
    return __ctx_36.errorHandlers.onInvalidRequest(
      __ctx_36,
      "/ifc/v5a/layers/{id}/push",
      `unexpected "content-type": '${__contentType_41?.value}', expected '"application/json"'`,
    );
  }

  const __ifcxFile_40 = (await new Promise(function parseIfcxFile(
    resolve,
    reject,
  ) {
    const chunks: Array<Buffer> = [];
    __ctx_36.request.on("data", function appendChunk(chunk) {
      chunks.push(chunk);
    });
    __ctx_36.request.on("end", function finalize() {
      try {
        const body = Buffer.concat(chunks).toString();
        resolve(JSON.parse(body));
      } catch {
        __ctx_36.errorHandlers.onInvalidRequest(
          __ctx_36,
          "/ifc/v5a/layers/{id}/push",
          "invalid JSON in request body",
        );
        reject();
      }
    });
    __ctx_36.request.on("error", reject);
  })) as HttpIfcxFile;

  let __result_37: { statusCode: 200 } | { statusCode: 404 };

  try {
    __result_37 = await __operations_38.push(__ctx_36, id, __ifcxFile_40);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_36);
    } else throw e;
  }

  if ("statusCode" in __result_37 && __result_37.statusCode === 200) {
    __ctx_36.response.statusCode = __result_37.statusCode;
    delete (__result_37 as any).statusCode;
    __ctx_36.response.end();
  } else if ("statusCode" in __result_37 && __result_37.statusCode === 404) {
    __ctx_36.response.statusCode = __result_37.statusCode;
    delete (__result_37 as any).statusCode;
    __ctx_36.response.end();
  }
}

export async function layer_history_get(
  __ctx_42: HttpContext,
  __operations_44: LayerHistory,
  id: string,
  revision: string,
): Promise<void> {
  let __result_43: LayerRevision;

  try {
    __result_43 = await __operations_44.get(__ctx_42, id, revision);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_42);
    } else throw e;
  }

  __ctx_42.response.setHeader("content-type", "application/json");
  __ctx_42.response.end(JSON.stringify(__result_43));
}

export async function layer_history_ifcx(
  __ctx_46: HttpContext,
  __operations_48: LayerHistory,
  id: string,
  revision: string,
): Promise<void> {
  let __result_47:
    | { statusCode: 200; ifcxFile: HttpIfcxFile }
    | { statusCode: 404 };

  try {
    __result_47 = await __operations_48.ifcx(__ctx_46, id, revision);
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_46);
    } else throw e;
  }

  if ("statusCode" in __result_47 && __result_47.statusCode === 200) {
    __ctx_46.response.statusCode = __result_47.statusCode;
    __ctx_46.response.setHeader("content-type", "application/json");
    __ctx_46.response.end(JSON.stringify(__result_47.ifcxFile));
  } else if ("statusCode" in __result_47 && __result_47.statusCode === 404) {
    __ctx_46.response.statusCode = __result_47.statusCode;
    delete (__result_47 as any).statusCode;
    __ctx_46.response.end();
  }
}

export async function layer_history_tree(
  __ctx_50: HttpContext,
  __operations_52: LayerHistory,
  id: string,
  revision: string,
): Promise<void> {
  const __queryParams_53 = new URLSearchParams(
    __ctx_50.request.url!.split("?", 2)[1] ?? "",
  );

  const recursive = __queryParams_53.get("recursive") ?? undefined;
  if (!recursive) {
    return __ctx_50.errorHandlers.onInvalidRequest(
      __ctx_50,
      "/ifc/v5a/layers/{id}/{revision}/tree/*",
      "missing required query parameter 'recursive'",
    );
  }

  const collapse = __queryParams_53.get("collapse") ?? undefined;
  if (!collapse) {
    return __ctx_50.errorHandlers.onInvalidRequest(
      __ctx_50,
      "/ifc/v5a/layers/{id}/{revision}/tree/*",
      "missing required query parameter 'collapse'",
    );
  }

  const compose = __queryParams_53.get("compose") ?? undefined;
  if (!compose) {
    return __ctx_50.errorHandlers.onInvalidRequest(
      __ctx_50,
      "/ifc/v5a/layers/{id}/{revision}/tree/*",
      "missing required query parameter 'compose'",
    );
  }

  let __result_51:
    | { statusCode: 200; treenode: IfcxNode }
    | { statusCode: 404 };

  try {
    __result_51 = await __operations_52.tree(
      __ctx_50,
      id,
      revision,
      recursive === "false" ? false : globalThis.Boolean(recursive),
      collapse === "false" ? false : globalThis.Boolean(collapse),
      compose === "false" ? false : globalThis.Boolean(compose),
    );
  } catch (e) {
    if (__isHttpResponder_0(e)) {
      return e[__httpResponderSymbol_1](__ctx_50);
    } else throw e;
  }

  if ("statusCode" in __result_51 && __result_51.statusCode === 200) {
    __ctx_50.response.statusCode = __result_51.statusCode;
    __ctx_50.response.setHeader("content-type", "application/json");
    __ctx_50.response.end(JSON.stringify(__result_51.treenode));
  } else if ("statusCode" in __result_51 && __result_51.statusCode === 404) {
    __ctx_50.response.statusCode = __result_51.statusCode;
    delete (__result_51 as any).statusCode;
    __ctx_50.response.end();
  }
}
