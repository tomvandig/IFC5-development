// compose.ts
function getChildByName(root, childName, skip = 0) {
  let fragments = childName.replace(/^<\/|^\/|>$/g, "").split("/");
  for (let i = 0; i < skip; ++i) {
    fragments.shift();
  }
  let start = root;
  while (fragments.length && start && start.children) {
    console.log(start, fragments[0]);
    let f = fragments.shift();
    start = start.children.find((i) => i.name.split("/").reverse()[0] === f);
  }
  if (fragments.length == 0) {
    return start;
  }
}

// compose2.ts
var PSEUDO_ROOT = "";
function MMSet(map, key, value) {
  if (map.has(key)) {
    map.get(key)?.push(value);
  } else {
    map.set(key, [value]);
  }
}
function CollectDefChildren(input, output, children) {
  let addedDefs = [];
  input.filter((o) => "children" in o).forEach((parent) => {
    parent.children.forEach((def) => {
      let newDefName = `${parent.name}/${def.name}`;
      addedDefs.push({
        ...def,
        name: newDefName
      });
      MMSet(children, parent.name, newDefName);
    });
  });
  output.push(...addedDefs);
}
function CleanInherit(inheritString) {
  return inheritString.substring(2, inheritString.length - 1);
}
function CollectInherits(input, collection) {
  input.forEach((input2) => {
    if (input2.inherits) {
      input2.inherits.forEach((parent) => {
        MMSet(collection, input2.name, CleanInherit(parent));
      });
    }
  });
}
function prefixAttributesWithComponentName(attributes) {
  let prefixed = {};
  Object.keys(attributes).forEach((componentName) => {
    if (attributes[componentName] !== null && typeof attributes[componentName] === "object" && !Array.isArray(attributes[componentName])) {
      Object.keys(attributes[componentName]).forEach((valueName) => {
        prefixed[`${componentName}:${valueName}`] = attributes[componentName][valueName];
      });
    } else {
      prefixed[componentName] = attributes[componentName];
    }
  });
  return prefixed;
}
function CondenseAttributes(attrs) {
  if (!attrs) return void 0;
  let condensed = {};
  attrs.filter((a) => a).forEach((attributes) => {
    condensed = { ...condensed, ...attributes };
  });
  return condensed;
}
var IntermediateComposition = class {
  names = /* @__PURE__ */ new Set();
  children = /* @__PURE__ */ new Map();
  inherits = /* @__PURE__ */ new Map();
  dependencies = /* @__PURE__ */ new Map();
  isClass = /* @__PURE__ */ new Map();
  types = /* @__PURE__ */ new Map();
  attributes = /* @__PURE__ */ new Map();
};
function GetAllAttributesForNode(ic, fullNodePath) {
  let attributeArray = [];
  let pathParts = fullNodePath.split("/");
  for (let i = pathParts.length - 1; i >= 0; i--) {
    let prefix = pathParts.slice(i, pathParts.length).join("/");
    let attrs = ic.attributes.get(prefix);
    if (attrs) attributeArray.push(...attrs);
  }
  return attributeArray.filter((a) => !!a);
}
function BuildTreeNodeFromIntermediateComposition(node, parentPath, parentInherits, ic) {
  let isPseudoRoot = node === PSEUDO_ROOT;
  let displayName = node.indexOf("/") > 0 ? node.substring(node.indexOf("/") + 1) : node;
  let currentNodePath = isPseudoRoot ? PSEUDO_ROOT : parentInherits ? parentPath : `${parentPath}/${displayName}`;
  let nodeAttributes = CondenseAttributes(GetAllAttributesForNode(ic, node));
  let obj = {
    name: currentNodePath,
    attributes: isPseudoRoot ? void 0 : nodeAttributes,
    type: isPseudoRoot ? void 0 : ic.types.get(node)
  };
  if (ic.children.has(node)) {
    obj.children = [];
    ic.children.get(node)?.forEach((child) => {
      let childObject = BuildTreeNodeFromIntermediateComposition(child, currentNodePath, false, ic);
      obj.children?.push(childObject);
    });
  }
  if (ic.inherits.has(node)) {
    obj.children = obj.children ? obj.children : [];
    ic.inherits.get(node)?.forEach((child) => {
      let childObject = BuildTreeNodeFromIntermediateComposition(child, currentNodePath, true, ic);
      if (childObject.children) {
        obj.children?.push(...childObject.children);
      }
      obj.type = childObject.type;
      obj.attributes = CondenseAttributes([childObject.attributes, obj.attributes]);
    });
  }
  return obj;
}
function UpdateIntermediateCompositionWithFile(ic, file) {
  let classes = file.filter((element) => "def" in element && element.def === "class");
  let defs = file.filter((element) => "def" in element && element.def === "def");
  let overs = file.filter((element) => "def" in element && element.def === "over");
  CollectDefChildren(classes, defs, ic.children);
  CollectDefChildren(defs, defs, ic.children);
  classes.forEach((c) => ic.names.add(c.name));
  defs.forEach((d) => ic.names.add(d.name));
  classes.forEach((c) => ic.isClass.set(c.name, true));
  classes.forEach((c) => ic.types.set(c.name, c.type));
  defs.forEach((d) => ic.types.set(d.name, d.type));
  {
    let plainAttributes = /* @__PURE__ */ new Map();
    defs.forEach((d) => MMSet(plainAttributes, d.name, d.attributes));
    overs.forEach((o) => MMSet(plainAttributes, o.name, o.attributes));
    plainAttributes.forEach((attrs, node) => {
      attrs.filter((a) => a).forEach((attr) => {
        MMSet(ic.attributes, node, prefixAttributesWithComponentName(attr));
      });
    });
  }
  CollectInherits(defs, ic.inherits);
  CollectInherits(classes, ic.inherits);
  return ic;
}
function BuildTreeFromIntermediateComposition(ic) {
  let parents = /* @__PURE__ */ new Map();
  ic.children.forEach((children, parent) => {
    children.forEach((child) => {
      MMSet(parents, child, parent);
    });
  });
  let roots = [];
  ic.names.forEach((name) => {
    if (!parents.has(name) || parents.get(name)?.length === 0) {
      roots.push(name);
    }
  });
  roots = roots.filter((root) => !ic.isClass.get(root));
  roots.forEach((root) => {
    MMSet(ic.children, PSEUDO_ROOT, root);
  });
  ic.names.add(PSEUDO_ROOT);
  return BuildTreeNodeFromIntermediateComposition(PSEUDO_ROOT, PSEUDO_ROOT, false, ic);
}
function compose2(files) {
  let ic = new IntermediateComposition();
  files.forEach((file) => UpdateIntermediateCompositionWithFile(ic, file));
  return BuildTreeFromIntermediateComposition(ic);
}

