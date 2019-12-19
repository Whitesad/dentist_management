function json_data(text) {
    const obj = JSON.parse(text);
    if (obj.first_type === "login") {
        return {
            level: 1,
            type: ["login"],
            value: {
                username: obj.username,
                password: obj.password
            }
        };
    }
    if (obj.first_type === "register") {
        if (obj.second_type === "patient") {
            return {
                level: 2,
                type: ["register", "patient"],
                value: {
                    username: obj.username,
                    identity_ID: obj.identity_ID,
                    phone_number: obj.phone_number,
                    avatar: obj.avatar
                }
            };
        }
        if (obj.second_type === "doctor") {
            return {
                level: 2,
                type: ["register", "doctor"],
                value: {
                    username: obj.username,
                    identity_ID: obj.identity_ID,
                    phone_number: obj.phone_number,
                    avatar: obj.avatar,
                    job_number: obj.job_number,
                    ID_photo: obj.ID_photo
                }
            };
        }
    }
}