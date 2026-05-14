const logger = require('../utils/logger');
function notFound(req,res){ res.status(404).json({error:'Not found'}); }
function errorHandler(err,req,res,next){ logger.error(err); if(res.headersSent) return next(err); res.status(err.status || 500).json({error:err.message || 'Internal error'}); }
module.exports = { notFound, errorHandler };
