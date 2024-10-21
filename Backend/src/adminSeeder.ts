import User from "./database/models/User";
import bcrypt from "bcrypt";

const adminSeeder = async (): Promise<void> => {
  const [data] = await User.findAll({
    where: {
      email: "p2admin@gmail.com",
    },
  });
  if (!data) {
    await User.create({
      email: "p2admin@gmail.com",
      password: bcrypt.hashSync("p2password", 8),
      username: "p2admin",
      role: "admin",
    });
    console.log("Admin credentials seeded successfully");
  } else {
    console.log("Admin credentials already seeded.");
  }
};
export default adminSeeder;
