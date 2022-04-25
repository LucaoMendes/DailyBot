const { text } = require("express")
const { Scenes, Composer  , Markup } = require("telegraf")
const TaskController = require("../../controllers/TaskController")
const ChatsController = require('../../controllers/ChatsController')
const { enter , leave } = Scenes.Stage
const { Stage , WizardScene  } = Scenes


const taskName = new Composer()
const taskDescription = new Composer()
const taskScheduledAt = new Composer()
const taskTimeConfiguration = new Composer()
const taskConfirmation = new Composer()

const createTaskWizard = new WizardScene('createTaskWizard',
    async ctx => {
        chat = await ChatsController.getChat(ctx.message.from)
        if(chat.success)
            chat = chat.hasChat
        ctx.reply("Qual será o nome da tarefa?\n")
        ctx.wizard.next()
    },
    taskName,
    taskDescription,
    taskScheduledAt,
    taskTimeConfiguration,
    taskConfirmation,
)

createTaskWizard.command('exit',leave())
taskName.command('newtask',ctx => ctx.reply("Você já está criando uma tarefa!"))

taskName.on('text',async ctx =>{
    task_name = ctx.message.text

    
    if(task_name.length < 2){
        ctx.reply("Esse nome tá muito pequeno, tenta um maior!")
    }else{
        
        task = {
            chat_id : chat.id,
            name : task_name,
            description : null,
            config :{
                repeat : null,
                repeatConfig : null,
                repeatAfter : null,
                scheduledAt : {
                    date : null,
                    month : null,
                    year : null,
                    hours : null,
                    minutes : null
                },
                active : null,
                this_hour: {
                    hours: null,
                    minutes : null,
                }
            }
        }
        ctx.replyWithMarkdown(`Perfeito\!\nAgora qual a descrição dessa atividade?`)
        ctx.wizard.next()
    }
})
taskName.use(ctx => ctx.reply("O que você tá tentando fazer comigo em? 😵"))


const menuRepeticao = Markup.inlineKeyboard([
    Markup.button.callback("Repetitivos",'repeat'),
    Markup.button.callback("Data Especifica",'today'),
    //Markup.button.callback("Desativado",'d'),
])


taskDescription.on('text',ctx => {
    task_description = ctx.message.text

    if(task_description.length < 2){
        ctx.reply("Economizou na descrição em? Tenta um pouco mais caprichado!")
    }else{
        task.description = task_description
        ctx.replyWithMarkdown(`Perfeito\!\nComo vão ser os alertas dessa tarefa?`,menuRepeticao)
        ctx.wizard.next()
    }
})


const configRepeticao = {
    reply_markup: {
        inline_keyboard: [
            [   {
                    text: 'Minutos',
                    callback_data: 'minutes'
                }, {
                    text: 'Horas',
                    callback_data: 'hours'
                }
            ],
            [
                {
                    text: 'Hora Especifica do dia',
                    callback_data: 'this_hour'
                },
            ]
        ]
    }
}


taskScheduledAt.action('repeat',ctx => {
    task.config.repeat = true
    ctx.editMessageText("Essa tarefa vai se repetir por...",{...configRepeticao,})

})
taskScheduledAt.action('today',ctx => {
    task.config.repeat = false
    task.config.repeatConfig = 'scheduled'

    ctx.editMessageText("Ok, que data eu te aviso? \nManda nesse formato: DD/MM")
})
taskScheduledAt.hears(/(\d{2}\/\d{2})/,ctx =>{
    if(task.config.repeatConfig == 'scheduled'
        && task.config.scheduledAt.date == null){
            date = ctx.match[1].split('/')
            if(date[0] > 0 && date[0] <=31 && date[1] > 0 && date[1] <=12){
                task.config.scheduledAt.date = date[0]
                task.config.scheduledAt.month = date[1]
                ctx.reply("Massa! agora me diz as horas\nManda nesse formato: hh:mm")
                ctx.wizard.next()
            }else
                ctx.reply("Me manda uma data descente!\nManda nesse formato: DD/MM")
        }
})
taskScheduledAt.action('minutes',ctx => {
    task.config.repeatConfig = 'min'
    ctx.editMessageText("Me fala ai, de quantos em quantos minutos te aviso?")
    ctx.wizard.next()
})

taskScheduledAt.action('hours',ctx => {
    task.config.repeatConfig = 'hour'
    ctx.editMessageText("Me fala ai, de quantas em quantas horas te aviso?")
    ctx.wizard.next()
})

taskScheduledAt.action('this_hour',ctx => {
    task.config.repeatConfig = 'this_hour'
    ctx.editMessageText("Me fala ai, a que horas te aviso?\nMe Manda nesse formato *hh:mm*")
    ctx.wizard.next()
})

taskScheduledAt.use(ctx=>{
    ctx.reply("Você sabe oque está fazendo?")
})


taskScheduledAt.action('today',ctx => {
    ctx.reply("Horarios Fixos né?",menuTempo)
})
taskScheduledAt.action('d',ctx => {
    ctx.reply("Sem Alarme?",menuTempo)
})


