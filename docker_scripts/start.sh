#!/bin/bash

redis-server &

rails db:migrate
rails s -b 0.0.0.0 -p 3000
