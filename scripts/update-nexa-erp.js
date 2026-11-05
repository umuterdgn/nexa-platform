const fs = require('fs');
const path = require('path');

const nexaErpRoot = 'C:/Users/Umut/OneDrive/Masaüstü/NEXA-ERP/NEXA-ERP/NEXA-ERP';

function replaceInFile(filePath, search, replacement) {
  const fullPath = path.resolve(nexaErpRoot, filePath);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    return false;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes(search)) {
    console.warn(`Pattern not found in ${filePath}:`, search);
    return false;
  }
  content = content.replace(search, replacement);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Successfully updated ${filePath}`);
  return true;
}

function replaceAllInFile(filePath, search, replacement) {
  const fullPath = path.resolve(nexaErpRoot, filePath);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    return false;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes(search)) {
    console.warn(`Pattern not found in ${filePath}:`, search);
    return false;
  }
  content = content.replaceAll(search, replacement);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Successfully replaced all in ${filePath}`);
  return true;
}

console.log('--- 1. Updating components/admin/Sidebar.tsx ---');
replaceInFile(
  'components/admin/Sidebar.tsx',
  '{ href: "/samples", label: "Karot & Numune QR Takip", icon: TestTube, category: "YAPI DENETİM & KONTROL" }',
  '{ href: "/admin/samples", label: "Numune & Karot Takip", icon: TestTube, category: "YAPI DENETİM & KONTROL" }'
);

console.log('--- 2. Updating app/admin/samples/page.tsx ---');
replaceAllInFile(
  'app/admin/samples/page.tsx',
  '`/samples/${sample.id}`',
  '`/admin/samples/${sample.id}`'
);
replaceAllInFile(
  'app/admin/samples/page.tsx',
  '`/samples/${selectedSampleForQr.id}`',
  '`/admin/samples/${selectedSampleForQr.id}`'
);

console.log('--- 3. Updating app/admin/samples/[id]/page.tsx ---');
replaceAllInFile(
  'app/admin/samples/[id]/page.tsx',
  'href="/samples"',
  'href="/admin/samples"'
);

console.log('--- 4. Updating other references ---');
replaceInFile(
  'app/(inspection)/dashboard/page.tsx',
  'href="/samples"',
  'href="/admin/samples"'
);

replaceInFile(
  'app/(inspection)/yibf/[id]/page.tsx',
  'href="/samples"',
  'href="/admin/samples"'
);

replaceInFile(
  'app/admin/settings/integrations/page.tsx',
  'href="/samples"',
  'href="/admin/samples"'
);

console.log('Done updating references!');
