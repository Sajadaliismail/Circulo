FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /friends-Service
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3006
RUN chown -R node /friends-Service
USER node
CMD ["npm", "start"]
