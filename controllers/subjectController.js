import Subject from '../models/Subject.js'
import mongoose from 'mongoose'

export const index = async (req, res) => {
    const subjects = await Subject.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'teacher',
                foreignField: '_id',
                as: 'teacher'
            }
        },
        {
            $unwind: '$teacher'
        },
        {
            $project: {
                'teacher.password': 0
            }
        }
    ])

    return res.json({ status: 'success', data: subjects })
}

export const show = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new Error('Invalid ID format');
    }

    const id = new mongoose.Types.ObjectId(req.params.id);

    const subject = await Subject.aggregate([
        {
            $match: { _id: id }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'students',
                foreignField: '_id',
                as: 'students'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'teacher',
                foreignField: '_id',
                as: 'teacher'
            }
        },
        {
            $unwind: '$teacher'
        },
        {
            $project: {
                'teacher.password': 0,
                'students.password': 0
            }
        }
    ])
    return res.json({ status: 'success', data: subject })
}

export const store = async (req, res) => {
    const name = req.body.name
    const subject = new Subject({
        name: name,
        teacher: req.user._id
    })

    await subject.save();
    return res.json({ status: 'success', data: subject });
}

export const update = async (req, res) => {
    const { name } = req.body
    const subject = await Subject.updateOne({ _id: req.params.id }, { $set: { name: name } })

    if (subject.matchedCount == 1)
        return res.status(201).json({ message: 'Record updated.' })
}

export const destroy = async (req, res) => {

}

export const enroll = async (req, res) => {

    try {

        const id = req.params.id

        const subject = await Subject.updateOne({ _id: id }, {
            $addToSet: {
                students: req.user._id
            }
        })

        return res.status(204).json({ 'message': 'Accepted' })
    } catch (error) {
        return res.status(500).json(error)
    }
}