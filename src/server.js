const express = require('express')
const { Telegraf } = require('telegraf')
const routes = require('./routes')


const { 
    registerChat, 
    whatDidUSay,
    seeMyCommands,
    seeMyTasks,
    isVerified
 } = require('./services/ChatsServices')


require('dotenv-safe').config()
require('./database')

const app = express()


app.use(express.json())
app.use(routes)
app.listen(80)

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => sendCommand(ctx,'start'))
bot.command('commands',ctx => sendCommand(ctx,'commands') )
bot.command('tasks',ctx => sendCommand(ctx,'tasks'))
bot.command('seemytasks',ctx => sendCommand(ctx,'seemytasks'))
bot.on('inline_query',ctx => console.log(ctx))
bot.on('text',ctx=> whatDidUSay(ctx,sendMessageTo))


bot.launch()




function sendMessageTo(msg){
    if(msg.msgId)
        bot.telegram.editMessageText(msg.user,msg.msgId,"",msg.msg,{
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            ...msg.extra
        }).catch(e=>console.log(e))
    else
        bot.telegram.sendMessage(msg.user,msg.msg,{
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            ...msg.extra
        }).catch(e=>console.log(e))
}

async function sendCommand(ctx,command){
    let verified = await isVerified(ctx,sendMessageTo)
    if(verified)
        switch(command){
            case 'start':
                mensagem = await bot.telegram.sendMessage(ctx.message.from.id,"Carregando... 🤯")
                ctx.msgId = mensagem.message_id
                registerChat(ctx,sendMessageTo)
            break;
            case 'tasks':
                mensagem = await bot.telegram.sendMessage(ctx.message.from.id,"Carregando... 🤯")
                ctx.msgId = mensagem.message_id
                seeMyTasks(ctx,sendMessageTo)
            break;
            case 'commands':
                mensagem = await bot.telegram.sendMessage(ctx.message.from.id,"Carregando... 🤯")
                ctx.msgId = mensagem.message_id
                seeMyCommands(ctx,sendMessageTo)
            break;
        }
}