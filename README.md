# phone-blocking

This repository includes a Docker Compose configuration for running a React Native development environment.

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Usage

1. Build the Docker image:
   ```
   docker compose build
   ```
2. Start a development container (Metro bundler will expose port `8081`):
   ```
   docker compose run --service-ports app
   ```
   The project directory is mounted at `/app` inside the container.
3. Inside the container you can create or run your React Native project, for example:
   ```
   npx react-native init MyApp
   cd MyApp
   npx react-native start
   ```

## Files

- `Dockerfile` – sets up Node.js, Java, and Android SDK for React Native.
- `docker-compose.yml` – configuration for launching the development container.
- `.dockerignore` – files and folders excluded from the image build context.
