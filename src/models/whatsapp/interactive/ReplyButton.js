class ReplyButtons {
    constructor(body, buttons, header = null, footer = null) {
        this.type = "button";
        this.body = {
            text: body
        };

        let buttonArray = buttons.map((buttonName, index) => ({
            type: "reply",
            reply: {
                id: `${buttonName}_${index}`,
                title: buttonName
            }
        }));

        this.action = {
            buttons: buttonArray
        }

        if(header) {
            this.header = {
                type: "text",
                text: header
            }
        }

        if(footer) {
            this.footer = {
                text: footer
            }
        }
    }
}

module.exports = ReplyButtons;