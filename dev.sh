# To set up development environment:
#   npm install -g browserify watchify
#   chmod +x dev.sh
#   ./dev.sh
#
# Assumes:
#   Source files live in:   /src
#   Entry point is:         /src/startup.js
watchify src/startup.js -o bundle.js --verbose --debug