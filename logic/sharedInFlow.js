
const getMsgMap = (node, msg, flowId) => {
    const context = node.context().flow;
    if (!context.get(flowId)) {
        context.set(flowId, new Map());
    }
    return context.get(flowId);
}

module.exports.getMsgContext = (node, msg, flowId, key) => {
    const context = getMsgMap(node, msg, flowId);

    return context.get(key);
}

module.exports.setMsgContext = (node, msg, flowId, key, value) => {
    const context = getMsgMap(node, msg, flowId);

    return context.set(key, value);
}


module.exports.clearMsgContext = (node, msg, flowId) => {
    node.context().set(flowId, undefined);
}
