
module.exports = function (RED) {
	function openaiConfigNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.name = config.name;
		node.sshUser = config.sshUser;
		node.sshHost = config.sshHost;
		node.sshPort = config.sshPort;
	}

	RED.nodes.registerType("gpt-engineer-config", openaiConfigNode,{
		credentials: {
			orgId: {type: 'password'},
			apiKey: {type: 'password'},
			sshPassword: {type: 'password'},
		}
	});
}