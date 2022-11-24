class ListMessages {
    constructor(body, button, categories, header = null, footer = null) {
        this.type = "list";
        this.body = {
            text: body
        };

        const sections = categories.map((category, catIndex) => {
            const rows = category.options.map((option, optIndex) => ({
                id: `${catIndex}_${optIndex}`,
                title: option.title,
                description: option.description
            }))

            return {
                title: category.title,
                rows
            }
        })

        this.action = {
            button,
            sections
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

module.exports = ListMessages;