import { Path, POST, HttpError, Errors } from "typescript-rest";
import { MemberRepository } from "../repositories";
import { MemberRegistrationDTO } from "../model/dto";
import { Controller, Authenticated } from ".";
import { AccessPrivilege } from "../model";
import { HTTPUtils } from "../utils/http-utils";
import { JSONSerialization } from "../utils/json-serialization";

@Path("/api/v1/driver/")
export class DriverController extends Controller {

  private _memberRepository = MemberRepository.instance;

  @Authenticated(AccessPrivilege.SUPERUSER)
  @POST
  public async createDriver() {

    try {
      const newDriver: MemberRegistrationDTO = HTTPUtils.parseBodyOfContoller(this, MemberRegistrationDTO);
      const member = await this._memberRepository.createDriver(newDriver);
      const _ = this._memberRepository.createActivationCode(member);
      // TODO: Send the activation URL by email !!
      return JSONSerialization.serializeObject(newDriver);
    } catch (error) {
      if (error instanceof HttpError)
        this.throw(error);  
      else
        this.throw(new Errors.BadRequestError((error as Error).message));
    }

  }

}