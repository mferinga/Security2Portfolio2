import { config } from 'dotenv';
config();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { urlencoded, json } from 'express';
import * as fs from "fs";
import * as process from "process";

async function bootstrap() {
	const globalPrefix = 'api';

	const origin = process.env.ORIGIN || 'http://localhost:4200';

	const port = process.env.PORT || 3333;

	const httpsOptions = {
		key: fs.readFileSync(process.env.PRIVATE_KEY || '../key.pem'),
		cert: fs.readFileSync(process.env.CERTIFICATE || '../cert.pem'),
	};

	const app = await NestFactory.create(AppModule, {
		httpsOptions,
	});

	app.setGlobalPrefix(globalPrefix);
	app.use(json({ limit: '10mb' }));
	app.use(urlencoded({ extended: true, limit: '10mb' }));
	app.enableCors({
		origin,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	});
	await app.listen(port);

	Logger.log(
		`🚀 ${
			process.env.PROJECT_NAME
		} API is running on: ${await app.getUrl()}`,
	);
}
bootstrap();
