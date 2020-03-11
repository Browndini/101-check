FROM keymetrics/pm2:latest-jessie
COPY . /app/

WORKDIR /app/
RUN NODE_ENV=production yarn install
RUN yarn build
