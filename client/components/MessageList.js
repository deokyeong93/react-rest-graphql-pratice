import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';
import fetcher from '../fetcher.js';

const MessageList = function () {
  const {
    query: { userId = '' },
  } = useRouter();
  const [mesList, setMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const onCreate = async text => {
    const newMessage = await fetcher('post', '/messages', { text, userId });

    setMessages([newMessage, ...mesList]);
  };

  const onUpdate = async (text, id) => {
    const message = await fetcher('put', `/messages/${id}`, {
      userId,
      text,
    });

    setMessages(mesList => {
      const targetIndext = mesList.findIndex(message => message.id === id);
      if (targetIndext < 0) return mesList;
      const messages = [...mesList];
      messages.splice(targetIndext, 1, message);
      return messages;
    });

    doneUpdate();
  };

  const doneUpdate = () => setEditingId(null);

  const onDelete = async id => {
    const receivedId = await fetcher('delete', `/messages/${id}`, {
      params: { userId },
    });

    setMessages(mesList =>
      mesList.filter(message => message.id !== receivedId + '')
    );
  };

  const getMessages = async () => {
    const messages = await fetcher('get', './messages');
    setMessages(messages);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <>
      <MessageInput name={'create'} mutate={onCreate} />
      <ul className={'messages'}>
        {mesList.map(x => (
          <MessageItem
            key={x.id}
            {...x}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            onUpdate={onUpdate}
            onDelete={onDelete}
            myId={userId}
          />
        ))}
      </ul>
    </>
  );
};

export default MessageList;
