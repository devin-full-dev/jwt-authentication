import { User } from './entity/User';
import { Connection, createConnection, Repository } from "typeorm";
import { RefreshToken } from './entity/RefreshToken';

export class Database {
  public static connection: Connection;
  public static userRepository: Repository<User>;
  public static refreshTokensRepository: Repository<RefreshToken>;

  public static async initialize() {
    this.connection = await createConnection();
    this.userRepository = this.connection.getRepository(User);
    this.refreshTokensRepository = this.connection.getRepository(RefreshToken);
  }
}