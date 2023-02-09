import { Request, Response } from 'express';
import { data } from '~data/data';
import { Product } from '~models/Product';
export const crawl = async (req: Request, res: Response) => {
  data.map((value, index) => {
    var item = new Product(value);
    item.save(function (err, book) {
      if (err) {
        throw Error(err.stack);
      }
    });
  });

  try {
  } catch (error) {
    console.error(error);
    res.json(error);
  }
  res.end();
};

export const getall = async (req: Request, res: Response) => {
  try {
    const result = await Product.find();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
  res.end();
};
