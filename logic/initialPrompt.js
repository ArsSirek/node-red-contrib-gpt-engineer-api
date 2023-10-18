const {setMsgContext} = require("./sharedInFlow");

module.exports.initialPrompt = async (RED, node, msg, prompt) => {
    setMsgContext(node, msg,'communicationLog', prompt);

}
