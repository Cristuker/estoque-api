import * as Yup from 'yup';
import Users from '../models/Users';

class UserController {
  async store(request, response) {
    try {
      const schema = Yup.object({
        name: Yup.string().required().min(4),
        email: Yup.string().required(),
        password: Yup.string().required(),
        password_confirmation: Yup.string().required(),
        role: Yup.string().required(),
      });

      if (!(await schema.isValid(request.body))) {
        return response
          .status(406)
          .send({ message: 'The request body is not valid, check the params' });
      }

      const {
        name,
        email,
        password,
        password_confirmation,
        role,
      } = request.body;

      const isValidEmail = Yup.string().email();

      if (!(await isValidEmail.isValid(email))) {
        return response.status(406).send({ message: 'The email is not valid' });
      }

      const existsEmail = await Users.findOne({ where: { email } });
      if (existsEmail) {
        return response
          .status(409)
          .send({ message: 'The email is alredy used' });
      }

      const defaultRoles = ['Padeiro', 'Gerente', 'Estoquista'];
      const isValidRole = defaultRoles.find(
        (defaultRole) => defaultRole === role
      );

      if (!isValidRole) {
        return response.status(406).send({ message: 'The role is invalid' });
      }

      if (password !== password_confirmation) {
        return response
          .status(406)
          .send({ message: 'The password confirmation, is not valid' });
      }

      const result = await Users.create({
        name,
        email,
        password_hash: password,
        role,
      });

      return response.status(201).send({
        name: result.name,
        role: result.role,
        id: result.id,
        email: result.email,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: 'Internal server error' });
    }
  }
}

export default new UserController();
