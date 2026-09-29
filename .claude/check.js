// Syntax-checks the <script> block in index.html. Used by the morning check-in
// so the check is one allow-listed command. Prints "ok" or exits 1 with the error.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('no <script> block found'); process.exit(1); }
try {
  new vm.Script(m[1], { filename: 'index.html<script>' });
  console.log('ok');
} catch (e) {
  console.error(e.stack || String(e));
  process.exit(1);
}
