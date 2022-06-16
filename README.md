# Package Graph

A set of public npm packages designed for testing various edge cases with
package managers. It's a directed acyclic graph (DAG) of packages with no
actual code. The value is in the relationship of the packages and various
published semver versions.

The packages are published on public npm under the `@pg1` scope. For example:
```
npm add @pg1/iron-plate
```

```mermaid
graph LR
  am1(assembling-machine-1)
  cc(copper-cable)
  co(copper-ore)
  cp(copper-plate)
  ec(electronic-circuit)
  ig(iron-gearwheel)
  io(iron-ore)
  ip(iron-plate)
  is(iron-stick)
  w(wood)
  wc(wooden-chest)

  am1 --> ec
  am1 --> ig
  am1 --> ip
  ig --> ip
  ip --> io
  is --> ip
  ec --> cc
  cc --> cp
  cp --> co
  wc --> w

  subgraph legend
    a(a) --> |depends on| b(b)
  end
```

Each package is published at three versions: `1.0.0`, `1.1.0`, and `2.0.0`.
Each respspective version depends on its dependencies at the corresponding
version with the `^` specifier. For example, `@pg1/iron-plate` at version `2.0.0`
depends on `@pg1/iron-ore@^2.0.0`.

## Maintainer notes

See the `generate-packages.js` file for more details on how the packages are
generated.

Publish process:
- `pnpm install`
- `npm login`
- `node generate-packages.js`
- `./publish.sh`
