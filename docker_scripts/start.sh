#!/bin/bash

export RAILS_SERVE_STATIC_FILES=true
export SECRET_KEY_BASE=852f8a1445e46cf1e3572e5658144ed363ade1523c87e81228af719c4c1a9fc3fbde458a622efaab3c43029c063778f40c07527307f8b1e8b91d71af390bde0c
export RAILS_ENV=production


if [ -f /app/db/db.sqlite3 ]
then
  rails db:migrate
else
  rails db:create db:migrate
fi

redis-server & rails s -b 0.0.0.0 -p 5000
