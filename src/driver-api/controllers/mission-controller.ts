import {Path, GET, QueryParam} from "typescript-rest";
import {BaseController} from "../../common/controller/base-controller";
import { RepositoryFactory } from "../../common/repository/factory";
import { Tags, Produces, Security } from "typescript-rest-swagger";
import { JSONEndpoint, Authenticate } from "../../common/annotations";
import { IOrderMissionRepository } from "../../common/repository/order-mission-repository";
import { Driver } from "../../common/model/entity/users/driver/driver";
import { OrderMissionDto } from "../../common/model/dto/order/order-mission";
import { SigningCategory } from "../../services/crypto";


@Produces("application/json")
@Tags("Missions")
@Path("/missions/")
export class MissionController extends BaseController {

  private _orderMissionRepository: IOrderMissionRepository = RepositoryFactory.instance.orderMissionRepository;

  @Authenticate(SigningCategory.DRIVER)
  @JSONEndpoint
  @Security("Bearer")
  @GET
  public async getMissions(): Promise<OrderMissionDto[]> {
    
    let driver = <Driver>this.pendingUser;
    let missions = await this._orderMissionRepository.getOrderMissionsForDriver(driver);
    return missions.map(mission => new OrderMissionDto(mission));

  }

  @Authenticate(SigningCategory.DRIVER)
  @JSONEndpoint
  @Path("/history")
  @Security("Bearer")
  @GET
  public async getMissionHistory(@QueryParam("skip") skip?: string, @QueryParam("take") take?: string): Promise<OrderMissionDto[]> {
    
    let driver = <Driver>this.pendingUser;

    let skipValue: number | undefined;
    let takeValue: number | undefined;

    if (skip)
      skipValue = parseInt(skip);
    if (take)
      takeValue = parseInt(take);

    let missions = await this._orderMissionRepository.getMissionHistoryForDriver(driver, skipValue, takeValue);
    return missions.map(mission => new OrderMissionDto(mission));

  }

}