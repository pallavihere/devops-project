pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE_NAME = "your-dockerhub-username/messageapp"
        DOCKER_IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                git 'https://github.com/your-username/devops-project.git'
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Building the Node.js application...'
                sh 'npm install'
                echo 'Testing the application...'
                // Add test commands here if you have any
            }
        }

        stage('Docker Build & Push') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                
                echo 'Logging in to Docker Hub...'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                
                echo 'Pushing Docker image to Docker Hub...'
                sh "docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the container...'
                sh "docker stop messageapp || true"
                sh "docker rm messageapp || true"
                sh "docker run -d --name messageapp -p 3000:3000 ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
            sh 'docker logout'
        }
        success {
            echo 'Pipeline succeeded!'
            // Add email notification for success here
        }
        failure {
            echo 'Pipeline failed.'
            // Add email notification for failure here
        }
    }
}
