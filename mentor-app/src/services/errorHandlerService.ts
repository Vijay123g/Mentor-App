const errorHandlerService = {
    handleError: (operation = 'operation', error: any) => {
      console.error(`${operation} failed: ${error.message}`);
      return Promise.reject(error);
    }
  };
  
  export default errorHandlerService;
  