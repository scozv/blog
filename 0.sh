# Building the environment for only 1st time

# Ruby for Jekyll
# alternative way https://gorails.com/setup/ubuntu/15.04
sudo apt-get install -y ruby-dev
sudo gem update
sudo gem install bundler
bundle install

# upgrade to Jekyll 3
sudo gem install jekyll
sudo gem install github-pages
sudo gem install jekyll-paginate
gem install jekyll-gist
