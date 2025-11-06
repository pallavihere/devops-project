# MessageApp

A simple Node.js web application designed to be deployed with a CI/CD pipeline using Jenkins, Docker, Podman, and Google Cloud Run.

---

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/get-started)

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pallavihere/devops-project.git
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

This project includes a `Jenkinsfile` to demonstrate a complete CI/CD pipeline for automated building, testing, and deployment to Google Cloud Run.

### Pipeline Stages

1.  **Checkout**: Clones the source code from the Git repository.
2.  **Build & Test**: Installs Node.js dependencies and runs tests (if any are configured) inside a Docker container.
3.  **Podman Build & Push**: Builds a Podman image of the application and pushes it to Google Artifact Registry.
4.  **Deploy to Cloud Run**: Deploys the container image to Google Cloud Run.

The pipeline is configured to automatically trigger a new build when changes are pushed to the `main` branch.

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

This project is licensed under the MIT License - see the `LICENSE` file for details.
