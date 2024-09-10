FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /chat-service
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3008 3010
RUN chown -R node /chat-service
USER node
CMD ["npm", "start"]
