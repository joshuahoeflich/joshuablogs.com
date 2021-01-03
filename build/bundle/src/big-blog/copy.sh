#!/bin/sh
for i in $(seq 1 999); do
  NUMBER=""
  if [ "$i" -gt 99 ]; then
    NUMBER="$i"
  elif [ "$i" -gt 9 ]; then
    NUMBER="0$i"
  else
    NUMBER="00$i"
  fi
  cp "000_lorem_ipsum.md" "$NUMBER"_lorem_ipsum.md
done