const menuConfirmar = Markup.inlineKeyboard([
    Markup.button.callback("Perfeito!",'perfect'),
    Markup.button.callback("Cancelar",'cancel'),
    //Markup.button.callback("Desativado",'d'),
])
taskTimeConfiguration.hears(/(\d{2}:\d{2})/,ctx=>{
    if(task.config.repeatConfig == 'this_hour'){    
        hour = ctx.match[1].split(':')
        if(hour[0] >= 0 && hour[0] <= 23 && hour[1] >=0 && hour[1] <= 59){
            task.config.this_hour.hours = hour[0]
            task.config.this_hour.minutes = hour[1]
            message = "Massa! a tarefa tá quase pronta\n"
            + "Confere se tá tudo certinho e me confirma:\n"
            + `Tarefa: *${task.name}*\n`
            + `Se repete todo os dias às *${task.config.this_hour.hours}:${task.config.this_hour.minutes}*`
            ctx.replyWithMarkdown(message,menuConfirmar)
            ctx.wizard.next()
        }else{
            console.log(ctx.match[1])
            ctx.reply("Cara, bota uma horinha certa ai vai")
        }
    }

    if(task.config.repeatConfig == 'scheduled'){
        hour = ctx.match[1].split(':')
        if(hour[0] >= 0 && hour[0] <= 23 && hour[1] >=0 && hour[1] <= 59){
            task.config.scheduledAt.hours = hour[0]
            task.config.scheduledAt.minutes = hour[1]
            message = "Massa! a tarefa tá quase pronta\n"
            + "Confere se tá tudo certinho e me confirma:\n"
            + `Tarefa: *${task.name}*\n`
            + `Dia ${task.config.scheduledAt.date} Mês ${task.config.scheduledAt.month} `
            +` às *${task.config.scheduledAt.hours}:${task.config.scheduledAt.minutes}*`
            ctx.replyWithMarkdown(message,menuConfirmar)
            ctx.wizard.next()
        }else{
            console.log(ctx.match[1])
            ctx.reply("Cara, bota uma horinha certa ai vai")
        }
    }
})
taskTimeConfiguration.hears(/(\d+)/,ctx=>{
    time = ctx.match[1]
    if(task.config.repeatConfig == 'min'){
        if(time > 0 && time <= 60){
            
            task.config.repeatAfter = time

            message =`Massa! A tarefa tá quase pronta\n`
                +`Confere se tá tudo certinho e me confirma:\n`
                +`Tarefa: *${task.name}*\n`
                +`Descrição: *${task.description}*\n`
                +`Se repete a cada *${task.config.repeatAfter} minuto${task.config.repeatAfter>1?'s':''}*\n`
                
                ctx.replyWithMarkdown(message,menuConfirmar)
                ctx.wizard.next()
        }else{
            ctx.reply("Você tem que botar um tempo válido em minutos,\nque seja maior que 0 e menor que 60🌚")
        }
    }
    if(task.config.repeatConfig == 'hour'){
        if(time > 0 && time <= 24){
            task.config.repeatAfter = time
            message = `Massa! A tarefa tá quasssse pronta\n`
                    +`Confere se tá tudo certinho e me confirma:\n`
                    +`Tarefa: *${task.name}*`
                    +`Se repete a cada *${task.config.repeatAfter} hora${task.config.repeatAfter>1?'s':''}*`


            ctx.replyWithMarkdown(message,menuConfirmar)
            ctx.wizard.next()
        }else{
            ctx.reply("Você tem que botar um tempo válido em horas,\nque seja maior que 0 e menor que 24🌚")
        }
    }
})


taskTimeConfiguration.use(ctx => {
    if(task.config.repeatConfig == 'min')
        ctx.reply("Você tem certeza que me enviou o tempo correto?\nTenta de novo com um valor de 1 a 60")
    if(task.config.repeatConfig == 'hour')
        ctx.reply("Você tem certeza que me enviou o tempo correto?\nTenta de novo com um valor de 1 a 24")
    if(task.config.repeatConfig == 'this_hour')
        ctx.reply("Você tem certeza que me enviou a hora correta?\nTenta de novo com um valor assim: hh:mm")
})

taskConfirmation.action('perfect',ctx => {
    ctx.editMessageText("Prontinho, tarefa criada com sucesso!\nVocê pode verificar todas as tarefas em /seemytasks")
    console.log(task)
    TaskController.store(task)
    ctx.scene.leave()
})

taskConfirmation.action('cancel',ctx => {
    ctx.editMessageText("A tarefa foi excluída.")
    ctx.scene.leave()
})

const precoHandler = new Composer()
precoHandler.hears(/(\d+)/,ctx=>{
    preco = ctx.match[1]
    ctx.reply("é pra pagar que dia")
    ctx.wizard.next()
})

precoHandler.use(ctx=> ctx.reply('Somente números'))
const dataHandler = new Composer()
dataHandler.hears(/(\d{2}\/\d{2}\/\d{4})/,ctx =>{
    data = ctx.match[1]
    ctx.reply(`Preço:${preco}\nData:${data}\nConfirma?`,confirmacao)
    ctx.wizard.next()
})
dataHandler.use(ctx=> ctx.reply('Somente Data DD/MM/YYY'))


const confirmacaoHandler = new Composer()
confirmacaoHandler.action('s',ctx => {
    ctx.reply("Compra Confirmada")
    ctx.scene.leave()
})
confirmacaoHandler.action('n',ctx => {
    ctx.reply("Compra Excluida")
    ctx.scene.leave()
})
confirmacaoHandler.use(ctx=>ctx.reply("Apenas Confirme",confirmacao))
const wizardCompra = new WizardScene('compra',
    ctx => {
        ctx.reply('O que você comprou?')
        ctx.wizard.next()
    },
    ctx => {
        descricao = ctx.update.message.text
        ctx.reply('Quanto foi?')
        ctx.wizard.next()
    },
    precoHandler,
    dataHandler,
    confirmacaoHandler
)
module.exports = {
    createTaskWizard
}

