import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * The CurrentUser decorator is a custom parameter decorator that can be used in route handlers to get the current user.
 * It uses the ExecutionContext to access the request object and return the user property of the request.
 *
 * @function CurrentUser
 * @param {unknown} data - The data passed to the decorator. In this case, it is not used.
 * @param {ExecutionContext} ctx - The execution context.
 * @returns {User | null} The current user or null if no user is authenticated.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);
