# https://github.com/untra/polyglot/wiki/Github-Pages-Support
git stash save
GIT_PWD=`git rev-parse --abbrev-ref HEAD`

git branch -D _site
git branch _site
git checkout _site
rm -rf _site
bundle exec jekyll build
git add -f _site
git commit -m "gh-pages compiled on $(date +"%y%m%d%H%M")"
git push -f origin _site
# git branch -D gh-pages
# git push origin :gh-pages
git push origin `git subtree split --prefix _site _site`:gh-pages --force
# git subtree push --prefix  _site/ origin gh-pages
# git push origin :_site

git checkout -f $GIT_PWD
git stash pop
