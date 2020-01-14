import withRepoBasic from "../../components/with-repo-basic";

export const Issues = ({ text }) => {
  return <span>Issues,{text}</span>;
};

Issues.getInitialProps = async () => {
  return {
    text: 1123
  };
};

export default withRepoBasic(Issues, "issues");
