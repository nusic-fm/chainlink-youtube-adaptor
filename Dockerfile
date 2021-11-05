FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./
COPY package-lock.json ./
# COPY yarn.lock ./

USER node

# RUN yarn --frozen-lockfile
RUN npm ci

COPY --chown=node:node . .

CMD [ "node", "app.js" ]
