const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};
export const sendCustomResponse = (body: unknown, statusCode: number) => {
  console.log('Successfully finished');
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
};

export const sendError = (error: Error, statusCode = 500) => {
  console.log(`Error: ${error.message}`);
  return {
    statusCode,
    headers,
    body: JSON.stringify({
      message: error.message || 'Something wrong, try again',
    }),
  };
};
