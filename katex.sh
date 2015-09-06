# cd assets

# https://gist.github.com/cjus/1047794
function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop`
    echo ${temp##*|}
}

release_api_uri="https://api.github.com/repos/Khan/KaTeX/releases/latest"
key_name="browser_download_url"
json=`curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET $release_api_uri`

download_uri=`jsonval | sed 's/$key_name://' | sed 's/zip]$/zip/g'`

wget -N -P assets/ $download_uri

# http://superuser.com/a/100659
unzip -d assets/ -o assets/katex.zip