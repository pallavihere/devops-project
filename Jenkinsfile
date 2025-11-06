pipeline {
    agent any
    options {
        skipDefaultCheckout true
    }

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        PROJECT_ID = 'project-vaani-1234'
        REGION = 'us-central1'
        REPO_NAME = 'devops-project-repo'
        IMAGE_NAME = 'messageapp'
        IMAGE_TAG = 'latest'
        IMAGE_PATH = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}"
    }

    stages {
        stage('Build & Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    args '--entrypoint=""'
                }
            }
            environment {
                npm_config_cache = '.npm-cache'
            }
            steps {
                echo 'Checking out code...'
                checkout scm
                echo 'Building the Node.js application...'
                sh 'npm install'
                echo 'Testing the application...'
                // Add test commands here if you have any
                stash name: 'source', includes: '**'
            }
        }

        stage('Docker Build & Push') {
            agent any
            steps {
                unstash 'source'
                echo 'Authenticating with Google Artifact Registry...'
                withCredentials([string(credentialsId: 'gcp-service-account-key', variable: 'GCP_SERVICE_ACCOUNT_KEY')]) {
                    script {
                        def keyFile = 'gcp-key.json'
                        try {
                            writeFile file: keyFile, text: GCP_SERVICE_ACCOUNT_KEY
                            sh "gcloud auth activate-service-account jenkins-deployer@project-vaani-1234.iam.gserviceaccount.com --key-file=${keyFile}"
                            sh "gcloud auth configure-docker ${REGION}-docker.pkg.dev"
                        } finally {
                            sh "rm -f ${keyFile}"
                        }
                    }
                }

                echo 'Building Docker image...'
                sh "docker build -t ${IMAGE_PATH}:${IMAGE_TAG} ."
                
                echo 'Pushing Docker image to Google Artifact Registry...'
                sh "docker push ${IMAGE_PATH}:${IMAGE_TAG}"
            }
        }

        stage('Deploy to Cloud Run') {
            agent any
            steps {
                unstash 'source'
                echo 'Deploying the container to Cloud Run...'
                sh "gcloud run deploy ${IMAGE_NAME}-service --image=${IMAGE_PATH}:${IMAGE_TAG} --platform=managed --region=${REGION} --port=3000 --allow-unauthenticated --project=${PROJECT_ID}"
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