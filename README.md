# Containerized Web Application Deployment Pipeline Using Docker and Jenkins

## 🧩 1. Overview and Objectives

This project demonstrates how to build a complete CI/CD (Continuous Integration/Continuous Deployment) pipeline to automate the deployment of a web application. We will use Jenkins for automation, Docker for containerization, and GitHub for version control.

### What is a CI/CD Pipeline?

A **CI/CD pipeline** is an automated workflow that developers use to reliably build, test, and deploy their code.
- **Continuous Integration (CI)** is the practice of frequently merging all developer working copies to a shared mainline. Each integration is then verified by an automated build and automated tests.
- **Continuous Deployment (CD)** is the practice of automatically deploying every change that passes the CI stage to a production or staging environment.

### Why Use Docker and Jenkins Together?

- **Jenkins** is an open-source automation server that excels at orchestrating complex workflows. It acts as the "brain" of our pipeline, triggering builds, running tests, and managing deployments.
- **Docker** is a platform for developing, shipping, and running applications in containers. It packages an application and its dependencies into a standardized unit, ensuring it runs consistently across different environments.

By combining them, we create a powerful, automated, and consistent deployment process. Jenkins orchestrates the pipeline, and Docker ensures the application runs identically everywhere.

### Project Summary

This project automates the following workflow:
1. A developer pushes code to a GitHub repository.
2. A GitHub webhook triggers a Jenkins pipeline.
3. Jenkins checks out the code, installs dependencies, and runs tests.
4. Jenkins builds a Docker image of the application.
5. Jenkins pushes the image to Docker Hub (a container registry).
6. Jenkins deploys the application by running the Docker container.

---

## 🖥️ 2. Application Details

We will use a simple "MessageApp" built with Node.js and Express.

- **Language & Framework**: Node.js + Express.js
- **Routes**:
  - `/`: Returns a simple HTML homepage.
  - `/api/message`: Returns a JSON object: `{ "message": "Hello from Dockerized CI/CD pipeline!" }`.

### Code

**`server.js`**
```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the API endpoint
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Dockerized CI/CD pipeline!' });
});

app.listen(port, () => {
  console.log(`MessageApp listening at http://localhost:${port}`);
});
```

**`package.json`**
```json
{
  "name": "messageapp",
  "version": "1.0.0",
  "description": "A simple Node.js web application for the DevOps project.",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "nodejs",
    "express",
    "docker",
    "jenkins"
  ],
  "author": "Gemini",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**`Dockerfile`**
```dockerfile
# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "server.js" ]
```

---

## ⚙️ 3. Project Architecture

The diagram below illustrates the workflow between GitHub, Jenkins, and Docker.

```
+-----------------+      +----------------+      +------------------+
|   Developer     |----->|     GitHub     |----->|     Jenkins      |
+-----------------+      +----------------+      +------------------+
      | Code Push          | Webhook Trigger     |   CI/CD Pipeline   |
                                                 +------------------+
                                                       |
             +-----------------------------------------+-----------------------------------------+
             |                                         |                                         |
      +------v------+      +-----------------------+      +---------------------+      +----------v----------+
      |  Build & Test |----->|   Docker Build Image  |----->|  Push to Docker Hub |----->|  Deploy Container   |
      +-------------+      +-----------------------+      +---------------------+      +---------------------+
```

---

## 🧱 4. Tools & Technologies

- **CI/CD Automation**: Jenkins
- **Containerization**: Docker
- **Source Code Management**: GitHub
- **Image Registry**: Docker Hub
- **Host System**: Ubuntu or Fedora

---

## 🧰 5. Step-by-Step Setup Guide

### Prerequisites Installation

1.  **Install Git**:
    ```bash
    sudo apt update
    sudo apt install git -y
    ```

2.  **Install Docker**:
    ```bash
    sudo apt install docker.io -y
    sudo usermod -aG docker $USER
    newgrp docker
    ```

