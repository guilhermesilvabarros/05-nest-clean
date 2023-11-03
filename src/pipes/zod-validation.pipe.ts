import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, ZodObject, ZodRawShape } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private readonly schema: ZodObject<T>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed.',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException('Validation failed.')
    }

    return value
  }
}
