export const CONFIG = {
  payment: {
    //host: "http://127.0.0.1:3001/balance/reserve",
    host: "payment-service.default.svc.cluster.local/balance/reserve"
  },
  stock: {
    //host: "http://127.0.0.1:3002/products/reserve",
    host: "stock-service.default.svc.cluster.local/products/reserve",
  },
  delivery: {
    //host: "http://127.0.0.1:3003/courier/reserve",
    host: "delivery-service.default.svc.cluster.local/courier/reserve",
  },
  trace: true
}
