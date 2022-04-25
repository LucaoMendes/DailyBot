const express = require('express')
const schedule = require('node-schedule')
const { Telegraf ,Scenes, session, Markup} = require('telegraf')
const { enter , leave } = Scenes.Stage
const routes = require('./routes')
const { scenes } = require('./scenes')



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





// const confirmacao = Markup.keyboard([
//     Markup.button.callback("Sim",'s'),
//     Markup.button.callback('Não','n'),
//     Markup.button.callback('Ae','a')
// ])

// bot.telegram.sendMessage(1388607278,"Salve",confirmacao)

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => sendCommand(ctx,'start'))
const stage = new Scenes.Stage(scenes)
bot.use(session())
bot.use(stage.middleware())
bot.command('commands',ctx => sendCommand(ctx,'commands') )
bot.command('tasks',ctx => sendCommand(ctx,'tasks'))
bot.command('newtask',enter('createTaskWizard'))
bot.command('seemytasks',ctx => sendCommand(ctx,'seemytasks'))

bot.on('text',ctx=> whatDidUSay(ctx,sendMessageTo))



bot.launch()


//schedule.scheduleJob("Teste","* * * * *",() => console.log("OXEEEEEEE"))
//console.log(schedule.scheduledJobs)


async function sendCommand(ctx,command){
    let verified = await isVerified(ctx,sendMessageTo)
    if(verified){
        mensagem = await loading(ctx)
        ctx.msgId = mensagem.message_id
        switch(command){
            case 'start':
                registerChat(ctx,sendMessageTo)
            break;
            case 'tasks':
                seeMyTasks(ctx,sendMessageTo)
            break;
            case 'commands':
                seeMyCommands(ctx,sendMessageTo)
            break;
        }
    }
}

async function loading(ctx){
    return await bot.telegram.sendMessage(ctx.message.from.id,"Carregando... 🤯")
}

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