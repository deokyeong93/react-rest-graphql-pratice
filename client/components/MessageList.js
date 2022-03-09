import { useState } from 'react';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';

const UserId = ['roy', 'jay'];
const getRandomUserId = () => UserId[Math.round(Math.random())];

const messages = Array(50)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    userId: getRandomUserId(),
    timeStamp: 1234567890123 + i * 1000 * 60,
    text: `${1 + i} mock text`,
  }))
  .reverse();

const MessageList = function () {
  const [mesList, setMessages] = useState(messages);
  const [editingId, setEditingId] = useState(null);

  const onCreate = text => {
    const id = mesList.length + 1;
    const newMessage = {
      id,
      userId: getRandomUserId(),
      timeStamp: 1234567890123 + id * 1000 * 60,
      text,
    };

    setMessages([newMessage, ...mesList]);
  };

  const onUpdate = (text, id) => {
    setMessages(mesList => {
      const targetIndext = mesList.findIndex(message => message.id === id);
      if (targetIndext < 0) return mesList;
      const newMessage = [...mesList];
      newMessage.splice(targetIndext, 1, {
        ...mesList[targetIndext],
        text,
      });
      return newMessage;
    });
    doneUpdate();
  };

  const doneUpdate = () => setEditingId(null);

  const onDelete = id => {
    setMessages(mesList => mesList.filter(message => message.id !== id));
  };

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
          />
        ))}
      </ul>
    </>
  );
};

export default MessageList;
