import { ContextRequest, ContextResponse, HttpError } from "typescript-rest";
import { Request, Response } from "express";
import { Member } from "../model/entity/users/member";
import { Exception } from "../errors";
import { AuthRepository, AuthPrivilege } from "../repositories";

export abstract class Controller {

  public currentMember?: Member;

  @ContextRequest
  public currentRequest?: Request;
  @ContextResponse
  public currentResponse?: Response;

  public throw<TError extends HttpError>(error: TError) {

    this.currentResponse!.setHeader('Content-Type', 'application/json');
    this.currentResponse!.status(error.statusCode)
      .send({
        statusCode: error.statusCode || 400,
        message: error.message
      });
    
  }

}

export function Authenticated<TController extends Controller>(minimumPrivilege: AuthPrivilege = AuthPrivilege.BASIC): (target: TController, property: string, propertyDescriptor: PropertyDescriptor) => void {

  return function<TController extends Controller>(_: TController, __: string, propertyDescriptor: PropertyDescriptor) {
    const authRepository = new AuthRepository;
    var originalMethod: Function = propertyDescriptor.value;
    propertyDescriptor.value = async function(...args: any[]) {
      var context: TController = this as TController;

      const authorization = context.currentRequest!.headers["authorization"];

      if (!authorization) {
        context.throw(new Exception.UnauthenticatedRequest());
        return;
      }

      const token = authorization!.split(" ")[1];

      if (!token) {
        context.throw(new Exception.InvalidAccessToken());
        return;
      }

      try {
        context.currentMember = await authRepository.decodeToken(token, minimumPrivilege);
      } catch (error) {
        context.throw(error);
        return;
      }
      
      return originalMethod.call(context, ...args);
    }
    return propertyDescriptor;
  }

}