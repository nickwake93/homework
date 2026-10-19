#!/usr/bin/env bash
# Publishes Playwright HTML reports to the gh-pages branch, one folder per PR or branch:
#   publish-report.sh publish <key> <report-dir>   e.g. publish pr/12 ./report
#   publish-report.sh remove <key>                 e.g. remove pr/12
# The branch is rewritten as a single commit each time, so old reports never pile up in
# git history; only the reports currently published take up space.
# Needs GH_TOKEN (contents: write) and GITHUB_REPOSITORY, or PAGES_REMOTE to target another
# repo (e.g. a local bare repo when testing this script).
set -euo pipefail

action="$1"
key="$2"
remote="${PAGES_REMOTE:-https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git}"
site="$(mktemp -d)"

if git ls-remote --exit-code --heads "$remote" gh-pages >/dev/null; then
  git clone --quiet --depth 1 --branch gh-pages "$remote" "$site"
else
  git init --quiet -b gh-pages "$site"
  git -C "$site" remote add origin "$remote"
fi

rm -rf "${site:?}/${key}"
if [ "$action" = publish ]; then
  mkdir -p "$site/$key"
  cp -R "$3/." "$site/$key/"
fi

# Landing page listing every published report with its result headline.
touch "$site/.nojekyll"
{
  cat <<'HTML'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Playwright reports</title>
<style>
  body { font: 16px/1.5 system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; color: #1f2328; }
  li { margin: 0.4rem 0; }
  .status { color: #59636e; }
</style>
</head>
<body>
<h1>Playwright reports</h1>
<ul>
HTML
  for dir in "$site"/main "$site"/pr/* "$site"/branch/*; do
    [ -d "$dir" ] || continue
    rel="${dir#"$site"/}"
    case "$rel" in
      main) label="main" ;;
      pr/*) label="PR #${rel#pr/}" ;;
      *) label="branch ${rel#branch/}" ;;
    esac
    status="$(head -n 1 "$dir/summary.md" 2>/dev/null | sed 's/^## Playwright: //')"
    echo "<li><a href=\"$rel/\">$label</a> <span class=\"status\">$status</span></li>"
  done
  echo "</ul>"
  echo "</body>"
  echo "</html>"
} >"$site/index.html"

cd "$site"
git checkout --quiet --orphan publish
git add -A
git -c user.name="github-actions[bot]" \
  -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
  commit --quiet -m "${action} ${key} report"
git push --quiet --force origin publish:gh-pages
