pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('📦 Checkout Code') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('🐳 Build Docker Containers') {
            steps {
                echo 'Building frontend and backend images...'
                bat 'docker-compose build'
            }
        }

        stage('🚀 Run Application') {
            steps {
                echo 'Running the MERN stack services...'
                bat 'docker-compose up -d'
            }
        }

        stage('✅ Health Check') {
            steps {
                echo 'Checking if services are running...'
                bat 'docker ps'
            }
        }

        stage('🌐 Show Frontend URL') {
            steps {
                echo 'Access the app at: http://localhost:5000'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up containers...'
            bat 'docker-compose down'
        }
        failure {
            echo '🚨 Build or deploy failed.'
        }
        success {
            echo '✅ Application built and run successfully!'
        }
    }
}
