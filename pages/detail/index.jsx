import withRepoBasic from "../../components/with-repo-basic";

export const Detail = ({ text }) => {
  return <span>Detail,{text}</span>;
};

Detail.getInitialProps = async () => {
  return {
    text: 1123
  };
};

export default withRepoBasic(Detail, "readme");
