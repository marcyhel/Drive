const HttpStatusCode = {
 OK: 200,
 BAD_REQUEST: 400,
 UNAUTHORIZED: 401,
 FORBIDDEN: 403,
 NOT_FOUND: 404,
 INTERNAL_SERVER: 500,
 SERVICE_UNAVAILABLE: 503
}

class BaseError extends Error {
 service;
 httpCode;
 isOperational;
 object;
 
 constructor(service, message, object, httpCode, isOperational) {
   super(message);
   // Object.setPrototypeOf(this, new.target.prototype);
   
   this.object = object;
   this.service = service;
   this.httpCode = httpCode;
   this.isOperational = isOperational;
 
   Error.captureStackTrace(this);
 }
}

class AuthenticationError extends BaseError {
 constructor(service, message = 'Not authenticated user', object ={}, httpCode = HttpStatusCode.UNAUTHORIZED, isOperational = true) {
   super(service,message, object, httpCode, isOperational);
 }
}

class AuthorizationError extends BaseError {
 constructor(service, message = 'Not authorized user', object ={}, httpCode = HttpStatusCode.FORBIDDEN, isOperational = true) {
   super(service,message, object, httpCode, isOperational);
 }
}

class BadRequestError extends BaseError {
 constructor(service, message = 'Missing or wrong parameters', object ={}, httpCode = HttpStatusCode.BAD_REQUEST, isOperational = true) {
   super(service,message, object, httpCode, isOperational);
 }
}

class MissingHeaderError extends BaseError {
 constructor(service, message = 'Missing Header', object ={}, httpCode = HttpStatusCode.BAD_REQUEST, isOperational = true) {
   super(service,message, object, httpCode, isOperational);
 }
}

class AppVersionError extends BaseError {
 constructor(service, message = 'Wrong App Version', object={}, httpCode = HttpStatusCode.BAD_REQUEST, isOperational = true) {
   super(service,message, object, httpCode, isOperational);
 }
}

class MaintenanceError extends BaseError {
 constructor(service, message = 'System under maintenance', object ={}, httpCode = HttpStatusCode.SERVICE_UNAVAILABLE, isOperational = true) {
   super(service,message, object, httpCode, isOperational);
 }
}

module.exports = {BaseError, AuthenticationError, AuthorizationError, BadRequestError,MissingHeaderError,AppVersionError,MaintenanceError};
