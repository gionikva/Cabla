#!/bin/fish
cd ./frontend-vue
npm run build
cd ../backend-firebase
firebase deploy --only hosting
