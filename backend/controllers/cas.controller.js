exports.index = function(req, res) {
	res.sendFile('../public/', 'index.html');
}