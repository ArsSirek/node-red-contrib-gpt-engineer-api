

# General note

This node is a wrapper allowing to interact with separate gpt-engineer installation through ssh connection and cli commands.


## Requirements
- your own openai API key
- separate gpt-engineer installation with ssh server (may be on different server form the node-red server)
`docker build -t mygptengineer ./docker/ --load`
`docker-compose up -d`
you can now connect to gpt-engineer with `ssh sshuser@localhost -p 2222`
- or if you are checking connection from docker container `ssh sshuser@gpt-engineer -p 22`

### to run gpt-engineer locally you can now use `docker run -it --rm -e OPENAI_API_KEY="YOUR OPENAI KEY" -v ./your-project:/project gpt-engineer`



## usage
payload.topic - 'prompt' | 'response'
 - `prompt` - means initial prompt to be placed in prompt file that gpt-engineer expects
 - `response` - means that current message is ment as response to gpt-engineer interactive question

payload.value
- in case of topic = prompt, the payload.value should contain the prompt string
- in case of topic = response, the payload.value should contain the cli question text response

payload.projectName
 - string containing unique project name, as the files will be generated on the gpt-engineer server


the out msg should contain the following fields
- payload - string message from gptEngineer
- gptEngineerStatus - string one of  'questionAsked' | 'complete' | 'unexpectedState' | 'timeout'
- - `questionAsked` means that the node expects further communication, string response to the question form payload
- - `complete` means done generating and that the results can be used form the `/projects` path at the gpt-engineer server
- - `timeout` console output is not recognized
- - `unexpectedState` means some error occurred, please contact maintainer with as much logs and details as possible


## SECURITY Note:
- this node is not meant to be used on shared hosting, or shared node-red environments, it may leave openai key in plain text in gpt-engineer server logs as this uses cli to execute gpt-engineer
