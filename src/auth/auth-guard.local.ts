import { AuthGuard } from '@nestjs/passport';

/**
 * The AuthGuardLocal class is a custom authentication guard that extends the AuthGuard from NestJS Passport.
 * It uses the 'local' strategy, which is typically used for username/password authentication.
 *
 * @class AuthGuardLocal
 * @extends {AuthGuard('local')}
 */
export class AuthGuardLocal extends AuthGuard('local') {}
