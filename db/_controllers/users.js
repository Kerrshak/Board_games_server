const {fetchUsers} = require('../_models/users')

exports.getUsers = (res) => {
    return fetchUsers()
    .then((body) => res.status(200).send({users: body.rows}))
}