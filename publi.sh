# https://github.com/untra/polyglot/wiki/Github-Pages-Support
git stash save
GIT_CURRENT_PWD=`git rev-parse --abbrev-ref HEAD`
BUILDING_PREFIX="_site"
GIT_BUILDING_BRANCH="_site"

echo "Clean building folder named *$BUILDING_PREFIX* and rebuild ..."
git branch -D $GIT_BUILDING_BRANCH
git branch $GIT_BUILDING_BRANCH
git checkout $GIT_BUILDING_BRANCH
rm -rf $BUILDING_PREFIX
bundle exec jekyll build
echo "Commit build to remote brance *$GIT_BUILDING_BRANCH* ..."
git add -f $BUILDING_PREFIX
git commit -m "gh-pages compiled on $(date +"%y%m%d%H%M")"
git push -f origin $GIT_BUILDING_BRANCH
echo "Publish to gh-pages with git subtree ..."
# http://clontz.org/blog/2014/05/08/git-subtree-push-for-deployment/
git push origin `git subtree split --prefix $BUILDING_PREFIX $GIT_BUILDING_BRANCH`:gh-pages --force

echo "Go back to workspace."
git checkout -f $GIT_CURRENT_PWD
git stash pop