// compose-alpha.ts
function GetNode(node, path) {
  if (path === "") return node;
  let parts = path.split("/");
  let child = node.children.get(parts[0]);
  if (child) {
    if (parts.length === 1) {
      return child;
    }
    return GetNode(child, GetTail(path));
  } else {
    return null;
  }
}
function GetHead(path) {
  return path.split("/")[0];
}
function GetTail(path) {
  let parts = path.split("/");
  parts.shift();
  return parts.join("/");
}
function MakeNode(node) {
  return {
    node,
    children: /* @__PURE__ */ new Map(),
    attributes: /* @__PURE__ */ new Map()
  };
}
function ConvertToCompositionNode(path, inputNodes) {
  let compositionNode = {
    path,
    children: {},
    inherits: {},
    attributes: {}
  };
  inputNodes.forEach((node) => {
    Object.keys(node.children).forEach((childName) => {
      compositionNode.children[childName] = node.children[childName];
    });
    Object.keys(node.inherits).forEach((inheritName) => {
      let ih = node.inherits[inheritName];
      if (ih === null) {
        delete compositionNode.inherits[inheritName];
      } else {
        compositionNode.inherits[inheritName] = ih;
      }
    });
    Object.keys(node.attributes).forEach((attrName) => {
      compositionNode.attributes[attrName] = node.attributes[attrName];
    });
  });
  return compositionNode;
}
function MMSet2(map, key, value) {
  if (map.has(key)) {
    map.get(key)?.push(value);
  } else {
    map.set(key, [value]);
  }
}
function FindRootsOrCycles(nodes) {
  let dependencies = /* @__PURE__ */ new Map();
  let dependents = /* @__PURE__ */ new Map();
  nodes.forEach((node, path) => {
    Object.keys(node.inherits).forEach((inheritName) => {
      MMSet2(dependencies, path, node.inherits[inheritName]);
      MMSet2(dependents, node.inherits[inheritName], path);
    });
    Object.keys(node.children).forEach((childName) => {
      MMSet2(dependencies, path, node.children[childName]);
      MMSet2(dependents, node.children[childName], path);
    });
  });
  let paths = [...nodes.keys()];
  let perm = {};
  let temp = {};
  function visit(path) {
    if (perm[path]) return;
    if (temp[path]) throw new Error(`CYCLE!`);
    temp[path] = true;
    let deps = dependencies.get(path);
    if (deps) {
      deps.forEach((dep) => visit(dep));
    }
    perm[path] = true;
  }
  let roots = /* @__PURE__ */ new Set();
  try {
    paths.forEach((path) => {
      if (!dependents.has(path) && path.indexOf("/") === -1) {
        roots.add(path);
      }
      visit(path);
    });
  } catch (e) {
    return null;
  }
  return roots;
}
function ConvertNodes(input) {
  let compositionNodes = /* @__PURE__ */ new Map();
  for (let [path, inputNodes] of input) {
    compositionNodes.set(path, ConvertToCompositionNode(path, inputNodes));
  }
  return compositionNodes;
}
var CycleError = class extends Error {
};
function ExpandFirstRootInInput(nodes) {
  let roots = FindRootsOrCycles(nodes);
  if (!roots) {
    throw new CycleError();
  }
  return ExpandNewNode([...roots.values()][0], nodes);
}
function CreateArtificialRoot(nodes) {
  let roots = FindRootsOrCycles(nodes);
  if (!roots) {
    throw new CycleError();
  }
  let pseudoRoot = {
    node: "",
    attributes: /* @__PURE__ */ new Map(),
    children: /* @__PURE__ */ new Map()
  };
  roots.forEach((root) => {
    pseudoRoot.children.set(root, ExpandNewNode(root, nodes));
  });
  return pseudoRoot;
}
function ExpandNewNode(node, nodes) {
  return ExpandNode(node, MakeNode(node), nodes);
}
function ExpandNode(path, node, nodes) {
  let input = nodes.get(path);
  if (input) {
    AddDataFromInput(input, node, nodes);
  }
  node.children.forEach((child, name) => {
    ExpandNode(`${path}/${name}`, child, nodes);
  });
  return node;
}
function AddDataFromInput(input, node, nodes) {
  Object.values(input.inherits).forEach((inherit) => {
    let classNode = ExpandNewNode(GetHead(inherit), nodes);
    let subnode = GetNode(classNode, GetTail(inherit));
    if (!subnode) throw new Error(`Unknown node ${inherit}`);
    subnode.children.forEach((child, childName) => {
      node.children.set(childName, child);
    });
    for (let [attrID, attr] of subnode.attributes) {
      node.attributes.set(attrID, attr);
    }
  });
  Object.entries(input.children).forEach(([childName, child]) => {
    if (child !== null) {
      let classNode = ExpandNewNode(GetHead(child), nodes);
      let subnode = GetNode(classNode, GetTail(child));
      if (!subnode) throw new Error(`Unknown node ${child}`);
      node.children.set(childName, subnode);
    } else {
      node.children.delete(childName);
    }
  });
  Object.entries(input.attributes).forEach(([attrID, attr]) => {
    node.attributes.set(attrID, attr);
  });
}

