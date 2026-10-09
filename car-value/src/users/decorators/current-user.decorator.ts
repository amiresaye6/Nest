import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // we annotate data to be never data type so we tell every one that this decorator doesnt require any input.
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.currentUser || {message: "you are not logged in."};
  },
);
