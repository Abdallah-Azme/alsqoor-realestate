import json
import os
import glob

endpoints = json.load(open('endpoints.txt', 'r', encoding='utf-8'))
found_endpoints = []
not_found_endpoints = []

def get_search_pattern(url):
    path = url.replace('{{url}}', '')
    if not path.startswith('/'):
        path = '/' + path
    parts = path.split('/')
    static_parts = [p for p in parts if p and not p.startswith(':')]
    if static_parts:
        return '/' + '/'.join(static_parts)
    return path

files = glob.glob('src/**/*', recursive=True)
files = [f for f in files if os.path.isfile(f) and not f.endswith('.png') and not f.endswith('.jpg')]

contents = []
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            contents.append(file.read())
    except:
        pass
all_code = '\n'.join(contents)

for ep in endpoints:
    url = ep['url']
    pattern = get_search_pattern(url)
    
    if pattern in all_code or pattern.lstrip('/') in all_code:
        found_endpoints.append(ep)
    else:
        not_found_endpoints.append(ep)

with open('unimplemented_endpoints.md', 'w', encoding='utf-8') as f:
    f.write('# Unimplemented Postman Endpoints\n\n')
    for ep in not_found_endpoints:
        f.write(f"- **{ep['name']}**: `{ep['url']}`\n")
    
    f.write('\n# Implemented Endpoints\n\n')
    for ep in found_endpoints:
        f.write(f"- **{ep['name']}**: `{ep['url']}`\n")

print(f'Found {len(found_endpoints)} implemented, {len(not_found_endpoints)} unimplemented.')
