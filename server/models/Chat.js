import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    title:{
        type:String,
        default:"New Chat"
    },

    pinned:{
        type:Boolean,
        default:false
    },

    pinnedAt: {
        type: Date,
       default: null
    },

    messages:[
        {
            role:{
                type:String,
                enum:["user","assistant"],
                required:true
            },

            content:{
                type:String,
                required:true
            },

            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
},
{
    timestamps:true
}
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;