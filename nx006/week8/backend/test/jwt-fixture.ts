import { randomBytes } from 'node:crypto';
import { JwtModule, JwtService } from '@nestjs/jwt';
const options = {
  secret: randomBytes(32).toString('hex'),
  signOptions: { expiresIn: 3600 },
};
export const testJwtModule = JwtModule.register(options);
export const testJwt = new JwtService(options);
export const authorization = (sub: string) => 'Bearer ' + testJwt.sign({ sub });
