import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';
import fetcher from '../fetcher.js';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const MessageList = function ({ serverMessages, users }) {
  const {
    query: { userId = '' },
  } = useRouter();
  const [mesList, setMessages] = useState([...serverMessages]);
  const [hasNext, setHasNext] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

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
    const messages = await fetcher('get', './messages', {
      params: { cursor: mesList[mesList.length - 1]?.id || '' },
    });
    if (messages.length === 0) {
      setHasNext(false);
      return '';
    }
    setMessages(mesList => [...mesList, ...messages]);
    setHasNext(true);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

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
            user={users[x.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MessageList;
