const axios = require('axios').default;
const FormData = require('form-data');
var multiparty = require("multiparty");

const TextMessage = require('../models/whatsapp/TextMessage');
const PolicyDocumentMessage = require('../models/whatsapp/templates/PolicyDocument');
const ListMessage = require("../models/whatsapp/interactive/ListMessage");
const ReplyButtonMessage = require("../models/whatsapp/interactive/ReplyButton");

const BEARER_TOKEN = process.env.BEARER_TOKEN;

const sendMessage = async (data) => {
    const { type, phoneNumber } = data;

    const request = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber
    }

    switch (type) {
        case "text": {
            const { body, previewUrl } = data;
            const messageObj = new TextMessage(body, previewUrl);
            request["type"] = "text";
            request["text"] = messageObj;
            break;
        }
        case "template": {
            const messageObj = getTemplateMessageObj(data);
            request["type"] = "template";
            request["template"] = messageObj;
            break;
        }
        case "interactive": {
            const messageObj = getInteractiveMessageObj(data);
            request["type"] = "interactive";
            request["interactive"] = messageObj;
            break;
        }
    }

    //Call whatsapp API
    console.log("The constructed request:", JSON.stringify(request));
    try {
        const response = await axios.post('https://graph.facebook.com/v14.0/102719322589708/messages', request, {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        });
        console.log("Whatsapp API response :", response.data);
        return response.data;
    } catch (error) {
        console.log("Error occured while sending request to Whatsapp API: ", error.message);
        throw error;
    }
}

const uploadMedia = (req) => {
    return new Promise((resolve, reject) => {
        var form = new multiparty.Form();

        form.on("part", async (part) => {
            if (part.filename) {
                var form = new FormData();

                form.append("messaging_product", "whatsapp");
                form.append("file", part, { filename: part.filename, contentType: part.headers["content-type"] });

                const response = await axios.post("https://graph.facebook.com/v14.0/102719322589708/media", form, {
                    headers: {
                        ...form.getHeaders(),
                        Authorization: `Bearer ${BEARER_TOKEN}`
                    }
                })

                console.log("Whatsapp API response :", response.data);
                resolve(response.data);
            }
        });

        form.on("error", (error) => {
            console.log("Error occured while uploading media to Whatsapp API", error.message);
            reject(error);
        });

        form.parse(req);
    });
}

const getTemplateMessageObj = (data) => {
    const { name } = data;
    switch (name) {
        case "policy_document":
            const { customerName, mediaId = "899592234333977" } = data;
            return new PolicyDocumentMessage(customerName, mediaId);
    }
}

const getInteractiveMessageObj = (data) => {
    const { subType } = data;
    const { name } = data;
    switch (subType) {
        case "list_message": {
            const { body, button, categories, header, footer } = data;
            return new ListMessage(body, button, categories, header, footer);
        }
        case "reply_button": {
            const { body, buttons, header, footer } = data;
            return new ReplyButtonMessage(body, buttons, header, footer);
        }
    }
}

module.exports = {
    sendMessage,
    uploadMedia
}