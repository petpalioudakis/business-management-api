/**
 * The AuthModule is a module that manages the authentication and user-related features of the application.
 * It uses JWT for authentication and TypeORM for interacting with the database.
 *
 * @module AuthModule
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  /**
   * The imports array includes the modules that this module depends on.
   * TypeOrmModule.forFeature([User]) is used to define which repositories are to be included in the current scope.
   * JwtModule.registerAsync is used to provide the JWT module with the necessary configuration.
   */
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.APP_JWT_SECRET,
        signOptions: { expiresIn: '120m' },
      }),
    }),
  ],
  /**
   * The controllers array lists the controllers provided by this module.
   */
  controllers: [AuthController, UsersController],
  /**
   * The providers array lists the services, strategies, etc. that this module provides.
   */
  providers: [LocalStrategy, JwtStrategy, AuthService, UserService],
})
/**
 * The AuthModule class represents the AuthModule in the application.
 *
 * @class AuthModule
 */
export class AuthModule {}
