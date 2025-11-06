# 🚀 MessageApp: A DevOps Project

This project demonstrates a complete CI/CD (Continuous Integration/Continuous Deployment) pipeline for a simple Node.js web application. The pipeline is orchestrated by Jenkins and deploys the application as a container to Google Cloud Run.

---

## 🌟 Features

-   **Simple Node.js Web Application:** A lightweight web server built with Express.js.
-   **Containerized with Docker:** The application is containerized using Docker for portability and consistency.
-   **Automated CI/CD Pipeline:** A complete CI/CD pipeline managed by a `Jenkinsfile`.
-   **Deployment to Google Cloud Run:** The application is automatically deployed to Google Cloud Run, a serverless platform.
-   **Infrastructure as Code:** The entire pipeline is defined as code in the `Jenkinsfile`.

---

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Google Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Google Artifact Registry](https://img.shields.io/badge/Artifact_Registry-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

---

## 🏗️ Infrastructure Diagram

This diagram provides a visual representation of the project's infrastructure.

```mermaid
graph TD
    subgraph "Developer Workflow"
        A[Developer] -- "git push" --> B[GitHub Repository];
    end

    subgraph "CI/CD Pipeline"
        B -- "Webhook" --> C[Jenkins];
        C -- "Build & Push Image" --> D[Google Artifact Registry];
    end

    subgraph "Production Environment (Google Cloud)"
        D -- "Deploy New Revision" --> E[Google Cloud Run];
        E -- "Serves Application" --> F[User's Browser];
    end

    F -- "HTTPS Requests & WebSocket" --> E;
```

---

## 🔧 Local Development

To run the application on your local machine, you'll need [Node.js](https://nodejs.org/) and [Docker](https://www.docker.com/get-started) installed.

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

## 🌊 CI/CD Pipeline Flowchart

This flowchart visualizes the entire CI/CD process, from a code change to a successful deployment.

```mermaid
graph TD
    A[Start] --> B{Push to main};
    B --> C[Jenkins Polls SCM];
    C --> D[Build & Test];
    D -- Docker Container --> E[npm install];
    E --> F[Run Tests];
    F --> G{Build & Test Success?};
    G -- Yes --> H[Docker Build & Push];
    H --> I[Authenticate with GCP];
    I --> J[Build Docker Image];
    J --> K[Push to Artifact Registry];
    K --> L{Push Success?};
    L -- Yes --> M[Deploy to Cloud Run];
    M --> N[Deploy New Revision];
    N --> O[End];
    G -- No --> P[Failure];
    L -- No --> P[Failure];
    P --> O;
```

### Pipeline Stages Explained

1.  **Checkout**: Jenkins checks out the latest code from the `main` branch of the Git repository.
2.  **Build & Test**: This stage runs inside a `node:18-alpine` Docker container. It installs the Node.js dependencies and runs tests (if any are configured).
3.  **Docker Build & Push**: This stage builds a Docker image of the application and pushes it to Google Artifact Registry. It first authenticates with Google Cloud using a service account.
4.  **Deploy to Cloud Run**: This stage deploys the new Docker image to Google Cloud Run, making the updated application available to the world.

---

## 🌐 API Endpoints

The application has two main endpoints:

-   `GET /`: Serves the static HTML homepage.
-   `GET /api/message`: Returns a JSON response.
    ```json
    {
      "message": "Hello from Dockerized CI/CD pipeline!"
    }
    ```

---

## 🔮 Future Improvements

-   **Implement a proper testing framework:** Add a testing framework like Jest or Mocha to the `Build & Test` stage to run automated tests.
-   **Introduce a staging environment:** Add a staging environment to the pipeline to test the application before deploying to production.
-   **Use webhooks for build triggers:** Switch from SCM polling to GitHub webhooks for more efficient and faster build triggers.
-   **Implement secrets management:** Use a secrets management tool like HashiCorp Vault or Google Secret Manager to manage secrets more securely.

---

## ⚖️ License

This project is licensed under the MIT License - see the `LICENSE` file for details.