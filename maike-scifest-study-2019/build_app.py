import os

js_path = os.path.abspath('./app/build/static/js/')

files = os.listdir(js_path)
files = sorted([e for e in files if not e.endswith('.map')])

content = ""

for file in files:
    with open(os.path.abspath('./app/build/static/js/{}'.format(file)), 'r') as f:
        content += f.read()
        content += '\n'

with open(os.path.abspath('./server/js/final.js'), 'w') as f:
    f.write(content)

css_path = os.path.abspath('./app/build/static/css/')

files = os.listdir(css_path)
files = sorted([e for e in files if not e.endswith('.map')])

content = ""

for file in files:
    with open(os.path.abspath('./app/build/static/css/{}'.format(file)), 'r') as f:
        content += f.read()
        content += '\n'

with open(os.path.abspath('./server/css/final.css'), 'w') as f:
    f.write(content)
