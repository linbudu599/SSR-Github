import { withRouter } from "next/router";

const Search = ({ router }) => {
  const { query } = router;
  return <span>Search,{query}</span>;
};
export default withRouter(Search);
