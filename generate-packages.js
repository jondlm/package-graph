const fs = require("fs");
const path = require("path");
const semver = require("semver");
const assert = require("assert");
const { set } = require("lodash");

const scope = "@pg1";

// Key: package id
// Value: package name
const packages = {
  am1: "assembling-machine-1",
  cc: "copper-cable",
  co: "copper-ore",
  cp: "copper-plate",
  ec: "electronic-circuit",
  is: "iron-stick",
  ig: "iron-gearwheel",
  io: "iron-ore",
  ip: "iron-plate",
  w: "wood",
  wc: "wooden-chest",
};

// Tuples of [child, childVer, parent, spec]
const permutations = [
  // All 1.0.0
  ["am1", "1.0.0", "ec", "^1.0.0"],
  ["am1", "1.0.0", "ig", "^1.0.0"],
  ["am1", "1.0.0", "ip", "^1.0.0"],
  ["ig", "1.0.0", "ip", "^1.0.0"],
  ["is", "1.0.0", "ip", "^1.0.0"],
  ["ip", "1.0.0", "io", "^1.0.0"],
  ["ec", "1.0.0", "cc", "^1.0.0"],
  ["cc", "1.0.0", "cp", "^1.0.0"],
  ["cp", "1.0.0", "co", "^1.0.0"],
  ["wc", "1.0.0", "w", "^1.0.0"],

  // Omitting the `^` here for testing
  ["wc", "1.0.1", "w", "1.0.0"],

  // All 1.1.0
  ["am1", "1.1.0", "ec", "^1.1.0"],
  ["am1", "1.1.0", "ig", "^1.1.0"],
  ["am1", "1.1.0", "ip", "^1.1.0"],
  ["ig", "1.1.0", "ip", "^1.1.0"],
  ["is", "1.1.0", "ip", "^1.1.0"],
  ["ip", "1.1.0", "io", "^1.1.0"],
  ["ec", "1.1.0", "cc", "^1.1.0"],
  ["cc", "1.1.0", "cp", "^1.1.0"],
  ["cp", "1.1.0", "co", "^1.1.0"],
  ["wc", "1.1.0", "w", "^1.1.0"],

  // All 2.0.0
  ["am1", "2.0.0", "ec", "^2.0.0"],
  ["am1", "2.0.0", "ig", "^2.0.0"],
  ["am1", "2.0.0", "ip", "^2.0.0"],
  ["ig", "2.0.0", "ip", "^2.0.0"],
  ["is", "2.0.0", "ip", "^2.0.0"],
  ["ip", "2.0.0", "io", "^2.0.0"],
  ["ec", "2.0.0", "cc", "^2.0.0"],
  ["cc", "2.0.0", "cp", "^2.0.0"],
  ["cp", "2.0.0", "co", "^2.0.0"],
  ["wc", "2.0.0", "w", "^2.0.0"],

  // Special 3.x cases
  ["cc", "3.0.0", "cp", "^3.0.0"],
  ["cp", "3.0.0", "co", "^3.0.0"],

  ["cc", "3.1.0", "cp", "^3.1.0"],
  ["cp", "3.1.0", "co", "^3.0.0"],

  ["co", "3.1.0"],
];

// Maintain a list of fs operations that we defer to the end. We do this to
// make sure we're not doing anything silly and makes debugging a little
// easier.
//
// Shape:
//
// packageName
//   packageVersion: package.json content
const operations = {};

const relPath = (...p) => path.join(__dirname, "packages", ...p);

for (let tuple of permutations) {
  // Special case for a package with no deps
  if (tuple.length === 2) {
    const [id, version] = tuple;

    const name = packages[id];

    assert(name);

    set(operations, [name, version, "name"], `${scope}/${name}`);
    set(operations, [name, version, "version"], version);

    continue;
  }

  const [child, childVer, parent, spec] = tuple;

  const childName = packages[child];
  const parentName = packages[parent];

  // Make sure we didn't typo something
  assert(childName);
  assert(parentName);

  // Parent mutations
  const parentVer = semver.minVersion(spec).version;
  set(operations, [parentName, parentVer, "name"], `${scope}/${parentName}`);
  set(operations, [parentName, parentVer, "version"], parentVer);

  // Child mutations
  set(
    operations,
    [childName, childVer, "dependencies", `${scope}/${parentName}`],
    spec
  );
  set(operations, [childName, childVer, "name"], `${scope}/${childName}`);
  set(operations, [childName, childVer, "version"], childVer);
}

for (packageName in operations) {
  const versions = operations[packageName];

  for (version in versions) {
    const packageJson = versions[version];
    const packageDir = relPath(packageName);
    const packageVersionDir = relPath(packageName, version);

    if (!fs.existsSync(packageDir)) {
      fs.mkdirSync(packageDir);
    }

    if (!fs.existsSync(packageVersionDir)) {
      fs.mkdirSync(packageVersionDir);
    }

    fs.writeFileSync(
      relPath(packageName, version, "package.json"),
      JSON.stringify(packageJson, null, 2),
      "utf8"
    );
  }
}

console.log("done");
