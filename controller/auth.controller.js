const User = require('../model/user');
const config = require("../config/auth")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



exports.signup = (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        field: req.body.field,
        phoneNumber: req.body.phoneNumber,
        location: req.body.location,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role,
        image: req.body.role === "expert" ? "/uploads" + req.file.filename : null
    });
    user.save((err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: "User was registered successfully!" });
    });
}




exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then((user, err) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password, user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).send({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                field: user.field,
                phoneNumber: user.phoneNumber,
                location: user.location,
                image: user.image,
                accessToken: token
            });
        });
};


exports.getAllUsers = (req, res) => {
    User.find({}, function (err, all) {
        if (err) {
            res.json({ msg: 'wrong' + err })
        } else {
            res.json(all)
        }

    })
};
exports.getOneUsers = (req, res) => {
    User.findOne({ _id: req.params.id }, function (err, one) {
        if (err) {
            res.json({ msg: 'wrong' + err })
        } else {
            res.json(one)
        }
    }

    )
};

exports.update = (req, res) => {
    User.updateOne({ _id: req.params.id }, { $set: req.body }, {
        name: req.body.name,
        email: req.body.email,
        field: req.body.field,
        phoneNumber: req.body.phoneNumber,
        location: req.body.location,
        password: req.body.password,
        role: req.body.role,
        image: req.file.originalname
    },
        function (err) {
            if (err) {
                res.json({ msg: 'wrong' + err })
            } else {
                res.json({ msg: 'User Updated' })
            }

        })

};
exports.deleteUser = (req, res) => {
    User.remove({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ msg: 'wrong' + err })
        } else {
            res.json({ msg: 'User deleted' })
        }

    })
};

exports.searchByName = (req, res) => {
    User.find({ name: new RegExp(req.params.name, 'i') }, function (err, data) {
        if (err) {
            res.json({ msg: 'wrong' + err })
        } else {
            res.json(data)
        }
    })
};

exports.searchByField = (req, res) => {
    User.find({ field: new RegExp(req.params.field, 'i') }, function (err, data) {
        if (err) {
            res.json({ msg: 'wrong' + err })
        } else {
            res.json(data)
        }
    })
};

exports.searchByLocation = (req, res) => {
    User.find({ location: new RegExp(req.params.location, 'i') }, function (err, data) {
        if (err) {
            res.json({ msg: 'wrong' + err })
        } else {
            res.json(data)
        }
    })
};