const { v4: uuidv4 } = require('uuid');

class Reply {

    #generateID() {
        return uuidv4();
    }

    constructor(text, deletePassword, reported = false) {
        this._id = this.#generateID();
        this.text = text;
        this.delete_password = deletePassword;
        this.created_on = new Date();
        this.reported = reported;
    }

}

module.exports = Reply;