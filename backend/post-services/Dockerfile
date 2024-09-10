FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /post-service
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3004
RUN chown -R node /post-service
USER node
CMD ["npm", "start"]
