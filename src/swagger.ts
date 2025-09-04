import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from '@config/config.service';

export function initSwagger(app: INestApplication, config: ConfigService): void {
  const options = new DocumentBuilder()
    .setTitle('Push Notification API')
    .setDescription(`

A robust and scalable API for managing push notifications across multiple platforms and devices.

## Overview
This API enables you to send targeted push notifications to mobile devices using Firebase Cloud Messaging (FCM). It supports both direct device targeting and topic-based broadcasting, making it ideal for various notification scenarios.

## Key Features
* **Device-Specific Notifications**: Send notifications to individual devices using FCM tokens
* **Topic-Based Broadcasting**: Reach multiple devices simultaneously using topic subscriptions
* **Cross-Platform Support**: Native support for both Android and iOS platforms

## Technical Details
* **Rate Limiting**: Implemented to ensure system stability and fair usage
* **Response Format**: JSON responses with standardized error handling
* **Versioning**: API versioning support for backward compatibility

## Required Headers
| Header | Description | Example |
|--------|-------------|---------|
| Accept-Language | Preferred language for responses | en |
| X-Request-ID | Unique identifier for request tracking | fe413b1d-6753-4388-b028-74c2f8f37ba2 |
| X-Request-Time | Timestamp of the request | 2024-03-20T10:30:00Z |
| X-Client-Name | Name of the client application | MyApp |
| X-Client-Version | Version of the client application | 1.0.0 |
| X-Client-Build-Number | Build number of the client application | 1 |
| X-Client-Environment | Environment of the client application | development |
| X-Device-ID | Unique identifier of the device | 123456 |
| X-Device-Manufacturer | Manufacturer of the device | Apple |
| X-Device-Model-Identifier | Model identifier of the device | iPhone14,3 |
| X-Device-Model-Name | Model name of the device | iPhone 13 Pro Max |
| X-Geo-Latitude | Device's latitude coordinate | 25.276987 |
| X-Geo-Longitude | Device's longitude coordinate | 55.296249 |

## Best Practices
* Always include all required headers for proper request tracking
* Implement proper error handling for all API responses
* Monitor rate limits to ensure optimal performance
* Use appropriate notification priorities based on message importance
* Implement proper retry mechanisms for failed notifications

## Support
For additional support or questions, please refer to the Postman collection or contact the development team.
    `)
    .setExternalDoc('Postman Collection', config.apiUrl + '-json')
    .addBearerAuth()
    .addTag('notifications', 'Endpoints for sending push notifications')
    .addTag('health', 'System health monitoring endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        req.headers['accept-language'] = 'en';
        req.headers['x-request-id'] = 'fe413b1d-6753-4388-b028-74c2f8f37ba2';
        req.headers['x-request-time'] = new Date().toISOString();
        req.headers['x-client-name'] = 'MyApp';
        req.headers['x-client-version'] = '1.0.0';
        req.headers['x-client-build-number'] = 1;
        req.headers['x-client-environment'] = 'development';
        req.headers['x-device-id'] = '123456';
        req.headers['x-device-manufacturer'] = 'Apple';
        req.headers['x-device-model-identifier'] = 'iPhone14,3';
        req.headers['x-device-model-name'] = 'iPhone 13 Pro Max';
        req.headers['x-geo-latitude'] = 25.276987;
        req.headers['x-geo-longitude'] = 55.296249;

        return req;
      }
    }
  });
}