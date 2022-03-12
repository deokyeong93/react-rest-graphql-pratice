import MessageList from '../components/MessageList';
import fetcher from '../fetcher';

const Home = ({ serverMessages, users }) => {
  return (
    <>
      <h1>SIMPLE SNS</h1>
      <MessageList serverMessages={serverMessages} users={users} />
    </>
  );
};

export const getServerSideProps = async () => {
  const serverMessages = await fetcher('get', '/messages');
  const users = await fetcher('get', '/users');
  return {
    props: { serverMessages, users },
  };
};

export default Home;
