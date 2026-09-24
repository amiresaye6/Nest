import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // run sumething before a requist is handled by the req handler

    console.log('I am running before the handler, context: ', context);

    return next.handle().pipe(
      map((data: any) => {
        // run somethign before the response is sent out
        console.log('I am runing before response is sent out, data: ', data);
      }),
    );
  }
}
