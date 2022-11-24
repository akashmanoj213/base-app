const express = require('express');
const router = express.Router();

const { success, error, validation } = require('./util');
const textMessageSchema = require('../../models/schema/textMessage');
const policyDocumentTemplateSchema = require('../../models/schema/policyDocument');
const listMessageSchema = require('../../models/schema/listMessage');
const replyButtonSchema = require('../../models/schema/replyButton');
const { sendMessage, uploadMedia } = require("../../controllers/whatsapp");

router.get('/hello-world', (req, res) => {
    res.status(200).json(success("API is working fine...", res.status));
});

router.post('/send-message', async (req, res) => {
    const { type, subType, name, phoneNumber } = req.body;

    if (!phoneNumber || phoneNumber.length !== 12) {
        return res.status(400).json(error("phoneNumber must be a valid 10 digit string with country code !", res.statusCode));
    }
    if (!type) {
        return res.status(400).json(error('type is required', res.statusCode));
    } else if (type === "interactive" && !subType) {
        return res.status(400).json(error('subType is required', res.statusCode));
    } else if (type === "template" && !name) {
        return res.status(400).json(error('name is required', res.statusCode));
    }

    try {
        const validationError = validateRequest(req.body);

        if (validationError) {
            console.log('Error occured during request validation: ', validationError);
            return res.status(422).json(validation(validationError.message, validationError));
        }

        const response = await sendMessage(req.body);

        return res.status(200).json(success("Message sent successfully", response, res.statusCode));
    } catch (error) {
        console.log('Error occured in /send-message : ', error.message);
        return res.status(500).json(validation(error.message, error));
    }
});

router.post('/upload-media', async (req, res) => {
    try {
        const response = await uploadMedia(req);
        return res.status(200).json(success("Media file uploaded to whatsapp successfully!", response, res.statusCode));

    } catch (error) {
        console.log('Error occured in /upload-mdeia : ', error.message);
        return res.status(500).json(validation(error.message, error));
    }
});

router.post('/webhook', (req, res) => {
    let body = req.body;

  // Check the Incoming webhook message
  console.log("Whatsapp webhook ping: ", JSON.stringify(body, null, 2));
});

router.get('/webhook', (req, res) => {
    //This will be the Verify Token value when you set up webhook
    const verify_token = process.env.VERIFY_TOKEN;

    // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("Whatsapp - WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

const validateRequest = (body) => {
    const { type } = body;
    let validationError = null;

    switch (type) {
        case 'text':
            validationError = textMessageSchema.validate(body).error;
            break;
        case 'template':
            validationError = validateTemplateSchema(body);
            break;
        case 'interactive':
            validationError = validateInteractiveMessageSchema(body);
            break;
        default: throw new Error(`Type - ${type} does not exist !`);
    }

    return validationError;
}

const validateTemplateSchema = (body) => {
    const { name } = body;

    switch (name) {
        case "policy_document":
            return policyDocumentTemplateSchema.validate(body).error;
        default: throw new Error(`Template name - ${name} does not exist !`);
    }
}

const validateInteractiveMessageSchema = (body) => {
    const { subType } = body;

    switch (subType) {
        case "list_message":
            return listMessageSchema.validate(body).error;
        case "reply_button":
            return replyButtonSchema.validate(body).error;
        default: throw new Error(`SubType - ${subType} does not exist !`);
    }
}

module.exports = router;