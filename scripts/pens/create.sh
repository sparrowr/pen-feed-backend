#!/bin/bash

API="http://localhost:4741"
URL_PATH="/pens"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "pen": {
      "name": "'"${NAME}"'",
      "isInked": true,
      "isClean": false,
      "inkedYear": 2018,
      "inkedMonth": 3,
      "inkedDay": 11,
      "inkName": "curl test ink",
      "inkType": "standard"
    }
  }'

echo
