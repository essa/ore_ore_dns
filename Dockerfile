FROM ruby:2.3.0

RUN apt-get update && apt-get install -y nodejs redis-server wget zip vim curl python-pip w3m lv jq software-properties-common telnet dnsutils sqlite3 npm --no-install-recommends && rm -rf /var/lib/apt/lists/*

ENV APP_HOME /app
ENV RAILS_ENV production

RUN mkdir -p $APP_HOME /scripts /db $APP_HOME/client
WORKDIR $APP_HOME

# Install gems
ADD Gemfile $APP_HOME/
ADD Gemfile.lock $APP_HOME/
RUN bundle install -j 4

# Install npm packages
ADD package.json $APP_HOME/
ADD client/package.json $APP_HOME/client
RUN ln -s /usr/bin/nodejs /usr/bin/node && npm install && cd $APP_HOME/client && npm install

# Install app and generate assets
ADD . $APP_HOME
RUN rails assets:precompile && ln -s /db/development.sqlite3 /app/db/development.sqlite3 && ln -s /db/production.sqlite3 /app/db/production.sqlite3

ADD docker_scripts /scripts

EXPOSE 3000 5300/tcp 5300/udp

CMD /scripts/start.sh
