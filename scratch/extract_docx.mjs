import fs from 'fs';
import { execSync } from 'child_process';

const docxPath = String.raw`C:\Users\Nishtha Yadav\Desktop\CANCELLATION POLICY.docx`;
const outPath = new URL('./cancellation_policy.txt', import.meta.url);

if (!fs.existsSync(docxPath)) {
  fs.writeFileSync(outPath, 'NOT FOUND: ' + docxPath);
  process.exit(1);
}

const script = `
import zipfile, xml.etree.ElementTree as ET
with zipfile.ZipFile(r"${docxPath.replace(/\\/g, '\\\\')}") as z:
    root = ET.fromstring(z.read('word/document.xml'))
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
paras = []
for p in root.findall('.//w:p', ns):
    texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
    if texts:
        paras.append(''.join(texts))
print('\\n'.join(paras))
`;

try {
  const text = execSync(`python -c "${script.replace(/"/g, '\\"').replace(/\n/g, '; ')}"`, { encoding: 'utf8' });
  fs.writeFileSync(outPath, text);
  console.log(text);
} catch (e) {
  fs.writeFileSync(outPath, 'ERROR: ' + (e.stderr || e.message));
  process.exit(1);
}
