import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Response, RestBindings, api, operation, param, requestBody} from '@loopback/rest';
import {Order} from '../models/order.model';
import {OrderRepository} from '../repositories';

/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by order.
 *
 */
@api({
  components: {
    schemas: {
      Order: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
          },
          user_id: {
            type: 'string',
            maxLength: 256,
          },
          price: {
            type: 'number',
            format: 'float',
          },
          product_id: {
            type: 'number',
            format: 'int32',
          },
          number: {
            type: 'number',
            format: 'int32',
          },
          completed: {
            type: 'boolean',
          },
          date: {
            type: 'string',
          },

        },
      },
      Error: {
        type: 'object',
        required: [
          'code',
          'message',
        ],
        properties: {
          code: {
            type: 'integer',
            format: 'int32',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
    requestBodies: {
      OrderArray: {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Order',
              },
            },
          },
        },
        description: 'List of user object',
        required: true,
      },
    },
  },
  paths: {},
})
export class OrderController {
  constructor(
    @repository(OrderRepository) private orderRepo: OrderRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {
    console.log('Hello from Order Controller')
  }
  /**
   *
   *
   * @param _requestBody Created order object
   */
  @operation('post', '/order/create', {
    tags: [
      'order',
    ],
    summary: 'Create order',
    operationId: 'createOrder',
    responses: {
      default: {
        description: 'successful operation',
      },
    },
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Order',
          },
        },
      },
      description: 'Created order object',
      required: true,
    },
  })
  async createOrder(@requestBody({
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Order',
        },
      },
    },
    description: 'Created order object',
    required: true,
  }) _requestBody: Order): Promise<any | undefined> {
    if (!(_requestBody.order_id)) {
      console.log("ERROR! Не указан идентификатор заказа");
      return this.response.status(400).send(this.errorRes(400, 'Не указан идентификатор заказа!'));
    }
    const filter = {
      where: {
        order_id: _requestBody.order_id,
      }
    };
    const sameID = await this.orderRepo.findOne(filter)
    if (sameID) {
      return this.response.status(400).send(this.errorRes(400, 'Это заказ уже был создан!'))
    }
    const newOrder = await this.orderRepo.create(_requestBody);

    return this.response.status(200).send(newOrder);
  }
  /**
   * Returns order
   *
   * @param orderId ID of order
   * @returns order response
   */
  @operation('get', '/order/{orderId}', {
    tags: [
      'order',
    ],
    description: 'Returns order',
    operationId: 'find order by id',
    responses: {
      '200': {
        description: 'order response',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Order',
            },
          },
        },
      },
      default: {
        description: 'unexpected error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
    parameters: [
      {
        name: 'orderId',
        in: 'path',
        description: 'ID of order',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
  })
  async findOrderById(@param({
    name: 'orderId',
    in: 'path',
    description: 'ID of order',
    required: true,
    schema: {
      type: 'string',
    },
  }) orderId: string): Promise<Order> {
    throw new Error('Not implemented');
  }
  /**
   * deletes a single order based on the ID supplied
   *
   * @param orderId ID of order
   */
  @operation('delete', '/order/{orderId}', {
    tags: [
      'order',
    ],
    description: 'deletes a single order based on the ID supplied',
    operationId: 'deleteOrder',
    responses: {
      '204': {
        description: 'order deleted',
      },
      default: {
        description: 'unexpected error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
    parameters: [
      {
        name: 'orderId',
        in: 'path',
        description: 'ID of order',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
  })
  async deleteOrder(@param({
    name: 'orderId',
    in: 'path',
    description: 'ID of order',
    required: true,
    schema: {
      type: 'string',
    },
  }) orderId: string): Promise<unknown> {
    throw new Error('Not implemented');
  }

  errorRes(code: number, mes: string): any {
    return {
      statusCode: code,
      code: "error",
      message: mes
    }
  }
}

