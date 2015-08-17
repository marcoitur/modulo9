var models = require('../models/models.js');

var statistics =
    {
    quizes: 0,
    comments: 0,
    commentsUnpublished: 0,
    commentedQuizes: 0
    };

var errors = [];

exports.calculate = function (req, res, next)
    {
    models.Quiz.count()			// Pide número de preguntas
    .then(function (numQuizes)		// da el número de preguntas
	{ // número de preguntas
	statistics.quizes = numQuizes;	// guardar valor
	return models.Comment.count();	// pide el número de comentarios
	})
    .then(function (numComments)
	{ // número de comentarios totales
	statistics.comments = numComments;
	return models.Comment.countUnpublished();
	})
    .then(function (numUnpublished)
	{ // número de comentarios sin publicar
	statistics.commentsUnpublished = numUnpublished;
	return models.Comment.countCommentedQuizes();
	})
    .then(function (numCommented)
	{ // número de preguntas con comentario
	 statistics.commentedQuizes = numCommented;
	// Fin de peticiones
	// return models.countUnCommentedQuizes();
	})
    .catch(function (err) { errors.push(err); })
    .finally(function () { next(); });
};


exports.listar = function(req, res)
    {
    res.render('estadisticas', { statistics: statistics, errors:[] })
    };
