import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check empty fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required"
      });
    }

    // Find user
   
    console.log("Login Email:", email);

    const user = await User.findOne({ email });

    console.log("User Found:", user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    // Compare password

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and New Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const getChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ userId })
      .sort({
          pinned:-1,
          pinnedAt:-1,
          updatedAt:-1
      });

    const formattedChats = chats.map(chat => ({

      _id: chat._id,

      title:
        chat.title ||

        (chat.messages.length > 0
          ? chat.messages[0].content
          : "New Chat"),

      messages: chat.messages,

      updatedAt: chat.updatedAt,

      pinned:chat.pinned

    }));

  res.status(200).json({

    success: true,

    chats: formattedChats

  });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearChats = async (req, res) => {
  try {
    const { userId } = req.params;

    await Chat.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Chat history cleared"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      success: true,
      message: "Chat deleted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const renameChat = async (req, res) => {
  try {

    const { chatId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found"
      });
    }

    chat.title = title.trim();

    await chat.save();

    res.status(200).json({
      success: true,
      message: "Chat renamed successfully",
      chat
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

export const togglePinChat = async (req, res) => {

    try{

        const { chatId } = req.params;

        const chat = await Chat.findById(chatId);

        if(!chat){

            return res.status(404).json({
                message:"Chat not found"
            });

        }

        if (chat.pinned) {

            chat.pinned = false;
            chat.pinnedAt = null;

        } else {

            chat.pinned = true;
            chat.pinnedAt = new Date();

        }
        
        await chat.save({
          timestamps: false
        });

        res.status(200).json({

            success:true,

            updatedAt: chat.updatedAt,
            pinned:chat.pinned

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"

        });

    }

};