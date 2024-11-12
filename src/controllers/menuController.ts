import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const menuFilePath = path.join(__dirname, "../../data/menu.json");

export const getMenu = (req: Request, res: Response) => {
  fs.readFile(menuFilePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Ruokalistan lataaminen epäonnistui" });
    }
    const menu = JSON.parse(data);
    res.status(200).json(menu);
  });
};

export const addMenuItem = (req: Request, res: Response) => {
  // Uuden ruoka-annoksen lisääminen
};

export const updateMenuItem = (req: Request, res: Response) => {
  // Ruoka-annoksen päivittäminen
};

export const deleteMenuItem = (req: Request, res: Response) => {
  // Ruoka-annoksen poistaminen
};
