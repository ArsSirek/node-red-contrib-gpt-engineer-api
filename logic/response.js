const {setMsgContext, getMsgContext} = require("./sharedInFlow");
const {executeACommand} = require("./utils");

module.exports.response = (node, msg, payload) => {
    const send = (word) => {
        node.send({
            ...msg,
            payload: word,
        });
    }

    const stream = getMsgContext(node, msg, payload.uniqueID, 'stream');
    const forceCloseRef = getMsgContext(node, msg, payload.uniqueID, 'forceCloseRef');
    console.log('forceCloseRef', forceCloseRef);
    console.log('stream', stream);

    if (forceCloseRef.current) {
        forceCloseRef.current();
    }
    executeACommand(stream, payload.value, send, forceCloseRef);
}
