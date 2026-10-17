#!/usr/bin/env bash
# Repo consistency: the README skill registry and the em-dash ban.
set -euo pipefail
cd "$(dirname "$0")/.."
fail=0

# Every skill directory has a README bullet, and every bullet has a directory.
for d in */; do
  d=${d%/}
  [ -f "$d/SKILL.md" ] || continue
  grep -q "\*\*$d\*\*" README.md || { echo "skill dir missing README bullet: $d"; fail=1; }
done

while IFS= read -r name; do
  [ -n "$name" ] || continue
  [ -f "$name/SKILL.md" ] || { echo "README bullet without skill dir: $name"; fail=1; }
done < <(grep -o '\*\*[a-z0-9-][a-z0-9-]*\*\*' README.md | tr -d '*' | sort -u)

# No em dashes or en dashes in Markdown prose.
while IFS= read -r f; do
  if grep -qP '[\x{2014}\x{2013}]' "$f"; then echo "em/en dash in: $f"; fail=1; fi
done < <(find . -name '*.md' -not -path './.git/*' -type f)

# Frontmatter must be valid YAML: the skills installer refuses a skill whose
# description carries an unquoted colon followed by a space.
fm_check() {
  if command -v python3 >/dev/null 2>&1 && python3 -c 'import yaml' >/dev/null 2>&1; then
    awk '/^---$/{c++; next} c==1' "$1" | python3 -c 'import sys, yaml; yaml.safe_load(sys.stdin.read())' >/dev/null 2>&1
  else
    ! awk '/^---$/{c++; next} c==1' "$1" | grep -qE "^[A-Za-z-]+: [^'\"].*: "
  fi
}
for f in */SKILL.md; do
  fm_check "$f" || { echo "invalid frontmatter: $f"; fail=1; }
done

exit $fail
