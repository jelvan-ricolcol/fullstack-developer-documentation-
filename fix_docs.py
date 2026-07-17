import os

md_files = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.md'):
            md_files.append(os.path.join(root, file))

index_path = 'INDEX.md'
with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

index_content = index_content.replace('[Ai Governance]', '[AI Governance]')
index_content = index_content.replace('[Github Cloudflare Source Of Truth]', '[GitHub Cloudflare Source Of Truth]')
index_content = index_content.replace('[Ai Agent Architecture]', '[AI Agent Architecture]')
index_content = index_content.replace('[Jelai Dashboard Architecture]', '[JelAI Dashboard Architecture]')
index_content = index_content.replace('[Ai Prompt Standards]', '[AI Prompt Standards]')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index_content)

footer = "\n\n---\n*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*\n"
for filepath in md_files:
    if os.path.basename(filepath) == 'INDEX.md':
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "*Enterprise AI-First Development Standard - [Return to Index]" not in content:
        with open(filepath, 'a', encoding='utf-8') as f:
            f.write(footer)

print("Fixes applied.")
