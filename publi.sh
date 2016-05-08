
# https://github.com/untra/polyglot/wiki/Github-Pages-Support
git branch _site
git rebase master
git checkout _site
rm -rf _site
bundle exec jekyll build
git add --all
git commit -m "Polyglot build on $(date +"%y%m%d%H%M")"
git push origin _site
git subtree push --prefix  _site/ origin gh-pages
