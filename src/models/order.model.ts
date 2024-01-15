import {Entity, model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - Order
 * Order
 */
@model({name: 'Order'})
export class Order extends Entity {
  constructor(data?: Partial<Order>) {
    super();
    if (data != null && typeof data === 'object') {
      Object.assign(this, data);
    }
  }

  /**
   *
   */
  @property({
    jsonSchema: {
      type: 'string',
      id: true,
    }
  })
  orderID?: string;

  /**
   *
   */
  @property({
    jsonSchema: {
      type: 'string',
      maxLength: 256,
    }
  })
  userID?: string;

  /**
   *
   */
  @property({
    jsonSchema: {
      type: 'number',
      minimum: 0,
    }
  })
  price?: number;

  /**
   *
   */
  @property({
    jsonSchema: {
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
    }
  })
  goods?: {
    goodID?: string;
    num?: number;
    goodPrice?: number;
  }[];

}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;


