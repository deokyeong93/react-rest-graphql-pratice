import { v4 } from 'uuid';
import { readDB, writeDB } from '../dbController.js';

const getMessages = () => readDB('messages');
const setMessages = data => writeDB('messages', data);

const messagesRoute = [
  {
    // GET MESSAGE
    method: 'get',
    route: '/messages',
    handler: (req, res) => {
      const messages = getMessages();
      res.send(messages);
    },
  },
  {
    // GET Message
    method: 'get',
    route: '/messages/:id',
    handler: ({ body, params: { id }, query }, res) => {
      try {
        const messages = getMessages();
        const message = messages.find(message => message.id === id);
        if (!message) {
          throw Error('메시지를 차지 못하였습니다.');
        }

        res.send(message);
      } catch (error) {}
    },
  },
  {
    // CREATE MESSAGE
    method: 'post',
    route: '/messages',
    handler: ({ body, params, query }, res) => {
      const messages = getMessages();
      const newMessage = {
        id: v4(),
        text: body.text,
        userId: body.userId,
        timestamp: Date.now(),
      };
      messages.unshift(newMessage);
      setMessages(messages);
      res.send(newMessage);
    },
  },
  {
    // UPDATE MESSAGE
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id }, query }, res) => {
      try {
        const messages = getMessages();
        const targetIndex = messages.findIndex(message => message.id === id);
        if (targetIndex < 0) {
          throw '메세지가 없습니다';
        }
        if (messages[targetIndex].userId !== body.userId) {
          throw '사용자가 다릅니다.';
        }

        const newMessage = { ...messages[targetIndex], text: body.text };
        messages.splice(targetIndex, 1, newMessage);
        setMessages(messages);
        res.send(newMessage);
      } catch (error) {
        res.status(500).send({ error });
        console.error(error);
      }
    },
  },
  {
    // DELETE MESSAGE
    method: 'delete',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        const messages = getMessages();
        const targetIndex = messages.findIndex(message => message.id === id);
        if (targetIndex < 0) {
          throw '메세지가 없습니다';
        }
        if (messages[targetIndex].userId !== body.userId) {
          throw '사용자가 다릅니다.';
        }

        messages.splice(targetIndex, 1);
        setMessages(messages);
        res.send(id);
      } catch (error) {
        res.status(500).send({ error });
      }
    },
  },
];

export default messagesRoute;
