import { PaymentAccount } from './../entity/members/payment-account';
import { JsonObject, JsonProperty } from "json2typescript";
import { MemberStatus, MemberGroup, Member } from "../entity";
import { JSONSerialization } from "../../utils/json-serialization";

@JsonObject
export class MemberInfoDTO {

  @JsonProperty("id", Number)
  public id: number;

  @JsonProperty("first_name", String)
  public firstName: string;

  @JsonProperty("last_name", String)
  public lastName: string;

  @JsonProperty("email", String)
  public email: string;

  @JsonProperty("phone", String)
  public phone: string;

  @JsonProperty("status", JSONSerialization.MemberStatusConverter)
  public status: MemberStatus;

  @JsonProperty("group", JSONSerialization.MemberGroupConverter)
  public group: MemberGroup;

  @JsonProperty("created", JSONSerialization.UTCDateConvert)
  public created: Date;

  public static create(member: Member): MemberInfoDTO {
    const memberDTO = new MemberInfoDTO();

    memberDTO.id = member.id;
    memberDTO.firstName = member.firstName;
    memberDTO.lastName = member.lastName;
    memberDTO.email = member.email;
    memberDTO.phone = member.phone;
    memberDTO.status = member.status;
    memberDTO.group = member.group;

    return memberDTO;
  }

}

@JsonObject
export class MemberRegistrationDTO {

  @JsonProperty("first_name", String)
  public firstName: string = "";

  @JsonProperty("last_name", String)
  public lastName: string = "";

  @JsonProperty("email", String)
  public email: string = "";

  @JsonProperty("password", String)
  public password: string = "";

  @JsonProperty("phone", String)
  public phone: string = "";

}

@JsonObject
export class MemberPasswordResetCodeDTO {

  @JsonProperty("code", String)
  public code: string = "";

  public static create(code: string): MemberPasswordResetCodeDTO {
    const resetCodeDTO = new MemberPasswordResetCodeDTO();

    resetCodeDTO.code = code;

    return resetCodeDTO;
  }

}

@JsonObject
export class MemberPasswordResetCodeRequestDTO {

  @JsonProperty("email", String)
  public email: string = "";

  public static create(email: string): MemberPasswordResetCodeRequestDTO {
    const resetCodeRequest = new MemberPasswordResetCodeRequestDTO();
    resetCodeRequest.email = email;
    return resetCodeRequest;
  }

}

@JsonObject
export class MemberPasswordResetRequestDTO {

  @JsonProperty("old_password", String)
  public oldPassword: string = "";

  @JsonProperty("new_password", String)
  public newPassword: string = "";

}

@JsonObject
export class LoginRequestDTO {

  @JsonProperty("password", String)
  public password: string = "";

  @JsonProperty("email", String)
  public email: string = "";

}

@JsonObject
export class LoginResponseDTO {

  @JsonProperty("access_token", String)
  public accessToken: string = "";

  @JsonProperty("refresh_token", String)
  public refreshToken: string = "";

  @JsonProperty("expires_in", Number)
  public expiresIn: number = 3600;

  @JsonProperty("type", String)
  public type: string = "Bearer";

  public static create(accessToken: string, refreshToken: string): LoginResponseDTO {
    const response = new LoginResponseDTO();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.type = "Bearer";
    return response;
  }

}

@JsonObject
export class RefreshCredentialsRequestDTO {

  @JsonProperty("refresh_token", String)
  public refreshToken: string = "";

}

@JsonObject
export class CreditCardDTO {

  @JsonProperty("credit_card_number", String)
  public creditCardNumber: string = "";

  @JsonProperty("credit_card_owner_name", String)
  public creditCardOwnerName: string = "";

  @JsonProperty("credit_card_expiry_date", JSONSerialization.CreditCardExpiryDateConvert)
  public creditCardExpiryDate: Date = new Date();

  public static create(paymentAccount: PaymentAccount): CreditCardDTO {
    const creditCard = new CreditCardDTO();
    creditCard.creditCardNumber = paymentAccount.creditCardNumber;
    creditCard.creditCardOwnerName = paymentAccount.creditCardOwnerName;
    creditCard.creditCardExpiryDate = paymentAccount.creditExpiryDate;
    return creditCard;
  }

}

@JsonObject
export class MobileDeviceDTO {

  @JsonProperty("device_id", String)
  public deviceId: string = "";

  public static create(id: string): MobileDeviceDTO {
    const device = new MobileDeviceDTO();
    device.deviceId = id;
    return device;
  }

}