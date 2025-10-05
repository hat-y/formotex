import argon2 from 'argon2';

export interface Hasher {
  hash(plain: string): Promise<string>;
  verify?(hash: string, plain: string): Promise<boolean>; // opcional para AuthService
}

export class Argon2Hasher implements Hasher {
  constructor(
    private readonly opts: argon2.Options & {
      timeCost?: number; memoryCost?: number; parallelism?: number
    } = {}
  ) { }

  /*
   *
   */
  hash(plain: string): Promise<string> {
    return argon2.hash(plain, this.opts);
  }

  /*
   *
   */
  verify(hash: string, plain: string) {
    return argon2.verify(hash, plain);
  }
}

