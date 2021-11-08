import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

// Custom decorator 'Serialize'
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializedInterceptor(dto));
}

export class SerializedInterceptor implements NestInterceptor {
  constructor(private dto: any) {} // Inject dto dependency

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Run something BEFORE a request is handled by the request handler

    // Run something AFTER a request is handled by the request handler
    return next.handle().pipe(
      // Data is the entity, so we create the entity based on the dto
      // The DTO has the rules like @Expose() and @Transform() of the
      // data we want to output
      map((data: any) => {
        // Run something before the response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
