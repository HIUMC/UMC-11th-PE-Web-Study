import json
import subprocess
import urllib.request


def queries():
    log = subprocess.check_output(['docker', 'compose', 'logs', '--no-color', '--no-log-prefix', 'app'], text=True)
    return [json.loads(line) for line in log.splitlines() if line.startswith('{"event":"ORM_QUERY"')]

before = queries()
with urllib.request.urlopen('http://127.0.0.1:3000/books') as response:
    rows = json.load(response)
    status = response.status
new = queries()[len(before):]
print(json.dumps({'status': status, 'bookCount': len(rows), 'queryCount': len(new), 'queries': new}, ensure_ascii=False))
assert len(new) == 1, 'Unexpected concurrent healthcheck or extra query; inspect SQL and repeat in a quiet window'
assert 'LEFT JOIN' in new[0]['sql']
