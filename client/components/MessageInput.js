import { useRef } from 'react';

const MessageInput = ({ mutate, id = null }) => {
  const textRef = useRef();

  const onSumbit = e => {
    e.preventDefault();
    e.stopPropagation();
    const text = textRef.current.value;
    textRef.current.value = '';
    mutate(text, id);
  };

  return (
    <form className={'messages__input'} onSubmit={onSumbit}>
      <textarea ref={textRef} />
      <button className={'messages__button'} type="submit" children="click" />
    </form>
  );
};

export default MessageInput;
