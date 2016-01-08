#!/bin/bash

redis-server &

rails s -b 0.0.0.0 -p 3000
