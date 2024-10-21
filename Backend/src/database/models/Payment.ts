import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from "sequelize-typescript";
import { toDefaultValue } from "sequelize/types/utils";

@Table({
  tableName: "payments",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM("COD", "Khalti", "eSewa"),
    allowNull: false,
  })
  declare paymentMethod: string;

  @Column({
    type: DataType.ENUM("paid", "unpaid"),
    defaultValue: "unpaid",
    allowNull: false,
  })
  declare paymentStatus: string;

  @Column({
    type: DataType.STRING,
  })
  declare pidx: string;
}

export default Payment;