// workflow-alpha.ts
function MMSet3(map, key, value) {
  if (map.has(key)) {
    map.get(key)?.push(value);
  } else {
    map.set(key, [value]);
  }
}
function ToInputNodes(data) {
  let inputNodes = /* @__PURE__ */ new Map();
  data.forEach((ifcxNode) => {
    let node = {
      path: ifcxNode.name,
      children: ifcxNode.children ? ifcxNode.children : {},
      inherits: ifcxNode.inherits ? ifcxNode.inherits : {},
      attributes: ifcxNode.attributes ? ifcxNode.attributes : {}
    };
    MMSet3(inputNodes, node.path, node);
  });
  return inputNodes;
}
var SchemaValidationError = class extends Error {
};
function ValidateAttributeValue(desc, value, path) {
  if (desc.dataType === "Boolean") {
    if (typeof value !== "boolean") {
      throw new SchemaValidationError(`Expected "${value}" to be of type boolean`);
    }
  } else if (desc.dataType === "String") {
    if (typeof value !== "string") {
      throw new SchemaValidationError(`Expected "${value}" to be of type string`);
    }
  } else if (desc.dataType === "DateTime") {
    if (typeof value !== "string") {
      throw new SchemaValidationError(`Expected "${value}" to be of type date`);
    }
  } else if (desc.dataType === "Enum") {
    if (typeof value !== "string") {
      throw new SchemaValidationError(`Expected "${value}" to be of type string`);
    }
    let found = desc.enumRestrictions.options.filter((option) => option === value).length === 1;
    if (!found) {
      throw new SchemaValidationError(`Expected "${value}" to be one of [${desc.enumRestrictions.options.join(",")}]`);
    }
  } else if (desc.dataType === "Integer") {
    if (typeof value !== "number") {
      throw new SchemaValidationError(`Expected "${value}" to be of type int`);
    }
  } else if (desc.dataType === "Real") {
    if (typeof value !== "number") {
      throw new SchemaValidationError(`Expected "${value}" to be of type real`);
    }
  } else if (desc.dataType === "Relation") {
    if (typeof value !== "string") {
      throw new SchemaValidationError(`Expected "${value}" to be of type string`);
    }
  } else if (desc.dataType === "Object") {
    if (typeof value !== "object") {
      throw new SchemaValidationError(`Expected "${value}" to be of type object`);
    }
    Object.keys(desc.objectRestrictions.values).forEach((key) => {
      if (!Object.hasOwn(value, key)) {
        throw new SchemaValidationError(`Expected "${value}" to have key ${key}`);
      }
      ValidateAttributeValue(desc.objectRestrictions.values[key], value[key], path + "." + key);
    });
  } else if (desc.dataType === "Array") {
    if (!Array.isArray(value)) {
      throw new SchemaValidationError(`Expected "${value}" to be of type array`);
    }
    value.forEach((entry) => {
      ValidateAttributeValue(desc.arrayRestrictions.value, entry, path + ".<array>.");
    });
  } else {
    throw new SchemaValidationError(`Unexpected datatype ${desc.dataType}`);
  }
}
function Validate(schemas, inputNodes) {
  inputNodes.forEach((node) => {
    Object.keys(node.attributes).forEach((schemaID) => {
      if (!schemas[schemaID]) {
        throw new SchemaValidationError(`Missing schema "${schemaID}" referenced by "${node.path}".attributes`);
      }
      let schema = schemas[schemaID];
      let value = node.attributes[schemaID];
      try {
        ValidateAttributeValue(schema.value, value, "");
      } catch (e) {
        if (e instanceof SchemaValidationError) {
          throw new SchemaValidationError(`Error validating ["${node.path}"].attributes["${schemaID}"]: ${e.message}`);
        } else {
          throw e;
        }
      }
    });
  });
}
function LoadIfcxFile(file, checkSchemas = true, createArtificialRoot = false) {
  let inputNodes = ToInputNodes(file.data);
  let compositionNodes = ConvertNodes(inputNodes);
  try {
    if (checkSchemas) {
      Validate(file.schemas, compositionNodes);
    }
  } catch (e) {
    throw e;
  }
  if (createArtificialRoot) {
    return CreateArtificialRoot(compositionNodes);
  } else {
    return ExpandFirstRootInInput(compositionNodes);
  }
}
function Federate(files) {
  let result = {
    header: files[0].header,
    schemas: {},
    data: []
  };
  files.forEach((file) => {
    Object.keys(file.schemas).forEach((schemaID) => result.schemas[schemaID] = file.schemas[schemaID]);
  });
  files.forEach((file) => {
    file.data.forEach((node) => result.data.push(node));
  });
  return Prune(result);
}
function Collapse(nodes, deleteEmpty = false) {
  let result = {
    path: nodes[0].path,
    children: {},
    inherits: {},
    attributes: {}
  };
  nodes.forEach((node) => {
    Object.keys(node.children).forEach((name) => {
      result.children[name] = node.children[name];
    });
    Object.keys(node.inherits).forEach((name) => {
      result.inherits[name] = node.inherits[name];
    });
    Object.keys(node.attributes).forEach((name) => {
      result.attributes[name] = node.attributes[name];
    });
  });
  if (deleteEmpty) {
    let empty = true;
    Object.keys(result.children).forEach((name) => {
      if (result.children[name] !== null) empty = false;
    });
    Object.keys(result.inherits).forEach((name) => {
      if (result.inherits[name] !== null) empty = false;
    });
    Object.keys(result.attributes).forEach((name) => {
      if (result.attributes[name] !== null) empty = false;
    });
    if (empty) return null;
  }
  return result;
}
function Prune(file, deleteEmpty = false) {
  let result = {
    header: file.header,
    schemas: file.schemas,
    data: []
  };
  let inputNodes = ToInputNodes(file.data);
  inputNodes.forEach((nodes) => {
    let collapsed = Collapse(nodes, deleteEmpty);
    if (collapsed) result.data.push({
      name: collapsed.path,
      children: collapsed.children,
      inherits: collapsed.inherits,
      attributes: collapsed.attributes
    });
  });
  return result;
}

