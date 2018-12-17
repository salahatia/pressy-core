import { AssignDriverSlotsRequest } from "./../../common/model/dto/driver";
import { Tags, Security, Produces } from "typescript-rest-swagger";
import { OrderRepository } from './../../common/repositories/order/order-repository';
import {BaseController} from "../../common/controller/base-controller";
import {Path, POST} from "typescript-rest";
import { JSONEndpoint, Authenticate } from "../../common/annotations";
import { SigningCategory } from "../../services/crypto";
import { http } from "../../common/utils/http";
import { Database } from '../../common/db';
import { AssignOrderDriverRequest } from '../../common/model/dto';


@Produces("application/json")
@Tags("Orders")
@Path("/order")
export class OrderController extends BaseController {

  private _orderRepository: OrderRepository = new OrderRepository(Database.getConnection());

	@Security("Bearer")
  @Path("/assign-driver")
	@JSONEndpoint
	@Authenticate(SigningCategory.ADMIN)
	@POST
	public async assignDriverToOrder(request: AssignDriverSlotsRequest) {

		let assignRequest = http.parseJSONBody(this.getPendingRequest().body, AssignOrderDriverRequest);
		await this._orderRepository.assignDriverToOrder(assignRequest);

	}

}