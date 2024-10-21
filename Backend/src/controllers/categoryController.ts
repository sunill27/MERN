import Category from "../database/models/Category";
import { Request, Response } from "express";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Clothes",
    },
    {
      categoryName: "Food/Beverages",
    },
  ];

  //Seed Categories:
  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      const data = await Category.bulkCreate(this.categoryData);
      console.log("Categories seeded successfully");
    } else {
      console.log("Categories already seeded");
    }
  }

  //Add Categories:
  async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({ message: "Please provide categoryName" });
      return;
    }

    await Category.create({
      categoryName,
    });
    const data = await Category.findAll();

    res.status(200).json({
      message: "Category Added successfully",
      data,
    });
  }

  // Fetch Categories:
  async getCategories(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    res.status(200).json({
      message: "Categories fetched",
      data,
    });
  }

  //Delete Category:
  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    const data = await Category.findAll({
      where: {
        id,
      },
    });
    if (data.length === 0) {
      res.status(404).json({
        message: "No category with that id",
      });
    } else {
      await Category.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Category deleted",
      });
    }
  }

  //Update Category:
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body;
    const data = await Category.findAll({
      where: {
        id: id,
      },
    });
    if (data.length === 0) {
      res.status(404).json({
        message: "No category with that id",
      });
    } else {
      await Category.update(
        { categoryName },
        {
          where: {
            id: id,
          },
        }
      );
      res.status(200).json({
        message: "Category updated successfully",
        data: data,
      });
    }
  }
}

export default new CategoryController();
