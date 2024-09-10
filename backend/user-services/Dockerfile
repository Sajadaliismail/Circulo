FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /user-service
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /user-service
USER node
CMD ["npm", "start"]