3.  **Install Jenkins**:
    ```bash
    sudo apt install openjdk-11-jre -y
    curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee \
      /usr/share/keyrings/jenkins-keyring.asc > /dev/null
    echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
      https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
      /etc/apt/sources.list.d/jenkins.list > /dev/null
    sudo apt-get update
    sudo apt-get install jenkins -y
    sudo systemctl start jenkins
    ```
    - Retrieve the initial admin password:
      ```bash
      sudo cat /var/lib/jenkins/secrets/initialAdminPassword
      ```

### Jenkins Configuration

1.  **Unlock Jenkins**: Open `http://<your_server_ip>:8080` and paste the admin password.
2.  **Install Plugins**: Select "Install suggested plugins".
3.  **Create Admin User**: Create your admin user account.
4.  **Add Docker to Jenkins Group**: Allow Jenkins to run Docker commands.
    ```bash
    sudo usermod -aG docker jenkins
    sudo systemctl restart jenkins
    ```
5.  **Install Docker Pipeline Plugin**: Go to `Manage Jenkins` > `Manage Plugins` > `Available` and install `Docker Pipeline`.
6.  **Configure Docker Hub Credentials**:
    - Go to `Manage Jenkins` > `Manage Credentials` > `(global)`.
    - Click `Add Credentials`.
    - **Kind**: `Username with password`.
    - **Username**: Your Docker Hub username.
    - **Password**: Your Docker Hub password.
    - **ID**: `dockerhub-credentials`.

### Connect Jenkins to GitHub

1.  **Create a GitHub Repository**: Create a new repository on GitHub and push the project files to it.
2.  **Create a Webhook**:
    - In your GitHub repo, go to `Settings` > `Webhooks` > `Add webhook`.
    - **Payload URL**: `http://<your_jenkins_server_ip>:8080/github-webhook/`
    - **Content type**: `application/json`.
    - **Secret**: Leave blank.
    - **Events**: Just the `push` event.
    - Click `Add webhook`.

### Create Jenkins Pipeline

1.  On the Jenkins dashboard, click `New Item`.
2.  Enter an item name (e.g., "devops-project") and select `Pipeline`.
3.  In the pipeline configuration, go to the `Pipeline` section.
4.  **Definition**: `Pipeline script from SCM`.
5.  **SCM**: `Git`.
6.  **Repository URL**: Your GitHub repository URL (e.g., `https://github.com/your-username/devops-project.git`).
7.  **Branch Specifier**: `*/main`.
8.  **Script Path**: `Jenkinsfile`.
9.  Click `Save`.

### Jenkinsfile Explained

```groovy
pipeline {
    agent any // Run on any available agent

    environment {
        // Use the credentials ID you created in Jenkins
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') 
        // Replace with your Docker Hub username
        DOCKER_IMAGE_NAME = "your-dockerhub-username/messageapp"
        DOCKER_IMAGE_TAG = "latest"
    }

    stages {
        // Stage 1: Checkout code from GitHub
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                // This step is automatically handled by the SCM configuration
                git 'https://github.com/your-username/devops-project.git'
            }
        }

        // Stage 2: Build the Node.js application
        stage('Build & Test') {
            steps {
                echo 'Building the Node.js application...'
                // Install dependencies
                sh 'npm install' 
                echo 'Testing the application...'
                // Placeholder for test commands
            }
        }

        // Stage 3: Build and push the Docker image
        stage('Docker Build & Push') {
            steps {
                echo 'Building Docker image...'
                // Build the image and tag it
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                
                echo 'Logging in to Docker Hub...'
                // Log in using the stored credentials
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                
                echo 'Pushing Docker image to Docker Hub...'
                sh "docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            }
        }

        // Stage 4: Deploy the container
        stage('Deploy') {
            steps {
                echo 'Deploying the container...'
                // Stop and remove any existing container with the same name
                sh "docker stop messageapp || true"
                sh "docker rm messageapp || true"
                // Run the new container
                sh "docker run -d --name messageapp -p 3000:3000 ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            }
        }
    }

    post {
        // Always run this block, regardless of pipeline status
        always {
            echo 'Pipeline finished.'
            // Log out of Docker Hub
            sh 'docker logout'
        }
        // Run this block only on success
        success {
            echo 'Pipeline succeeded!'
            // (Bonus) Add email notification for success here
        }
        // Run this block only on failure
        failure {
            echo 'Pipeline failed.'
            // (Bonus) Add email notification for failure here
        }
    }
}
```

