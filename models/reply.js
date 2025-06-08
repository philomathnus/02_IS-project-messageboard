const { v4: uuidv4 } = require('uuid');

class Reply {

    #generateID() {
        return uuidv4();
    }

    constructor(text, deletePassword, reported = false) {
        this.id = this.#generateID();
        this.text = text;
        this.deletePassword = deletePassword;
        this.createdOn = new Date();
        this.reported = reported;
    }

}

module.exports = Reply;