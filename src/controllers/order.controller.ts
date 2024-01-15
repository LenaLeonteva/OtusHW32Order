import {api, operation, param, requestBody} from '@loopback/rest';
import {Order} from '../models/order.model';

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
          orderID: {
            type: 'string',
            id: true,
          },
          userID: {
            type: 'string',
            maxLength: 256,
          },
          price: {
            type: 'number',
            minimum: 0,
          },
          goods: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                goodID: {
                  type: 'string',
                },
                num: {
                  type: 'integer',
                  minimum: 0,
                },
                goodPrice: {
                  type: 'number',
                  minimum: 0,
                },
              },
            },
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
  constructor() { }
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
  }) _requestBody: Order): Promise<unknown> {
    throw new Error('Not implemented');
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
}

