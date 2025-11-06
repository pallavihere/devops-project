pipeline {
    agent any

    environment {
        PROJECT_ID = 'project-vaani-1234'
        REGION = 'us-central1'
        REPO_NAME = 'devops-project-repo'
        IMAGE_NAME = 'messageapp'
        IMAGE_TAG = 'latest'
        IMAGE_PATH = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Building the Node.js application...'
                sh 'apt-get update && apt-get install -y nodejs npm'
                sh 'npm install'
                echo 'Testing the application...'
                // Add test commands here if you have any
            }
        }

        stage('Podman Build & Push') {
            steps {
                echo 'Authenticating with Google Artifact Registry...'
                sh 'gcloud auth print-access-token | podman login -u oauth2accesstoken --password-stdin ${REGION}-docker.pkg.dev'

                echo 'Building Podman image...'
                sh "podman build -t ${IMAGE_PATH}:${IMAGE_TAG} ."
                
                echo 'Pushing Podman image to Google Artifact Registry...'
                sh "podman push ${IMAGE_PATH}:${IMAGE_TAG}"
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                echo 'Deploying the container to Cloud Run...'
                sh "gcloud run deploy ${IMAGE_NAME}-service --image=${IMAGE_PATH}:${IMAGE_TAG} --platform=managed --region=${REGION} --allow-unauthenticated --project=${PROJECT_ID}"
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}