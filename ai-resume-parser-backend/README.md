# AI Resume Parser Backend Service

This service provides AI-powered resume parsing capabilities using OpenAI or Google's Gemini models.

## Quick Start with Docker

### Prerequisites
- Docker installed on your system
- OpenAI API key and/or Google API key

### Running the Container

1. Pull and run the container:
```bash
docker run -d 
  -p 3000:3000 
  -e OPENAI_API_KEY=your_openai_api_key 
  -e GOOGLE_API_KEY=your_google_api_key 
  -e DEFAULT_AI_PROVIDER=openai 
  --name resume-parser 
  your-registry/ai-resume-parser-backend:latest
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| OPENAI_API_KEY | Your OpenAI API key | Yes (if using OpenAI) | - |
| GOOGLE_API_KEY | Your Google API key | Yes (if using Gemini) | - |
| DEFAULT_AI_PROVIDER | AI provider to use (openai/gemini) | No | openai |
| PORT | Port to run the service on | No | 3000 |
| NODE_ENV | Node environment | No | production |

### API Endpoints

#### Parse Resume
- **POST** `/api/resume-parser/parse`
- **Content-Type**: application/json
- **Request Body**:
```json
{
  "content": "Resume text content here...",
  "provider": "openai" // or "gemini", optional
}
```

#### Health Check
- **GET** `/health`
- Returns 200 OK if service is healthy

### Building the Image Locally

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-resume-parser/ai-resume-parser-backend
```

2. Build the Docker image:
```bash
docker build -t ai-resume-parser-backend .
```

3. Run the container:
```bash
docker run -d 
  -p 3000:3000 
  -e OPENAI_API_KEY=your_openai_api_key 
  -e GOOGLE_API_KEY=your_google_api_key 
  --name resume-parser 
  ai-resume-parser-backend
```

### Security Features
- Runs as non-root user
- Uses multi-stage build for smaller image size
- Contains health check endpoint
- Production-only dependencies in final image

### Monitoring
The service includes a health check endpoint that can be used with container orchestration platforms.

### Troubleshooting
1. Check logs:
```bash
docker logs resume-parser
```

2. Check health status:
```bash
docker inspect resume-parser | grep Health
```

3. Access the container:
```bash
docker exec -it resume-parser sh
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
