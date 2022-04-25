const Chat = require('../models/Chat')



module.exports= {
    async store(ctx){
        const {first_name,last_name,username,} = ctx
        const chat_id = ctx.id
        hasChat = await Chat.findOne({
            where:{chat_id}
        })
        if(hasChat)
            return {success : false, error: 0, msg: 'a conversa já foi iniciada'}
        const chat = await Chat.create({chat_id,first_name,last_name,username})
        return {success : true , chat}
    },
    async getChat(ctx){
        const { id } = ctx
        hasChat = await Chat.findOne({
            where:{chat_id:id}
        })
        if(hasChat)
            return  {success : true , hasChat}
        return  {success : false , error : 0}
    },
    async addByRoute(req,res){
        res.json({hello:'world'})
    },
    async getAllByRoute(req,res){
        chats = await Chat.findAll()

        return res.json(chats)
    },
    async getByRoute(req,res){
        const { id } = req.params
        const chat = await Chat.findByPk(id,{
            include :[
                {
                    association: 'categories',
                },
                {
                    association: 'tasks',
                }
            ],
            attributes:['id','chat_id','username','first_name','last_name']
        }).catch(e=>console.log(e))
        if(!chat)
            return res.status(400).json({error:"Chat Not Found"})
        return res.json({success : true, chat})
    },
    async getThisChatCategories(req,res){
        const { id } = req.params
        const chat = await Chat.findByPk(id,{
            include:{
                association: 'categories'
            },
            attributes: []
        }).catch(e=>console.log(e))
        if(!chat)
            return res.status(400).json({error:"Chat Not Found"})

        categories = chat.categories
        return res.json({success : true,categories})
    },
    async getThisChatTasks(req,res){
        const { id } = req.params
        const chat = await Chat.findByPk(id,{
            include:{
                association: 'tasks'
            },
            attributes: []
        }).catch(e=>console.log(e))
        if(!chat)
            return res.status(400).json({error:"Chat Not Found"})
        tasks = chat.tasks
        return res.json({success : true,tasks})
    },
    async getMyTasksByTelegram(id){
        result = await Chat.findOne({where:{chat_id:id}, 
            include:{
            association: 'tasks'
        },
        attributes: []}
        )
        if(!result)
            return {success : false , error : 'user not found'}

        return {success : true , tasks : result.tasks}

    }
}