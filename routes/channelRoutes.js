let { Router } = require('express');
let router = Router();
let Con = require('../db/connectToDB/connectToDB');
let verify = require('./verifyUser');

router.post('/makeChannel', verify, async (req, res) => {
    let { id } = req.user;
    let { server_id, createdAt, name } = req.body
    Con.query('SELECT leader_id FROM Servers WHERE id = (?)', [server_id], (err, result) => {
        if (err) { return res.status(400).send(err).end() }
        let { leader_id } = result[0];
        if (id !== leader_id) { return res.status(401).send('Only server\'s leaders can create channels') }

        Con.query('INSERT INTO Channels (server_id, name, createdAt) VALUES (?, ?, ?)', [server_id, name, createdAt],
            (err, result) => {
                if (err) { return res.status(400).send('there is a problem in creating a new channel !') }
                res.status(201).send({
                    results: {
                        response: 'Handeled make new channel request',
                        newChannel: {
                            name,
                            id: result.insertId
                        }
                    }
                })
            })
    })

})

router.get('/getChannels', verify, async (req, res) => {
    let { server_id } = req.body;

    Con.query('SELECT id, name FROM Channels WHERE server_id = (?)', [server_id], (err, channels) => {
        if (err) { return res.status(400).send('There is a problem on retreiving channels from db').end() }
        res.status(200).send({
            results: {
                response: 'Handeled get server\'s channels request',
                channels
            }
        })
    })
})


module.exports = router;