import { AuthGuard } from '@nestjs/passport';

/**
 * The AuthGuardJwt class is a custom authentication guard that extends the AuthGuard from NestJS Passport.
 * It uses the 'jwt' strategy, which is typically used for JWT-based authentication.
 *
 * @class AuthGuardJwt
 * @extends {AuthGuard('jwt')}
 */
export class AuthGuardJwt extends AuthGuard('jwt') {}
