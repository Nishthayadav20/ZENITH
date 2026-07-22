import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

src = Path(r"C:\Users\Nishtha Yadav\Desktop\CANCELLATION POLICY.docx")
dst = Path(r"C:\Users\Nishtha Yadav\Desktop\watch\scratch\cancellation_policy.txt")
dst.parent.mkdir(parents=True, exist_ok=True)

if not src.is_file():
    print("FILE_NOT_FOUND")
    raise SystemExit(1)

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
parts = []
with zipfile.ZipFile(src) as z:
    xml = z.read("word/document.xml")
root = ET.fromstring(xml)
for p in root.iter(W + "p"):
    texts = []
    for node in p.iter(W + "t"):
        if node.text:
            texts.append(node.text)
        if node.tail:
            texts.append(node.tail)
    parts.append("".join(texts))
text = "\n".join(parts)
dst.write_text(text, encoding="utf-8")
print(text)
