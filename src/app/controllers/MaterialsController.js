import * as Yup from 'yup';
import { Op } from 'sequelize';
import { Materials, Users, Histories } from '../models';

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

      const { role } = await Users.findOne({
        where: { id: user_id },
        raw: true,
      });

      if (role !== 'Estoquista') {
        return response
          .status(401)
          .send({ message: 'This role do have permission for this action' });
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

  async index(request, response) {
    try {
      const { name } = request.query;

      if (!name) {
        return response.status(406).send({
          message: 'The request query is not valid, check the params',
        });
      }

      const result = await Materials.findAll({
        where: { name: { [Op.like]: `%${name}%` } },
        raw: true,
      });

      const { role } = await Users.findOne({ where: { id: request.userId } });

      if (role === 'Estoquista') {
        return response
          .status(401)
          .send({ message: 'This role do have permission for this action' });
      }

      const formatedResult = [];
      for (const material of result) {
        // eslint-disable-next-line no-await-in-loop
        const userData = await Users.findOne({
          where: { id: material.user_id },
          raw: true,
        });

        delete userData.password_hash;
        delete userData.created_at;
        delete userData.updated_at;

        formatedResult.push({ ...material, user: userData });
      }

      return response.send(formatedResult);
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: 'Internal server error' });
    }
  }

  async update(request, response) {
    try {
      const schema = Yup.object({
        quantity: Yup.number().required(),
        user_id: Yup.number().required(),
      });

      if (!(await schema.isValid(request.body))) {
        return response
          .status(406)
          .send({ message: 'The request body is not valid, check the params' });
      }

      const { id: materialId } = request.params;

      const existsMaterial = await Materials.findOne({
        where: { id: materialId },
        raw: true,
      });

      if (!existsMaterial) {
        return response.status(404).send({
          message: 'The request params is not valid, materil dont exists',
        });
      }

      const { role, name: userName } = await Users.findOne({
        where: { id: request.userId },
      });

      if (role === 'Estoquista') {
        return response
          .status(401)
          .send({ message: 'This role do have permission for this action' });
      }
      const { name, quantity, user_id } = request.body;
      const { role: bakerRole } = await Users.findOne({
        where: { id: user_id },
      });

      if (bakerRole === 'Estoquista') {
        return response.status(401).send({
          message: 'This role of this user id dont cant update materials',
        });
      }

      await Histories.create({
        name: userName,
        quantity,
        user_id,
        createdByUser: request.userId,
      });

      const result = await Materials.update(
        { name, quantity, user_id },
        { where: { id: materialId } }
      );

      if (!result) {
        return response.status(400).send({
          message: 'Error on update material',
        });
      }

      console.log(result);
      return response
        .status(202)
        .send({ message: 'Material updated whit success' });
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: 'Internal server error' });
    }
  }
}

export default new MaterialsController();
