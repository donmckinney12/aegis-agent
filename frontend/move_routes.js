const fs = require('fs');
const path = require('path');

const p = 'c:\\Users\\mckin\\Desktop\\Aegis-Agent ID Zero-Trust Identity for AI Agents\\frontend\\src\\app';
fs.mkdirSync(path.join(p, '(app)', 'dashboard'), { recursive: true });
fs.mkdirSync(path.join(p, '(marketing)'), { recursive: true });

const folders = ['agents', 'analytics', 'access', 'api-keys', 'audit', 'billing', 'compliance', 'infrastructure', 'integrations', 'policies', 'settings', 'threats', 'trust-graph'];

for (const f of folders) {
    if (fs.existsSync(path.join(p, f))) {
        fs.renameSync(path.join(p, f), path.join(p, '(app)', f));
    }
}
if (fs.existsSync(path.join(p, 'page.tsx'))) {
    fs.renameSync(path.join(p, 'page.tsx'), path.join(p, '(app)', 'dashboard', 'page.tsx'));
}
