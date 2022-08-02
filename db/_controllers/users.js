const {fetchUsers} = require('../_models/users')

exports.getUsers = (req, res) => {
    return fetchUsers()
    .then((body) => res.status(200).send({users: body.rows}))
}