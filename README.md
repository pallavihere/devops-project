# MessageApp

A simple Node.js web application designed to be deployed with a CI/CD pipeline using Docker and Jenkins.

---

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/get-started)

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/devops-project.git
    cd devops-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm start
    ```

The application will be available at `http://localhost:3000`.

---

## 🐳 Running with Docker

You can also build and run the application using Docker.

1.  **Build the Docker image:**
    ```bash
    docker build -t messageapp .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -p 3000:3000 -d --name messageapp messageapp
    ```

The application will be available at `http://localhost:3000`.

---

## ⚙️ CI/CD Pipeline

This project includes a `Jenkinsfile` to demonstrate a complete CI/CD pipeline for automated building, testing, and deployment.

### Pipeline Stages

1.  **Checkout**: Clones the source code from the Git repository.
2.  **Build & Test**: Installs Node.js dependencies and runs tests (if any are configured).
3.  **Docker Build & Push**: Builds a Docker image of the application and pushes it to a container registry (e.g., Docker Hub).
4.  **Deploy**: Stops any existing container and runs a new one with the latest image.

To use the pipeline, you need a Jenkins server with the Docker Pipeline plugin installed and configured with credentials for your container registry.

---

## 📜 API

The application has two main endpoints:

-   `GET /`: Serves the static HTML homepage.
-   `GET /api/message`: Returns a JSON response.
    ```json
    {
      "message": "Hello from Dockerized CI/CD pipeline!"
    }
    ```

---

## ⚖️ License

This project is licensed under the ISC License - see the `LICENSE` file for details.