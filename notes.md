

# Notes on current schema

These are some thoughts I have on how to improve the current example data and schema. 

### Identification
* Currently the `name` field is misused as an identifier of objects. This causes the following problems:
    1. Nested defs are not uniquely named, making it impossible to override them and forcing the use of instance classes.
    2. Objects are not uniquely named in general, this should be enforced as it simplifies all operations.
    3. Distributed authoring is more likely to result in conflicts due to name clashes.
    4. Names are data, and should be allowed to change freely without impacting collaboration with third parties.
* **Suggested action**: Introduce `id` field with type `guid`, move `name` to component.

### ID prefixing
* ID prefixing requires that composition of `A/B` take into account the overs on `A` and `B` separately but also on `A/B` as a joined path, this functionality is what distinguishes `A/B` from any other `B` and allows occurrence specific overrides. This does not work now, and instead is handled through defs. This is not necessary, see below.
* **Suggested action**: Use all path fragments during composition and for `over`.

### Defs
* The def spec is currently unclear
    1. Nested defs are allowed (likely due to naming issues) but these defs are hard to `over` because `over` does not work with ID prefixing yet, so we have to resort to classes to overcome this. 
    2. These nested defs sometimes have `attributes` defined on them, I would argue `attributes` should always come from `over` as they are part of the "components", not the "entities".
    3. The attributes on nested defs are untyped.
    4. Because of #3, there is a difference between "nested" and "top level" defs that every parser must grok.
* Use of instance classes
    1. In the examples often a class is used as an instance, this is strange as classes are meant for reuse and so should not be needed for a specific occurrence of an object. This is likely a result of the identification problem.
* **Suggested action**: Disallow nested defs, clearing up ambiguity of attributes. Discourage instance classes.

### Class
* The only purpose of the `class` and `inherits` def is to 'hide' an object from the tree, however this is not well specified and may not be necessary. The tree is not something that a user needs to see, as it is not a semantic but a transformation and composition tree.
* **Suggested action**: Unclear, but should rethink if we need `class` and `inherits`.

### JSON
* The current JSON structure has some issues on the top level
    1. Its an array, which are hard to extend (see the disclaimer object), would be nice if top-level is an object so we can dynamically add fields without breaking backwards compatibility.
    2. The array contains a mix of `over/def/class` but the problem is much easier to solve if these elements are handled by the reader in-order. First the composition tree is described, then the data for each entity is described. It would be nice if the file reflected this.
* **Suggested action**: Propose to do (at least) the following:
    ```
        IFC5File {
            header: { disclaimer: ..., version: ..., etc...},
            classes: [],
            defs: [],
            overs: []
        }
    ```
### Extension
* Need to include dynamic component schemas in the file format itself, TBD.
* **Suggested action**: Discuss.

### Diffs
* Need to define format for diffs, so we can do incremental updates to a layer. Because of the layer structure, this actually mostly means defining how to **delete** classes/defs/overs.
* **Suggested action**: Define delete operations.

### Attributes
* Currently the attributes are flattened, which will cause code generation to have to undo the flattening to return a self-contained component for an object.
* **Suggested action**: Remove flattening.

### Calculation
* Expanding the whole composition tree is costly in memory and time. 
* **Suggested action**: Work with a lazy evaluation system that works with something like a persistent database.

### Type
* The type field restricts shared authoring as the type is singular for an object, this defeats the ECS idea of "entity is just an ID".
* **Suggested action**: Remove type field and move semantics to a component on `over`, this will also reduce conflicts on the type field to conflicts on `over`, which we already solve.

### USD
* Some naming in the schema and the code is now reflecting USD, some is not. Currently this does not really help clarify the domain or the data, as the domain is not visualization and the data is not usd.
    1. component names contain USD but are only superficially compatible
    2. code references things like "prims", "arc", "layer", "shader" or "api"
    3. Many of the problems mentioned in this document are inherited from USD.
* **Suggested action**: Remove USD naming from IFC5, this will make it clearer what the data means for our domain (e.g `placement` vs `xform:op`, `entity` vs `prim`, `material` vs `shader`). Proceed with `ECS` based thinking to guide our design, retain id-prefixing and layers from `USD` as they solve concrete problems.

### Composition
* Special cases around `Shader` and the pseudo root `""` should be removed.
* **Suggested action**: Remove special cases, see `isPseudoRoot` in `compose2.ts`.


### Future
There are more topics that I think we should discuss, like binary serialization and APIs, but for me the above topics are the most pressing and most important to resolve early.