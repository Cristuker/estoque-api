import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import Users from '../models/Users';
import authConfig from '../../config/auth';

class Login {
  async store(request, response) {
    try {
      const schema = Yup.object({
        email: Yup.string().required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(request.body))) {
        return response
          .status(406)
          .send({ message: 'The request body is not valid, check the params' });
      }

      const { email, password } = request.body;
      const user = await Users.findOne({ where: { email } });

      if (!user) {
        return response.status(404).send({ message: 'User not find' });
      }

      if (!(await user.checkPassword(password))) {
        return response.status(400).send({ message: 'Password dont match' });
      }

      const token = jwt.sign(user.id, authConfig.secret);

      return response.send({ token });
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: 'Internal server error' });
    }
  }
}

export default new Login();
