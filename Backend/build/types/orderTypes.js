"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.TransactionStatus = exports.PaymentStatus = exports.PaymentMethod = void 0;
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "cod";
    PaymentMethod["KHALTI"] = "khalti";
    PaymentMethod["ESEWA"] = "eSewa,";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["unpaid"] = "unpaid";
    PaymentStatus["paid"] = "paid";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["COMPLETED"] = "Completed";
    TransactionStatus["PENDING"] = "Pending";
    TransactionStatus["INITIALIZED"] = "Initialized";
    TransactionStatus["REFUNDED"] = "Refunded";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["ONTHEWAY"] = "ontheway";
    OrderStatus["PREPARATION"] = "preparation";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
