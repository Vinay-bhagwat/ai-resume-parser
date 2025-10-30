import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ResumeParserModule } from './resume-parser/resume-parser.module';

// Validate required environment variables
const requiredEnvVars = ['KAFKA_BROKER_URL', 'KAFKA_CLIENT_ID', 'KAFKA_CONSUMER_GROUP_ID'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

@Module({
  imports: [
    ResumeParserModule,
    ClientsModule.register([
      {
        name: 'RESUME_PARSER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID!,
            brokers: [process.env.KAFKA_BROKER_URL!],
          },
          consumer: {
            groupId: process.env.KAFKA_CONSUMER_GROUP_ID!,
          },
        },
      },
    ]),
  ],
})
export class AppModule {}
