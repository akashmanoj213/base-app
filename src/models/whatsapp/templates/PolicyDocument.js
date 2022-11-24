class IssueResolution {
    constructor(customerName, mediaId) {
        this.name = "policy_document";
        this.language = {
            code: 'en'
        };
        
        this.components = [
            {
                type: "header",
                parameters: [
                    {
                        type: "document",
                        document: {
                            id: mediaId,
                            filename: `${customerName}_policy`
                        }
                    }
                ]
            },
            {
                type: "body",
                parameters: [
                    {
                        type: "text",
                        text: customerName
                    }
                ]
            }
        ]
    }
}

module.exports = IssueResolution;