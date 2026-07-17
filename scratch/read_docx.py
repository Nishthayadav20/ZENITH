import zipfile
import xml.etree.ElementTree as ET
import os

def read_docx(file_path):
    if not os.path.exists(file_path):
        return f"File not found: {file_path}"
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # XML namespace for word document elements
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Find all paragraph elements
            paragraphs = []
            for p in root.findall('.//w:p', ns):
                texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
                if texts:
                    paragraphs.append("".join(texts))
            
            return "\n\n".join(paragraphs)
    except Exception as e:
        return f"Error reading docx: {str(e)}"

docx_path = r"C:\Users\Nishtha Yadav\Desktop\KHRONIQ Privacy POLICY.docx"
text = read_docx(docx_path)
print("--- START DOCX CONTENT ---")
print(text)
print("--- END DOCX CONTENT ---")
