pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "harshitavyas23/food-cart:latest"
        APP_SERVER = "18.236.87.81" 
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/harshitavyas23/food-cart.git', branch: 'master'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-pass', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}
                    """
                }
            }
        }

        stage('Deploy to App Server') {
            steps {
                sshagent(['app-server-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ec2-user@${APP_SERVER} '
                            docker pull ${DOCKER_IMAGE} &&
                            docker stop food-cart || true &&
                            docker rm food-cart || true &&
                            docker run -d --name food-cart -p 80:80 ${DOCKER_IMAGE}
                        '
                    """
                }
            }
        }
    }
}
