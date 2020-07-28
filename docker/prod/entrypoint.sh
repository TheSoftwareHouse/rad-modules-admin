#!/bin/sh
cd /usr/share/nginx/html/static/js
for var in $(printenv | grep 'REACT_APP'); do
   IFS='=' read -r key value <<< "$var"
   key="__${key}__"
   value=$(printf "%q" "$value")
   sed -i -e "s#${key}#${value}#g" *.js
done
nginx -g 'daemon off;'
