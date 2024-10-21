import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "orderdetails",
  modelName: "OrderDetails",
  timestamps: true,
})
class OrderDetails extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;
}

export default OrderDetails;
