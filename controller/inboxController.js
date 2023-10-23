const escape = require("../utilities/escape");
const User = require("../models/People");
const createError = require("http-errors");
const Message = require("../models/MEssages");
const Conversation = require("../models/Conversation");

async function getInbox(req, res, next) {
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.user_id },
        { "participant.id": req.user.user_id },
      ],
    });

    res.locals.data = conversations;
    res.render("inbox");
  } catch (err) {
    console.log(err);
    next(err);
  }
}
const searchUser = async (req, res, next) => {
  const user = req.body.user;

  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery != "") {
      const user = await User.find(
        {
          $or: [
            { name: name_search_regex },
            { mobile: mobile_search_regex },
            { email: email_search_regex },
          ],
        },
        "name avatar"
      );
      res.json(user);
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors: {
        common: { msg: "Internal Server Error" },
      },
    });
  }
};

// add conversation
async function addConversation(req, res, next) {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.user_id,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
      },
    });

    const result = await newConversation.save();

    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}
const getMessages = async (req, res) => {
  try {
    const message = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: { message: message, participant },
      user: req.user.user_id,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ errors: { common: { msg: "Invernal Server Error" } } });
  }
};

const sendMessage = async (req, res, next) => {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      let attachments = null;
      if (req.files && req.files.length > 0) {
        attachments = [];
        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.user_id,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();
      console.log(result);
      // emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.user_id,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

      res.status(200).json({
        message: "Successful !",
        data: result,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: { common: { msg: err.message } },
      });
    }
  } else {
    res.status(500).json({
      errors: { common: { msg: " message text or attachment is required " } },
    });
  }
};
module.exports = {
  getInbox,
  searchUser,
  sendMessage,
  getMessages,
  addConversation,
};
