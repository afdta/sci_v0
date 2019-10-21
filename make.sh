#!/usr/bin/env bash

#roll it up -- node
rollup -c ./build/rollup.config.js -o ./build/tmp.js

#concatenate d3 and topojson to js
cat /home/alec/.local/lib/node/lib/node_modules/d3/dist/d3.min.js > app-es6.js
echo "" >> app-es6.js

cat /home/alec/.local/lib/node/lib/node_modules/topojson/dist/topojson.min.js >> app-es6.js 

echo "" >> app-es6.js
echo "" >> app-es6.js
echo "// Vega JS (vega-core)" >> app-es6.js
echo "// Copyright (c) 2015-2018, University of Washington Interactive Data Lab" >> app-es6.js
echo "// All rights reserved." >> app-es6.js
cat /home/alec/.local/lib/node/lib/node_modules/vega/build/vega-core.min.js >> app-es6.js
echo "" >> app-es6.js

cat ./build/tmp.js >> app-es6.js


###make es5 version

#concatenate d3 and topojson to js

#roll it up
rollup -c ./build/rollup.config.es5.js -o ./build/tmp-es5.js

cat /home/alec/.local/lib/node/lib/node_modules/d3/dist/d3.min.js > app-es5.js
echo "" >> app-es5.js

cat ./build/tmp-es5.js >> app-es5.js


#remove unnecessary files
rm ./build/tmp.js ./build/tmp-es5.js

#move scripts to assets directory
mv app-es6.js assets/js/
mv app-es5.js assets/js/