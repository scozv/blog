cd assets

release_api_uri="https://api.github.com/repos/Khan/KaTeX/releases/latest"
key_name="browser_download_url"
temp_uri=`curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET $release_api_uri | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $key_name`
download_uri=`echo $temp_uri | sed 's/$key_name://'`

