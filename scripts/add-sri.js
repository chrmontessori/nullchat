const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

for (const html of ['index.html', 'faq.html']) {
  const htmlPath = path.join(outDir, html);
  if (!fs.existsSync(htmlPath)) continue;
  let content = fs.readFileSync(htmlPath, 'utf8');

  const re = /\/_next\/static\/chunks\/[a-zA-Z0-9_.-]+/g;
  const files = [...new Set(content.match(re) || [])];

  for (const file of files) {
    const localPath = path.join(outDir, file);
    if (!fs.existsSync(localPath)) continue;
    const hash = crypto.createHash('sha384').update(fs.readFileSync(localPath)).digest('base64');
    const sri = 'sha384-' + hash;

    const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(
      new RegExp('src="' + escaped + '"', 'g'),
      'src="' + file + '" integrity="' + sri + '" crossorigin="anonymous"'
    );
    content = content.replace(
      new RegExp('href="' + escaped + '"', 'g'),
      'href="' + file + '" integrity="' + sri + '" crossorigin="anonymous"'
    );
  }

  fs.writeFileSync(htmlPath, content);
  const count = (content.match(/integrity=/g) || []).length;
  console.log(html + ': ' + count + ' integrity attributes');
}
