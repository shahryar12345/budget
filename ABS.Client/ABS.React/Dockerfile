FROM node:10 as build-ui

# Change directory so that our commands run inside this new dir
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# Install dependecies
RUN yarn

# Get all the code needed to run the app
COPY . .

# Create production build and then
RUN yarn build

# => Run container
FROM nginx:1.15.2-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d

COPY --from=build-ui /usr/src/app/build/ /usr/share/nginx/html
COPY conf /etc/nginx

# Default port exposure
EXPOSE 80

# Initialize environment variables into filesystem
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Run script which initializes env vars to fs
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]