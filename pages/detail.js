const Detail = () => <span>detail</span>;

Detail.getInitialProps = async () => {
  return new Promise(res => {
    setTimeout(() => {
      res({});
    }, 2000);
  });
};

export default Detail;