### Verify Deployment

1.  Push a change to your GitHub repository to trigger the pipeline.
2.  Watch the pipeline run in the Jenkins dashboard.
3.  Once the pipeline is successful, verify the container is running:
    ```bash
    docker ps
    ```
4.  Visit the application in your browser at `http://<your_server_ip>:3000`. You should see the "Welcome to MessageApp!" page.

---

## 🧩 6. Directory Structure

```
/home/datta/Documents/devops-project/
├── Dockerfile
├── Jenkinsfile
├── server.js
├── package.json
├── index.html
└── README.md
```

---

## 📜 7. Documentation

This section provides a complete reference for the project.

### Purpose

The purpose of this project is to provide a hands-on, step-by-step guide to building a CI/CD pipeline. It is designed for beginners to understand the fundamentals of DevOps automation by integrating popular tools like Jenkins, Docker, and GitHub.

### Troubleshooting

- **Jenkins Not Starting**:
  - Check Jenkins status: `sudo systemctl status jenkins`.
  - Check Java version: `java -version`. Jenkins requires a compatible JDK.
- **Docker Permission Denied**:
  - This usually means the `jenkins` user is not in the `docker` group.
  - Run `sudo usermod -aG docker jenkins` and `sudo systemctl restart jenkins`.
- **Pipeline Fails at Docker Push**:
  - Verify your Docker Hub credentials ID in the `Jenkinsfile` matches the one created in Jenkins.
  - Ensure your Docker Hub username in the `Jenkinsfile` is correct.
- **Webhook Not Triggering**:
  - Check the Jenkins and GitHub webhook logs for errors.
  - Ensure your Jenkins server is accessible from the internet or that you are using a tool like `ngrok` for local testing.

---

## 🚀 8. Final Output

### Jenkins Pipeline View
*(Placeholder for a screenshot of the Jenkins Blue Ocean pipeline view showing all stages passed)*

### Docker Container Running
```bash
$ docker ps
CONTAINER ID   IMAGE                                  COMMAND                  CREATED          STATUS          PORTS                    NAMES
a1b2c3d4e5f6   your-dockerhub-username/messageapp:latest   "docker-entrypoint.s…"   1 minute ago     Up 1 minute     0.0.0.0:3000->3000/tcp   messageapp
```

### Browser Output
*(Placeholder for a screenshot of the browser showing the `http://localhost:3000` page)*

---

## 🏁 9. Bonus (Optional)

- **Add Automated Testing**:
  - Install a testing framework like Jest: `npm install --save-dev jest`.
  - Create a test file `server.test.js`.
  - Add a `test` script to `package.json`: `"test": "jest"`.
  - Modify the 'Build & Test' stage in `Jenkinsfile` to run `sh 'npm test'`.
- **Configure Email Notifications**:
  - In Jenkins, go to `Manage Jenkins` > `Configure System`.
  - Configure the `E-mail Notification` section with your SMTP server details.
  - Add an `emailext` step in the `post` section of your `Jenkinsfile`.
- **Deploy to AWS EC2**:
  - The current guide assumes deployment on the same machine as Jenkins. To deploy to a separate EC2 instance, you would:
    1.  Set up Docker on the EC2 instance.
    2.  Configure SSH access from the Jenkins server to the EC2 instance.
    3.  Use the `sshagent` plugin in Jenkins to run the `docker run` command on the remote EC2 instance.

```# devops-project
