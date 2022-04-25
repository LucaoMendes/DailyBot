const ChatController = require('../controllers/ChatsController')


module.exports = {
    async registerChat(ctx,sendMessage){
        result = await ChatController.store(ctx.message.from)
        first_name = ctx.message.from.first_name
        if(!result.success){
            msg = {
                user: ctx.message.from.id,
                msg: `Olá ${first_name},\n a nossa conversa já foi iniciada!`,
                msgId: ctx.msgId,
                extra: {
    
                },
            }
        }else{
            msg = {
                user: ctx.message.from.id,
                msg: `Seja bem vindo ${first_name}\n`
                    +`a nossa conversa foi iniciada com sucesso!`,
                msgId: ctx.msgId,
                extra: {
    
                },
            }
        }
        sendMessage(msg)
    },
    async whatDidUSay(ctx,sendMessage){
       msg = {
            user: ctx.message.from.id,
            msg: "Não entendi nada do que você falou =(\n"
                +"Envie /commands para saber tudo o que eu posso fazer 😝",
            extra: {

            },
        }
        sendMessage(msg)
    },
    async seeMyCommands(ctx,sendMessage){
        msg = {
            user: ctx.message.from.id,
            msg: "Todos os comandos que eu atendo: \n"
                + "/tasks Para visualizar suas tarefas agendadas\n"
                + "Por enquanto eu ainda sou muito burro, mas vou melhorar prometo!",
            msgId: ctx.msgId,
            extra: {

            }
            
        }
        sendMessage(msg)
        
    },
    async seeMyTasks(ctx,sendMessage){
        thisUserTasks = await ChatController.getMyTasksByTelegram(ctx.message.from.id)
        if(thisUserTasks.success)
            if(thisUserTasks.tasks.length > 0){
                console.log(thisUserTasks.tasks)

                message = `Olá ${ctx.message.from.first_name},\n`
                + `Você tem ${thisUserTasks.tasks.length} tarefas comigo em!\n`
                + `Não vá vacilar\n\n`
                msg = {
                    user: ctx.message.from.id,
                    msg: message,
                    msgId: ctx.msgId,
                    extra: {
                        parse_mode: 'HTML'
                    }
                    
                }
                sendMessage(msg)

                thisUserTasks.tasks.forEach(task => {
                    console.log(task)

                    message = `Nome: <b>${task.name}</b>\nDescrição:<b>${task.description}</b>\n`
                            +  `${task.config.repeat?"Repetitivo":"Uma única Vez"}\n`
                            +  `${task.config.repeatConfig == 'min' ? `A cada ${task.config.repeatAfter} minuto${task.config.repeatAfter>1?'s':''}\n`:''}`
                            +  `${task.config.repeatConfig == 'hour' ? `A cada ${task.config.repeatAfter} hora${task.config.repeatAfter>1?'s':''}\n`:''}`
                            +  `${task.config.repeatConfig == 'this_hour' ? `Às ${task.config.this_hour.hours}:${task.config.this_hour.minutes}\n`:''}`
                            +  `${task.config.scheduledAt.date != null ? `Somente no dia ${task.config.scheduledAt.date}/${task.config.scheduledAt.month} às ${task.config.scheduledAt.hours}:${task.config.scheduledAt.minutes}\n`:''}`
                            + `\n`
                            msg = {
                                user: ctx.message.from.id,
                                msg: message,
                                extra: {
                                    parse_mode: 'HTML'
                                }
                                
                            }
                            sendMessage(msg)
                })
            }else{
                msg = {
                    user: ctx.message.from.id,
                    msg: `Olá ${ctx.message.from.first_name},\n`
                        + `Você ainda não tem nenhuma atividade registrada 🥲\n`
                        + `Adicione uma agora mesmo! /createtask`,
                    msgId: ctx.msgId,
                    extra: {
                        
                    }
                    
                }
                sendMessage(msg)
            }
        else    
            console.log("ERRO: ",thisUserTasks.error)
        
        
    },
    async createTask(ctx,sendMessage){

    },
    async isVerified(ctx,sendMessage){
        let hasChat = await ChatController.getChat(ctx.message.from)
        first_name = ctx.message.from.first_name
        if(!hasChat.success && hasChat.error == 0){
            msg = {
                user: ctx.message.from.id,
                msg: `Olá ${first_name}\n`
                    +`Você é novo por aqui não é? Gostaria de começar a conversar comigo?😌\n`
                    +`Se sim me envia um /start`,
                extra: {
    
                },
            }
            sendMessage(msg)
            return false
        }
        return true
        
    }
    
}   