FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache chromium font-noto font-liberation tini

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

COPY . .
RUN yarn build

ENV NODE_ENV=production
EXPOSE 3000

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/src/index.js"]
