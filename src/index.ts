import { JWT } from './security/jwt';
import { UserDTO } from './dto/response/user.dto';
import { AuthenticationDTO } from './dto/response/authentication.dto';
import "reflect-metadata";
import * as express from "express";
import { User } from "./entity/User";
import { Database } from './database';
import { createConnection } from "typeorm";
import { Request, Response } from "express"; 
import { PasswordHash } from './security/passwordHash';
import { RegisterDTO } from './dto/request/register.dto';

const app = express();

Database.initialize();

app.use(express.json());

app.get("/",(req: Request, resp: Response) => {
    return  resp.send( "Hello Express !!!");
} );

app.post("/register", async (req: Request, res: Response) => {
    try {
        const body: RegisterDTO = req.body;
        const { password, repeatPassword, username, email, age } = body;

        if(password !== repeatPassword) {
            throw new Error("Repeat password does not match!");
        }
        
        // const existedEmail = await Database.userRepository.findOne({email: body.email});
        // if(existedEmail) {
        //     throw new Error("Email already exist");
        // }

        const user = new User();
        user.username = username;
        user.email = email;
        user.password = await PasswordHash.hashPassword(password);
        user.age = age;
        await Database.userRepository.save(user);       

        const userDTO: UserDTO = new UserDTO();
        userDTO.id = user.id;
        userDTO.username = user.username;
        userDTO.age = user.age;
        userDTO.email = user.email;
        
        const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
        const tokenAndRefreshToken = await JWT.generateTokenAndRefreshToken(user);
        authenticationDTO.user = userDTO;
        authenticationDTO.token = tokenAndRefreshToken.token;
        authenticationDTO.refreshToken = tokenAndRefreshToken.refreshToken;

        return res.json(authenticationDTO);    
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
    
});

app.listen(4000, () => console.log("-- Listening PORT:", 4000));

createConnection().then(async connection => {
}).catch(error => console.log(error));
