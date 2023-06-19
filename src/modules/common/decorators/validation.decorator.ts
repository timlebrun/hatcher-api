import { Body, Query, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export const ValidatedQuery: (options?: ValidationPipeOptions) => ParameterDecorator = (
	options: ValidationPipeOptions = { transform: true },
) => {
	const decorator = Query(new ValidationPipe({ transform: true, ...options }));

	return (target: unknown, propertyKey: string | symbol, parameterIndex: number) =>
		decorator(target, propertyKey, parameterIndex);
};

export const ValidatedBody: (options?: ValidationPipeOptions) => ParameterDecorator = (
	options: ValidationPipeOptions = { transform: true },
) => {
	const decorator = Body(new ValidationPipe({ transform: true, ...options }));

	return (target: unknown, propertyKey: string | symbol, parameterIndex: number) =>
		decorator(target, propertyKey, parameterIndex);
};
