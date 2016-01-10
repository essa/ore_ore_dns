FROM ruby:2.3.0

RUN apt-get update && apt-get install -y nodejs redis-server wget zip vim curl python-pip w3m lv jq software-properties-common telnet dnsutils --no-install-recommends && rm -rf /var/lib/apt/lists/*

ENV APP_HOME /app

RUN mkdir -p $APP_HOME /scripts /db
WORKDIR $APP_HOME

ADD Gemfile $APP_HOME/
ADD Gemfile.lock $APP_HOME/
RUN bundle install -j 4

ADD . $APP_HOME
RUN rails assets:precompile && ln -s /db/development.sqlite3 /app/db/development.sqlite3

ADD docker_scripts /scripts

EXPOSE 3000 5300/tcp 5300/udp

CMD /scripts/start.sh
