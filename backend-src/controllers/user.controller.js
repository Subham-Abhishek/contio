const express = require('express');
const User = require('../models/user.model');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let page = +req.query.page || 1;
        let per_page = +req.query.limit || 10;
        let offset = (page - 1) * per_page;

        // console.log(page, per_page);

        let proficiencyQuery = req.body.proficiency;
        let users;
        let totalUsers = 0;
        if (proficiencyQuery) {
            users = await User.find({ proficiency: { $all: proficiencyQuery } }).skip(offset).limit(per_page).lean().exec();
            totalUsers = await User.find({ proficiency: { $all: proficiencyQuery } }).countDocuments();
        }
        else {
            users = await User.find().skip(offset).limit(per_page).lean().exec();
            totalUsers = await User.find().countDocuments();
        }

        const totalPages = Math.ceil(totalUsers / per_page);

        return res.status(200).json({ users, totalPages })
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }
})

router.post('/', async (req, res) => {
    try {
        // console.log(req.body);
        const user = await User.create(req.body);

        return res.status(201).json({ user })
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(rea.params.id, rea.body, { new: true });

        return res.status(200).json({ user })
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(rea.params.id);

        return res.status(200).json({ status: "success" });
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }

})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(rea.params.id).lean().exec();

        return res.status(200).json({ user })
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }

})


module.exports = router;