export const response = (res, statusCode, message, data = null) => {
  if (!res) {
    console.log("Response object is null");
  }
  const responsiveObject = {
    status: statusCode < 400 ? "success" : "error",
    message,
    data,
  };
  return res.status(statusCode).json(responsiveObject);
};
