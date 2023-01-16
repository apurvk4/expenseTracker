const errorCodes = {
    1: "InternalError",
    2: "BadValue",
    4: "NoSuchKey",
    6: "HostUnreachable",
    8: "UnknownError",
    11: "UserNotFound",
    13: "Unauthorized",
    18: "AuthenticationFailed",
    53: "InvalidIdField",
    54: "NotSingleValueField",
    56: "EmptyFieldName",
    57: "DottedFieldName",
    60: "DatabaseNotFound",
    65: "MultipleErrorsOccurred",
    84: "DuplicateKeyValue",
    89: "NetworkTimeout",
    11000: "DuplicateKey",
  };
  module.exports = errorCodes;
  