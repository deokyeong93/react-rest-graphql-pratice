import { readDB } from '../dbController.js';

const getUsers = () => readDB('users');

const userRoute = [
  {
    method: 'get',
    route: '/users',
    handler: (req, res) => {
      const users = getUsers();
      console.log(users);
      res.send(users);
    },
  },
  {
    method: 'get',
    route: '/users/:id',
    handler: ({ body, params: { id }, query }, res) => {
      try {
        const users = getUsers();
        const user = users[id];
        if (!user) throw Error('사용자가 없습니다.');
        res.send(user);
      } catch (error) {
        res.status(500).send({ error });
      }
    },
  },
];

export default userRoute;