// compose3.ts
function TreeNodeToComposedObject(path, node) {
  let co = {
    name: path,
    attributes: {},
    children: []
  };
  node.children.forEach((childNode, childName) => {
    co.children?.push(TreeNodeToComposedObject(`${path}/${childName}`, childNode));
  });
  node.attributes.forEach((attr, attrName) => {
    if (attr && typeof attr === "object" && !Array.isArray(attr)) {
      Object.keys(attr).forEach((compname) => {
        co.attributes[`${attrName}:${compname}`] = attr[compname];
      });
    } else {
      co.attributes[attrName] = attr;
    }
  });
  if (Object.keys(co.attributes).length === 0) delete co.attributes;
  return co;
}
function compose3(files) {
  let federated = Federate(files);
  let tree = LoadIfcxFile(federated, true, true);
  return TreeNodeToComposedObject("", tree);
}

// render.ts
var controls;
var renderer;
var scene;
var camera;
var datas = [];
var autoCamera = true;
var THREE = window["THREE"];
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.up.set(0, 0, 1);
  camera.position.set(50, 50, 50);
  camera.lookAt(0, 0, 0);
  const nd = document.querySelector(".viewport");
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true
  });
  renderer.setSize(nd.offsetWidth, nd.offsetHeight);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  nd.appendChild(renderer.domElement);
  return scene;
}
function HasAttr(node, attrName) {
  if (!node || !node.attributes) return false;
  return !!node.attributes[attrName];
}
function FindChildWithAttr(node, attrName) {
  if (!node || !node.children) return void 0;
  for (let i = 0; i < node.children.length; i++) {
    if (HasAttr(node.children[i], attrName)) {
      return node.children[i];
    }
  }
  return void 0;
}
function createMaterialFromParent(parent, root) {
  let reference = parent.attributes["UsdShade:MaterialBindingAPI:material:binding"];
  let material = {
    color: new THREE.Color(0.6, 0.6, 0.6),
    transparent: false,
    opacity: 1
  };
  if (reference) {
    const materialNode = getChildByName(root, reference.ref);
    let shader = FindChildWithAttr(materialNode, "inputs:diffuseColor");
    if (shader) {
      let color = shader?.attributes["inputs:diffuseColor"];
      material.color = new THREE.Color(...color);
      if (shader?.attributes["inputs:opacity"]) {
        material.transparent = true;
        material.opacity = shader.attributes["inputs:opacity"];
      }
    }
  }
  return material;
}
function createCurveFromJson(node, parent, root) {
  let points = new Float32Array(node.attributes["UsdGeom:BasisCurves:points"].flat());
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
  const material = createMaterialFromParent(parent, root);
  let lineMaterial = new THREE.LineBasicMaterial({ ...material });
  lineMaterial.color.multiplyScalar(0.8);
  return new THREE.Line(geometry, lineMaterial);
}
function createMeshFromJson(node, parent, root) {
  let points = new Float32Array(node.attributes["UsdGeom:Mesh:points"].flat());
  let indices = new Uint16Array(node.attributes["UsdGeom:Mesh:faceVertexIndices"]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  const material = createMaterialFromParent(parent, root);
  let meshMaterial = new THREE.MeshBasicMaterial({ ...material });
  return new THREE.Mesh(geometry, meshMaterial);
}
function traverseTree(node, parent, root, parentNode = void 0) {
  let elem = new THREE.Group();
  if (HasAttr(node, "UsdGeom:VisibilityAPI:visibility:visibility")) {
    if (node.attributes["UsdGeom:VisibilityAPI:visibility:visibility"] === "invisible") {
      return;
    }
  } else if (HasAttr(node, "UsdGeom:Mesh:points")) {
    elem = createMeshFromJson(node, parentNode, root);
  } else if (HasAttr(node, "UsdGeom:BasisCurves:points")) {
    elem = createCurveFromJson(node, parentNode, root);
  }
  parent.add(elem);
  if (node !== root) {
    elem.matrixAutoUpdate = false;
    let matrixNode = node.attributes && node.attributes["xformOp:transform"] ? node.attributes["xformOp:transform"].flat() : null;
    if (matrixNode) {
      let matrix = new THREE.Matrix4();
      matrix.set(...matrixNode);
      matrix.transpose();
      elem.matrix = matrix;
    }
  }
  (node.children || []).forEach((child) => traverseTree(child, elem || parent, root, node));
}
function encodeHtmlEntities(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
var icons = {
  "UsdGeom:Mesh:points": "deployed_code",
  "UsdGeom:BasisCurves:points": "line_curve",
  "UsdShade:Material:outputs:surface.connect": "line_style"
};
function buildDomTree(prim, node) {
  const elem = document.createElement("div");
  let span;
  elem.appendChild(document.createTextNode(prim.name ? prim.name.split("/").reverse()[0] : "root"));
  elem.appendChild(span = document.createElement("span"));
  Object.entries(icons).forEach(([k, v]) => span.innerText += (prim.attributes || {})[k] ? v : " ");
  span.className = "material-symbols-outlined";
  elem.onclick = (evt) => {
    let rows = [["name", prim.name]].concat(Object.entries(prim.attributes)).map(([k, v]) => `<tr><td>${encodeHtmlEntities(k)}</td><td>${encodeHtmlEntities(typeof v === "object" ? JSON.stringify(v) : v)}</td>`).join("");
    document.querySelector(".attributes .table").innerHTML = `<table border="0">${rows}</table>`;
    evt.stopPropagation();
  };
  node.appendChild(elem);
  (prim.children || []).forEach((p) => buildDomTree(p, elem));
}
function composeAndRender() {
  if (scene) {
    scene.children = [];
  }
  document.querySelector(".tree").innerHTML = "";
  if (datas.length === 0) {
    return;
  }
  let tree = null;
  let dataArray = datas.map((arr) => arr[1]);
  if (Array.isArray(dataArray[0])) {
    alert(`Please upgrade your files to ifcx alpha, see https://github.com/buildingSMART/IFC5-development for more info.`);
    tree = compose2(dataArray);
  } else {
    tree = compose3(dataArray);
  }
  if (!tree) {
    console.error("No result from composition");
    return;
  }
  traverseTree(tree, scene || init(), tree);
  if (autoCamera) {
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(scene);
    if (!boundingBox.isEmpty()) {
      let avg = boundingBox.min.clone().add(boundingBox.max).multiplyScalar(0.5);
      let ext = boundingBox.max.clone().sub(boundingBox.min).length();
      camera.position.copy(avg.clone().add(new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(ext)));
      camera.far = ext * 3;
      camera.updateProjectionMatrix();
      controls.target.copy(avg);
      controls.update();
      autoCamera = false;
    }
  }
  buildDomTree(tree, document.querySelector(".tree"));
  animate();
}
function createLayerDom() {
  document.querySelector(".layers div").innerHTML = "";
  datas.forEach(([name, _], index) => {
    const elem = document.createElement("div");
    elem.appendChild(document.createTextNode(name));
    ["\u25B3", "\u25BD", "\xD7"].reverse().forEach((lbl, cmd) => {
      const btn = document.createElement("span");
      btn.onclick = (evt) => {
        evt.stopPropagation();
        if (cmd === 2) {
          if (index > 0) {
            [datas[index], datas[index - 1]] = [datas[index - 1], datas[index]];
          }
        } else if (cmd === 1) {
          if (index < datas.length - 1) {
            [datas[index], datas[index + 1]] = [datas[index + 1], datas[index]];
          }
        } else if (cmd === 0) {
          datas.splice(index, 1);
        }
        composeAndRender();
        createLayerDom();
      };
      btn.appendChild(document.createTextNode(lbl));
      elem.appendChild(btn);
    });
    document.querySelector(".layers div").appendChild(elem);
  });
}
function addModel(name, m) {
  datas.push([name, m]);
  createLayerDom();
  composeAndRender();
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
export {
  composeAndRender,
  addModel as default
};
