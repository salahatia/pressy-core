import { Tags, Produces } from "typescript-rest-swagger";
import { Path, PathParam, POST, Return } from "typescript-rest";
import { exception } from "../../common/errors";
import bcrypt from "bcrypt";
import { BaseController } from "../../common/controller/base-controller";
import {
  crypto,
  SigningCategory,
  AuthCredentialsDto
} from "../../services/crypto";
import { JSONEndpoint } from "../../common/annotations";
import {
  LoginRequestDto,
  RefreshCredentialsRequestDto,
  ResetCodeRequestDto,
  ResetCodeDto,
  ResetPasswordRequestDto
} from "../../common/model/dto";
import { JSONBody } from "../../common/annotations/json-body";
import { IPersonRepository } from "../../common/repository/person-repository";
import { RepositoryFactory } from "../../common/repository/factory";
import { IMemberRepository } from "../../common/repository/member-repository";
import { MailingService } from "../../services/mailing-service";
import Mailer from "nodemailer";
import { getConfig } from "config";

@Produces("application/json")
@Tags("Authentication")
@Path("/auth")
export class AuthController extends BaseController {
  private _memberRepository: IMemberRepository =
    RepositoryFactory.instance.memberRepository;
  private _personRepository: IPersonRepository =
    RepositoryFactory.instance.personRepository;

  @JSONEndpoint
  @POST
  public async login(
    @JSONBody(LoginRequestDto) request: LoginRequestDto
  ): Promise<AuthCredentialsDto> {
    let member = await this._memberRepository.getMemberByEmail(request.email);

    if (!member) throw new exception.AccountNotFoundException(request.email);

    if (!bcrypt.compareSync(request.password, member.person.passwordHash))
      throw new exception.WrongPasswordException();

    return crypto.signAuthToken(member, SigningCategory.MEMBER);
  }

  @JSONEndpoint
  @Path("/refresh")
  @POST
  public async refreshCredentials(
    @JSONBody(RefreshCredentialsRequestDto)
    request: RefreshCredentialsRequestDto
  ): Promise<AuthCredentialsDto> {
    const { refreshToken } = request;
    return await crypto.refreshCredentials(refreshToken);
  }

  @JSONEndpoint
  @Path("/reset")
  @POST
  public async getResetPasswordCode(
    @JSONBody(ResetCodeRequestDto) request: ResetCodeRequestDto
  ): Promise<ResetCodeDto> {
    let member = await this._memberRepository.getMemberByEmail(request.email);

    if (member == undefined)
      throw new exception.AccountNotFoundException(request.email);

    const resetCode = await this._personRepository.createPasswordResetCode(
      member.person
    );

    // TODO: Return an empty "accepted" response, and call the email service
    let mail = new MailingService();
    mail
      .sendMail(
        {
          from: "romlugukno@desoz.com", // sender address
          to: "romlugukno@desoz.com", // list of receivers
          subject: "password reset ✔", // Subject line
          text: `${resetCode.id} this is the verification code for ${
            request.email
          }`
        } // plain text body
      )
      .then(info => {
        console.log(info.envelope);
        console.log(info.messageId);
      })
      .catch(err => {
        console.log(err);
      });
    return {
      code: resetCode.id
    } as ResetCodeDto;
  }

  @JSONEndpoint
  @Path("/reset/:code")
  @POST
  public async resetPassword(
    @PathParam("code") code: string,
    @JSONBody(ResetCodeRequestDto) request: ResetPasswordRequestDto
  ) {
    await this._personRepository.resetPassword(code, request);
  }
}
