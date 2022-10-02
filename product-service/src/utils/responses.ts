const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};
// eslint-disable-next-line @typescript-eslint/ban-types
export const sendCustomResponse = (body: Object, statusCode: number) => {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
};

export const sendError = (error: Error, statusCode = 500) => {
  return {
    statusCode,
    headers,
    body: JSON.stringify({
      message: error.message || 'Something wrong, try again',
    }),
  };
};
