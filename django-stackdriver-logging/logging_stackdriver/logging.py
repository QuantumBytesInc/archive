import logging
import os
import traceback
from google.cloud import logging as logging_gce

class Logging(logging.Handler):
    def __init__(self):
        logging.Handler.__init__(self)
        logging_client = logging_gce.Client()
        log_name = os.environ.get("APP", "") + '-' + os.environ.get("APP_ENVIRONMENT", "")
        self.logger = logging_client.logger(log_name)

    def emit(self, record):
        # instantiate the model
        self.format(record)
        
        try:
          if hasattr(record, 'request'):
              self.logger.log_struct({
                  'message': str(record.message),
                  'exc_info': str(traceback.format_exc()),
                  'stack_info': str(record.stack_info),
                  'funcName': str(record.funcName),
                  'lineno': str(record.lineno),
                  'module': str(record.module),
                  'filename': str(record.filename),
                  'pathname': record.pathname,
                  'session': record.request.session.session_key,
                  'meta': str(record.request.META),
                  'path': record.request.path,
                  'method': record.request.method,
                  'user': record.request.user.username,
                  'environment': os.environ.get("APP_ENVIRONMENT", ""),
              }, severity=record.levelname)
          else:
              self.logger.log_struct({
                  'message': str(record.message),
                  'exc_info': str(traceback.format_exc()),
                  'stack_info': str(record.stack_info),
                  'funcName': str(record.funcName),
                  'lineno': str(record.lineno),
                  'module': str(record.module),
                  'filename': str(record.filename),
                  'pathname': record.pathname,
                  'environment': os.environ.get("APP_ENVIRONMENT", ""),
              }, severity=record.levelname)
        except:
              # TODO: Write to another log
              pass
        return
