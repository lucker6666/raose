module.exports = {
  // authorization
  USER_NOT_LOGIN:[1001,'require login'],
  INVALID_TOKEN:[1002,'Invalid or expired token'],
  AUTHENTICATE_ERROR:[1003,'Could not authenticate you'],
  NOT_AUTHORIZED:[1004,'Sorry, you are not authorized to do the action'],
  
  // argument
  ARG_MISSED:[2001,'arg missed'],
  ARG_WRONG_TYPE:[2002,'wrong type of argument'],
  
  // none existed
  NOT_EXIST:[4001,'does not exist'],
  NOT_SUPPORT_API:[4002,'do not support this API'],
  NOT_SUPPORT_FORMAT:[4003,'do not support this format']
  
  // other  
  INTERNAL_ERROR:[5000,'sorry, internal error'],
  API_VERSION_WRONG:[5001,'this version of API is no longer active'],
  LIMIT_EXCEEDED:[5002,'Rate limit exceeded'],
  OVER_CAPACITY:[5003,'Over capacity'],
  ON_MATAINANCE:[5004,'sorry, site is on mantainance']
};