FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install app dependencies including ngrok
RUN npm install
RUN npm install ngrok@latest

# Bundle app source
COPY . .

EXPOSE 3000

# Set environment variable for Ngrok authtoken
ENV NGROK_AUTHTOKEN=2h76Phl8GcV7mW7WtADQUG56Q7j_6sHZZeNrRraHhP14Yi9wy

CMD [ "npm", "start" ]
