import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function ValidateDeviceHeaders(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateDeviceHeaders',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'common.errors.headers.xDeviceHeadersDependenciesRequired',
        ...validationOptions
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as Record<string, any>;
          const deviceHeaders = [
            'x-device-id',
            'x-device-manufacturer',
            'x-device-model-identifier',
            'x-device-model-name'
          ];

          const hasAnyHeader = deviceHeaders.some(header => object[header] !== undefined);
          const hasAllHeaders = deviceHeaders.every(header => object[header] !== undefined);

          // Valid if either no headers are present or all headers are present
          return !hasAnyHeader || hasAllHeaders;
        }
      }
    });
  };
}