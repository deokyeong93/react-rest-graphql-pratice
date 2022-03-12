import MessageInput from './MessageInput';

const MessageItem = function ({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  startEdit,
  isEditing,
  onDelete,
  myId,
  user,
}) {
  return (
    <li className="messages__item">
      <h3>
        {user?.nickname}{' '}
        <sub>
          {new Date(timestamp).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </sub>
      </h3>

      {isEditing ? (
        <>
          <MessageInput mutate={onUpdate} id={id} />
        </>
      ) : (
        ` => ${text}`
      )}
      {userId === myId && (
        <div className={'messages__buttons'}>
          <button onClick={() => startEdit(id)}>수정</button>
          <button onClick={() => onDelete(id)}>삭제</button>
        </div>
      )}
    </li>
  );
};

export default MessageItem;
