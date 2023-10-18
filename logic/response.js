const {setMsgContext, getMsgContext} = require("./sharedInFlow");

module.exports.response = (RED, node, msg, cliResponse) => {
    let log = getMsgContext(node, msg, 'communicationLog');

    setMsgContext(node, msg, 'communicationLog', `${log}\n${cliResponse}`);
}
