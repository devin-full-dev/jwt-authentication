import { Database } from './../database';
import * as moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import * as  jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { RefreshToken } from './../entity/RefreshToken';

export class JWT { 

  private static JWT_SECRET = "123456";
  public static async generateTokenAndRefreshToken(user: User) {
 
    const payLoad = {
      id: user.id,
      email: user.email
    }   

    const jwtId =  uuidv4();
    const token = jwt.sign(payLoad, this.JWT_SECRET, {
      expiresIn: "1h", // set token expires in 1h
      jwtid: jwtId,
      subject: user.id.toString(),
    }); 

    const refreshToken = await this.generateTokenOfUserAndToken(user, jwtId)
    
    return { token, refreshToken };
  }

  private static async generateTokenOfUserAndToken(
    user: User, 
    jwtId: string
  ){

    // Create new record for refresh Token
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.jwtid = jwtId;
    refreshToken.expiryDate = moment().add(10, "d").toDate();

    await Database.refreshTokensRepository.save(refreshToken);
    return refreshToken.id;
  }
}