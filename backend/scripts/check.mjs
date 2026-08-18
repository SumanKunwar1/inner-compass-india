/**
 * Build-time validation for the backend.
 *
 * This project is plain Node ESM — there is nothing to compile or bundle, so a
 * "build" here means proving the code is deployable: every source file parses,
 * and every relative import actually resolves on disk. Catching a typo'd import
 * here beats discovering it when the server crashes on boot in production.
 */

import { execFile } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");

/** Every .js file under src/, recursively. */
async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(full)));
    else if (extname(entry.name) === ".js") files.push(full);
  }
  return files;
}

/** Syntax-checks one file without executing it. */
async function checkSyntax(file) {
  try {
    await run(process.execPath, ["--check", file]);
    return null;
  } catch (err) {
    return String(err.stderr || err.message).trim();
  }
}

/**
 * Confirms each relative import points at a file that exists. Node resolves ESM
 * specifiers strictly, so a missing extension or a wrong path is a hard failure
 * at startup rather than something the runtime papers over.
 */
async function checkImports(file) {
  const source = await readFile(file, "utf8");
  const problems = [];
  const pattern = /(?:^|\n)\s*(?:import|export)[^'"\n]*from\s*['"](\.[^'"]+)['"]/g;

  for (const match of source.matchAll(pattern)) {
    const specifier = match[1];
    const target = resolve(dirname(file), specifier);
    if (!existsSync(target)) problems.push(`cannot resolve import "${specifier}"`);
  }
  return problems;
}

const files = await collect(srcDir);
let failed = 0;

for (const file of files) {
  const rel = file.slice(root.length + 1).replace(/\\/g, "/");
  const syntax = await checkSyntax(file);
  const imports = syntax ? [] : await checkImports(file);

  if (syntax) {
    failed++;
    console.error(`✖ ${rel}\n${syntax}\n`);
  } else if (imports.length) {
    failed++;
    console.error(`✖ ${rel}`);
    for (const p of imports) console.error(`    ${p}`);
    console.error("");
  }
}

if (failed) {
  console.error(`✖ Build failed — ${failed} of ${files.length} file(s) have problems.`);
  process.exit(1);
}

console.log(`✔ Checked ${files.length} source files — syntax and imports OK.`);
console.log("  Nothing to compile: this backend runs directly on Node. Use `npm start` to serve it.");
