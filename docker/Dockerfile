#DOCKERFILE for installing Ubuntu Xenial with the codescalers dashboard 
#check this out https://github.com/waleedhammam/dashboard-codescalers
FROM ubuntu:xenial
MAINTAINER Mohammed Ashour, Waleed Hammam

# updating our repos
RUN echo 'updating repos'
RUN apt-get update

#installing pip3
RUN echo 'installing pip3'
RUN apt-get -y install python3-pip

#installing git 
RUN echo 'installing GIT'
RUN apt-get -y install git

#clonning the dashboard repo
RUN echo 'clonning the repo'
RUN git clone https://github.com/waleedhammam/dashboard-codescalers

#installing requirements
RUN echo 'installing python requirment'
RUN cd dashboard-codescalers && pip3 install -r requirments.txt
# RUN ls -l
# RUN pip3 install -r requirments.txt

RUN echo 'installing node stuff'
# RUN curl -sL https://deb.nodesource.com/setup_6.x | -E bash -
RUN apt-get install -y nodejs-legacy
RUN apt-get install build-essential
RUN apt-get -y install npm
RUN npm install -g typescript
RUN cd dashboard-codescalers/ClientApp && npm install && npm run typings install
RUN echo 'all is setup now,  you just need to update the config file with your envs config'

ADD config.json dashboard-codescalers

EXPOSE 5001

CMD cd /dashboard-codescalers/ && python3 server.py
