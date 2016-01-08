FROM ruby:2.3.0

RUN apt-get update && apt-get install -y nodejs redis-server wget zip vim curl python-pip w3m lv jq software-properties-common telnet dnsutils --no-install-recommends && rm -rf /var/lib/apt/lists/*

ENV APP_HOME /app

RUN mkdir $APP_HOME /scripts
WORKDIR $APP_HOME

ADD Gemfile $APP_HOME/
ADD Gemfile.lock $APP_HOME/
RUN bundle install -j 4

ADD . $APP_HOME
RUN rails db:migrate assets:precompile
ADD docker_scripts /scripts

EXPOSE 3000 53/tcp 53/udp

CMD /scripts/start.sh
