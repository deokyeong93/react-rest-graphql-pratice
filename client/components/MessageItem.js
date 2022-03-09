import MessageInput from './MessageInput';

const MessageItem = function ({
  id,
  userId,
  timeStamp,
  text,
  onUpdate,
  startEdit,
  isEditing,
  onDelete,
}) {
  return (
    <li className="messages__item">
      <h3>{userId} </h3>
      <sub>
        {new Date(timeStamp).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </sub>
      {isEditing ? (
        <>
          <MessageInput mutate={onUpdate} id={id} />
        </>
      ) : (
        ` => ${text}`
      )}
      <div className={'messages_buttons'}>
        <button onClick={() => startEdit(id)}>수정</button>
        <button onClick={() => onDelete(id)}>삭제</button>
      </div>
    </li>
  );
};

export default MessageItem;
