import {Entity, model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - Order
 * Order
 */
@model({name: 'Order'})
export class Order extends Entity {
  constructor(data?: Partial<Order>) {
    super(data)
    if (data != null && typeof data === 'object') {
      Object.assign(this, data);
    }
  }

  /**
   *
   */
  @property({

    id: true,
    type: 'string'


  })
  orderID?: string;

  /**
   *
   */
  @property({

    type: 'string',
    maxLength: 256,

  })
  userID?: string;

  /**
   *
   */
  @property({

    type: 'number',
    minimum: 0,

  })
  price?: number;

}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;


