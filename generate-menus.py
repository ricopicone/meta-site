import yaml
import os

path_base = '_includes/menus'

with open('common/versions-inherited-flat.json') as f:
    versions = yaml.safe_load(f)

def ts_tag(aversion):
    return f'<a id="mi{aversion}" data-title="{versions[aversion]["description"]}" onclick="set_v_ts(\'{aversion}\')" href=#>{aversion} <span>{versions[aversion]["description"]}</span></a>\n'

def ds_tag(aversion):
    return f'<a id="mi{aversion}" data-title="{versions[aversion]["description"]}" onclick="set_v_ds(\'{aversion}\')" href=#>{aversion} <span>{versions[aversion]["description"]}</span></a>\n'

lines_ts = []
lines_ds = []
for k in versions:
    if k.startswith('T') and not k[-1].isalpha():
        lines_ts.append(ts_tag(k))
    if k.startswith('D'):
        lines_ds.append(ds_tag(k))

with open(path_base+'/dropdown-ts.html', 'w') as f:
    f.writelines(lines_ts)

with open(path_base+'/dropdown-ds.html', 'w') as f:
    f.writelines(lines_ds)

exit(0)
