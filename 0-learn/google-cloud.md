# Google Cloud Platform

Google Cloud Platform (GCP) is Google's suite of cloud computing services. It offers infrastructure, AI/ML services, databases, networking, and developer tools for building and scaling applications. For AI-powered web applications, GCP provides access to Vertex AI, Cloud Run, Cloud SQL, Firebase, and other services.

## Key Services for Web Developers

### Compute

- **Cloud Run**: Serverless container hosting — deploy Docker containers without managing servers
- **Cloud Functions**: Event-driven serverless functions (similar to AWS Lambda)
- **App Engine**: Fully managed application platform

### AI and Machine Learning

- **Vertex AI**: Enterprise ML platform with Gemini model access
- **Cloud Vision AI**: Image analysis and OCR
- **Cloud Natural Language**: Text analysis and sentiment detection
- **Cloud Translation**: Translate text between languages

### Databases

- **Cloud SQL**: Managed PostgreSQL, MySQL, and SQL Server
- **Firestore**: NoSQL document database (Firebase backend)
- **Cloud Spanner**: Globally distributed relational database
- **BigQuery**: Serverless data warehouse for analytics

### Storage and CDN

- **Cloud Storage**: Object storage for files and media
- **Cloud CDN**: Content delivery network for low-latency access

## Getting Started

### 1. Create a Project

Visit the [Google Cloud Console](https://console.cloud.google.com) and create a new project.

### 2. Install the CLI

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
gcloud init
gcloud auth application-default login
```

### 3. Set Environment Variables

```bash
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

## Deploying a Next.js App to Cloud Run

```bash
# Build and deploy
gcloud run deploy my-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Best Practices

- Use IAM roles with least-privilege access for service accounts
- Enable billing alerts to avoid unexpected charges
- Use Secret Manager for API keys instead of environment variables
- Choose the region closest to your users for lower latency

## Resources

- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Google Cloud Free Tier](https://cloud.google.com/free)
- [Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts)
