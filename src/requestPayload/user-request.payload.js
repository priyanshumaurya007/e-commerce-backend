
class UserDTO {
    constructor(name, useremail, password) {
        this.name = name;
        this.useremail = useremail;
        this.password = password;
    }

    static fromRequest(req) {
        const { name, useremail, password } = req.body;
        return new UserDTO(name, useremail, password);
    }

    isValid() {
        return !!this.name && !!this.useremail && !!this.password;
    }
}

module.exports = UserDTO;
