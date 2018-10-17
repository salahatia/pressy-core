import {
  Path, POST,
  HttpError, Errors, Return, PathParam 
} from "typescript-rest";
import { MemberRepository, AuthRepository } from "../../common/repositories";
import {
  LoginRequestDTO,
  RefreshCredentialsRequestDTO,
  MemberPasswordResetRequestDTO,
  MemberPasswordResetCodeDTO,
  MemberPasswordResetCodeRequestDTO
} from "../../common/model/dto";
import { Controller } from ".";
import { Exception } from "../../common/errors";
import { HTTPUtils } from "../../common/utils/http-utils";
import { JSONSerialization } from "../../common/utils/json-serialization";
import bcrypt from "bcrypt";

@Path('/api/v1/auth/')
export class AuthController extends Controller {

  private _memberRepository: MemberRepository = MemberRepository.instance;
  private _authRepository: AuthRepository = AuthRepository.instance;

  @Path("/login/")
  @POST
  public async login() {

    try {

      const loginRequest = HTTPUtils.parseBodyOfContoller(this, LoginRequestDTO);
      const member = await this._memberRepository.getMemberByEmail(loginRequest.email!);

      if (!member)
        throw new Exception.MemberNotFound(loginRequest.email);

      if (!bcrypt.compareSync(loginRequest.password, member.passwordHash))
        throw new Exception.WrongPassword;

      const loginResponse = await this._authRepository.generateToken(member);
      
      return JSONSerialization.serializeObject(loginResponse);

    } catch (error) {
      this.throw(error);
    }

  }

  @Path("/refresh/")
  @POST
  public async refreshCredentials() {

    try {

      const refreshRequest = HTTPUtils.parseBodyOfContoller(this, RefreshCredentialsRequestDTO);
      return await this._authRepository.createNewCredentials(refreshRequest);

    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);
      else
        this.throw(new Errors.BadRequestError(error.message));
    }

  }

  @Path("/reset/")
  @POST
  public async getResetPasswordCode() {

    try {

      const resetCodeRequest = HTTPUtils.parseBodyOfContoller(this, MemberPasswordResetCodeRequestDTO);

      const member = await this._memberRepository
        .getMemberByEmail(resetCodeRequest.email);

      if (member == undefined) {
        this.throw(new Exception.MemberNotFound(resetCodeRequest.email!));
        return;
      }
      
      const resetCode = await this._memberRepository.createPasswordResetCode(member);
      const resetCodeDTO = MemberPasswordResetCodeDTO.create(resetCode.id!);

      // TODO: Return an empty "accepted" response, and call the email service
      return JSONSerialization.serializeObject(resetCodeDTO);

    } catch (error) {
      this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

  @Path("/reset/:code")
  @POST
  public async resetPassword(@PathParam("code") code: string) {

    try {

      const resetPasswordRequest = HTTPUtils.parseBodyOfContoller(this, MemberPasswordResetRequestDTO);
      const member = await this._memberRepository.resetPassword(code, resetPasswordRequest);

      return new Return.RequestAccepted(`/api/v1/member/${member.id}`);

    } catch (error) {
      if (error instanceof Error) 
        this.throw(new Errors.BadRequestError((error as Error).message));
      else if (error instanceof HttpError)
        this.throw(error);
    }

  }

}