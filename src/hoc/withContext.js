import Context from "./context";

const withContext = (WrappedComponent) => {
  const WithHoc = (props) => {
    return (
      <Context.Consumer>
        {(context) => <WrappedComponent {...props} context={context} />}
      </Context.Consumer>
    );
  };
  return WithHoc;
};

export default withContext;
