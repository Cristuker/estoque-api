import * as Yup from 'yup';
import { Op } from 'sequelize';
import { Materials, Users, Histories } from '../models';

class MaterialsController {
  async store(request, response) {
    try {
      const schema = Yup.object({
        name: Yup.string().required().min(2),
        quantity: Yup.number().required(),
      });

      if (!(await schema.isValid(request.body))) {
        return response
          .status(406)
          .send({ message: 'The request body is not valid, check the params' });
      }
      const { name, quantity } = request.body;
      const { userId } = request;
      if (quantity <= 0) {
        return response
          .status(400)
          .send({ message: 'The quantity should be more than 0' });
      }

      const { role } = await Users.findOne({
        where: { id: userId },
        raw: true,
      });

      if (role !== 'Estoquista') {
        return response
          .status(401)
          .send({ message: 'This role do have permission for this action' });
      }

      const iHaveThisMaterial = await Materials.findOne({
        where: { name },
        raw: true,
      });

      if (iHaveThisMaterial) {
        return response.status(401).send({
          message: 'This material already exists!',
          materialInfo: iHaveThisMaterial,
        });
      }

      console.log(iHaveThisMaterial);
      const result = await Materials.create({
        name,
        quantity,
        user_id: userId,
      });

      return response.status(201).send(result);
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: 'Internal server error' });
    }
  }

  async index(request, response) {
    try {
      // Verificações
      const { name, user } = request.query;

      const iHaveNameAndUserQueryParams = !!name && user;

      if (iHaveNameAndUserQueryParams) {
        return response.status(403).send({
          message: 'You dont can send user and name params in the same request',
        });
      }

      const ifDontHaveAnyQueryParams = !!name || user;

      if (!ifDontHaveAnyQueryParams) {
        return response.status(406).send({
          message: 'The request query is not valid, check the query params',
        });
      }

      const { userId } = request;
      const { role } = await Users.findOne({ where: { id: userId } });
      console.log(role);

      if (role === 'Estoquista') {
        return response
          .status(401)
          .send({ message: 'This role do have permission for this action' });
      }

      // Pesquisar history dos materiais

      if (user) {
        if (role === 'Padeiro') {
          return response
            .status(401)
            .send({ message: 'This role do have permission for this action' });
        }
        const searchedUser = await Users.findOne({
          where: { name: user },
          raw: true,
        });

        if (!searchedUser) {
          return response
            .status(404)
            .send({ message: 'User not found, check the query params' });
        }
        const { id: userHistoryId } = searchedUser;

        const userHistory = await Histories.findAll({
          where: { user_id: userHistoryId },
          raw: true,
        });
        return response.send(userHistory);
      }

      // Pesquisar materiais
      const result = await Materials.findAll({
        where: { name: { [Op.like]: `%${name}%` } },
        raw: true,
      });

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

        formatedResult.push({ ...material, lastUpdatedBy: userData });
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
      });

      if (!(await schema.isValid(request.body))) {
        return response
          .status(406)
          .send({ message: 'The request body is not valid, check the params' });
      }
      const { userId } = request;

      const { role } = await Users.findOne({
        where: { id: userId },
      });

      if (role === 'Estoquista') {
        return response
          .status(401)
          .send({ message: 'This role do have permission for this action' });
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

      const { name, quantity } = request.body;

      await Histories.create({
        name: existsMaterial.name,
        quantity,
        user_id: userId,
        material_id: materialId,
      });

      const result = await Materials.update(
        { name, quantity, user_id: userId },
        { where: { id: materialId } }
      );

      if (!result) {
        return response.status(400).send({
          message: 'Error on update material',
        });
      }

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
