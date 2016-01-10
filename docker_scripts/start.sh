#!/bin/bash

redis-server &

if [ -f /app/db/development.sqlite3 ]
then
  rails db:migrate
else
  rails db:create db:migrate
fi

rails s -b 0.0.0.0 -p 3000
