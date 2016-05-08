# https://github.com/untra/polyglot/wiki/Github-Pages-Support
git branch -D _site
git branch _site
git checkout _site
rm -rf _site
bundle exec jekyll build
git add -f _site
git commit -m "Polyglot build on $(date +"%y%m%d%H%M")"
git push -f origin _site
git branch -D gh-pages
git push origin :gh-pages
git subtree push --prefix  _site/ origin gh-pages
git checkout master
