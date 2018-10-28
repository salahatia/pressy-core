import { Person } from './../model/entity/users/person';
import "crypto";
import { Member } from "../model/entity/users/member";
import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import { Exception } from "../errors";
import { MemberRepository } from "./member-repository";
import { RefreshCredentialsRequestDTO, LoginResponseDTO } from "../model/dto/member";
import { getConfig } from "../../config";

export enum AuthPrivilege {
  BASIC, SUPERUSER
}

interface IAuthPayload {
  id: number;
  privilege: number
}

export class AuthRepository {

  public static instance: AuthRepository = new AuthRepository();

  private _publicKey: string = getConfig().authenticationPublicKey;
  private _privateKey: string = getConfig().authenticationPrivateKey;

  public async generateToken(person: Person, privilege: AuthPrivilege = AuthPrivilege.SUPERUSER): Promise<LoginResponseDTO> {

    const payload: IAuthPayload = {
      id: person.id,
      privilege: AuthPrivilege.BASIC
    };

    const signOptions: SignOptions = {
      audience: person.id.toString(),
      issuer: "pressy",
      algorithm: "RS256"
    };

    const token = sign(payload, this._privateKey, {...signOptions, expiresIn: "1h", subject: "access"});
    const refreshToken = sign(payload, this._privateKey, {...signOptions, subject: "refresh"});

    return LoginResponseDTO.create(token, refreshToken);

  }

  public async decodeToken(token: string, minimumPrivilege: AuthPrivilege): Promise<Member> {

    const memberRepository = new MemberRepository;
    var payload: IAuthPayload;

    try {

      const decodedPayload = verify(token, this._publicKey);
      payload = typeof decodedPayload === "string" ? JSON.parse(decodedPayload) : decodedPayload;

    } catch (error) {
      throw new Exception.InvalidAccessToken(error.message);
    }

    if (!payload)
      throw new Exception.InvalidAccessToken;

    if (payload.privilege < minimumPrivilege) 
      throw new Exception.UnauthorizedRequest;

    const member = await memberRepository.getMemberById(payload.id);

    if (!member)
      throw new Exception.AccessTokenNotFound;

    return member;

  }

  public async createNewCredentials(request: RefreshCredentialsRequestDTO): Promise<LoginResponseDTO> {

    try {
      const verifyOptions: VerifyOptions = {
        issuer: "pressy",
        algorithms: ["RS256"],
        subject: "refresh"
      };
      const decodedPayload = verify(request.refreshToken, this._publicKey, verifyOptions);
      const payload: IAuthPayload = typeof decodedPayload === "string" ? JSON.parse(decodedPayload) : decodedPayload;

      const signOptions: SignOptions = {
        algorithm: "RS256",
        expiresIn: "1h"
      };

      const accessToken: IAuthPayload = {
        id: payload.id,
        privilege: payload.privilege
      };

      return LoginResponseDTO.create(sign({...accessToken, expiresIn: "1h"}, this._privateKey, signOptions), request.refreshToken);
    } catch (error) {
      throw new Exception.InvalidAccessToken
    }

  }

}