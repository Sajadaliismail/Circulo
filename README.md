# Círculo

Círculo is a sophisticated social media application built on the MERN stack, designed to facilitate user interactions and enhance connectivity. It features real-time notifications, video calling, and efficient friend management, making it a powerful platform for social networking.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Features

- **Real-time Notifications**: Integrated with Socket.IO, Círculo keeps users engaged by providing immediate updates and notifications.
- **Video Calling**: Implemented using WebRTC, users can communicate seamlessly through high-quality video calls.
- **Friend Management**: Utilizes Neo4j to efficiently manage social connections, allowing users to send friend requests and organize their friend lists.
- **Microservices Architecture**: The backend is designed with a microservices architecture, consisting of four services:
  - **Auth Service**: Handles user authentication and authorization.
  - **Chat Service**: Manages real-time messaging between users.
  - **Post Service**: Facilitates post creation, retrieval, and interaction.
  - **Friends Service**: Manages friend requests and connections.
- **Inter-service Messaging**: RabbitMQ manages reliable communication between various services within the application.
- **Containerization**: Docker is used to ensure consistent environments across development and production, making deployment easier.
- **CI/CD Pipeline**: A Git-based CI/CD pipeline is established for continuous integration and delivery, ensuring that the application stays up-to-date with minimal disruption.

## Technologies Used

- **Frontend**:
  - React.js
  - Redux
  - Material-UI
  - Tailwind CSS
- **Backend**:
  - Node.js
  - Express.js
- **Database**:
  - MongoDB
  - Neo4j
- **Real-time Communication**:
  - Socket.IO
  - WebRTC
- **Messaging**:
  - RabbitMQ
- **Containerization**:
  - Docker
- **CI/CD**:
  - GitHub Actions

## Installation

To run Círculo locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Sajadaliismail/Circulo.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Circulo
   ```

3. **Install dependencies for both frontend and backend:**

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

4. **Set up your database:**

   - Make sure you have MongoDB and Neo4j installed and running on your local machine.
   - Create the necessary databases and collections for the application.

5. **Run the application:**
   Make sure to set up the appropriate environment variables for your database connection and any other necessary configurations.

   ```bash
   # Start all backend services
   cd backend/auth-service
   npm start

   cd ../chat-service
   npm start

   cd ../post-service
   npm start

   cd ../friends-service
   npm start

   # In a new terminal, start frontend server
   cd ../../frontend
   npm start
   ```

## Docker

Círculo utilizes Docker for containerization, ensuring that the application runs consistently across different environments. To run Círculo using Docker, follow these steps:

1. **Install Docker** on your machine if you haven't already.

2. **Navigate to the project directory:**

   ```bash
   cd Circulo
   ```

3. **Build the Docker images:**

   ```bash
   docker-compose build
   ```

4. **Run the Docker containers:**

   ```bash
   docker-compose up
   ```

5. The application will be accessible at `http://localhost:3000`.

## Usage

Once the application is running, navigate to `http://localhost:3000` in your web browser. You can:

- **Create an account** and log in.
- **Manage friends** by sending and accepting friend requests.
- **Send messages** to friends and engage in video calls.
- **Receive real-time notifications** about friend activities and messages.

## Deployment

Círculo can be deployed using various cloud services like Heroku, Vercel, or AWS. Here are the general steps for deployment:

1. Set up an account with your chosen cloud provider.
2. Configure your environment variables in the cloud environment.
3. Push your code to the cloud service, following their specific deployment instructions.
4. Ensure that all services (MongoDB, Neo4j, RabbitMQ) are accessible from the cloud environment.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request. To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-YourFeatureName`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-YourFeatureName`.
5. Open a pull request.

## Acknowledgments

Special thanks to all the contributors and open-source libraries that made this project possible.
Inspired by the need for better social connectivity through technology.
