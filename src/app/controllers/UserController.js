class UserController {
  store(request, response) {
    return this.response.send('Hello ');
  }
}

export default new UserController();
