import Discussion from '../models/Discussion.js'
import mongoose from 'mongoose'

export const index = async (req, res) => {
    const discussion = await Discussion.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'subjects',
                localField: 'subject',
                foreignField: '_id',
                as: 'subject'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $unwind: '$subject'
        },
        {
            $project: {
                'subject.students': 0,
                'user.password': 0
            }
        }
    ])

    return res.json({ message: "Success", data: discussion })
}

export const show = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new Error('Invalid ID format');
        }

        const discussionId = new mongoose.Types.ObjectId(req.params.id);
        const discussion = await Discussion.aggregate([
            {
                $match: {
                    _id: { $eq: discussionId }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $unwind: '$subject'
            },
            {
                $project: {
                    'subject.students': 0,
                    'user.password': 0
                }
            },
            {
                $sort: { like: 1 }
            }
        ])

        if (discussion.length == 0)
            return res.status(404).json({ message: 'Discussion ID not found' })

        return res.json({ message: "Success", data: discussion[0] })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const store = async (req, res) => {
    const { subject_id, title, content } = req.body

    const discussion = await Discussion.create({
        subject: subject_id,
        user: req.user._id,
        title: title,
        content: content,
        replyCount: 0,
        dislike: 0,
        like: 0
    })

    let discussionJson = discussion.toJSON()

    return res.json({ message: "Record created succesfully.", data: discussionJson })
}

export const update = async (req, res) => {
    try {
        const { title, content } = req.body

        const updateQuery = { $set: {} };

        if (title) updateQuery.$set.title = title;
        if (content) updateQuery.$set.content = content;

        const discussion = await Discussion.updateOne({ _id: req.params.id }, updateQuery)

        if (discussion.modifiedCount == 1)
            return res.json({ message: 'Record updated succesfully' })
        else
            throw new Error('Record is not updated')
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const destroy = async (req, res) => {

}