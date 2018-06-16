Show the file with tabs, line breaks and non-printing characters
```cat -A file```
Magic pipes :) to mass delete git tags with a filter. This example will delete v3.0*
```
git tag |grep v3.0 | xargs git tag -d
```
Magic sed + awk :) prints the second line ot the output (in the example, the last release) and prepare a custom message string using columns values.
```
heroku releases -a worm-api-v3-prod |sed -n 2p |awk -F " " '{print "updated -> "$1" "$2" "$3" by "$4}'
```