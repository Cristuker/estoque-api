import * as Yup from 'yup';
import { Materials } from '../models';

class MaterialsController {
  async store(request, response) {
    try {
      const schema = Yup.object({
        name: Yup.string().required().min(2),
        quantity: Yup.number().required(),
        user_id: Yup.number().required(),
      });

      if (!(await schema.isValid(request.body))) {
        return response
          .status(406)
          .send({ message: 'The request body is not valid, check the params' });
      }
      const { name, quantity, user_id } = request.body;

      if (quantity <= 0) {
        return response
          .status(400)
          .send({ message: 'The quantity should be more than 0' });
      }

      const result = await Materials.create({
        name,
        quantity,
        user_id,
      });

      return response.status(201).send(result);
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: 'Internal server error' });
    }
  }
}

export default new MaterialsController();
