import Discussion from '../models/Discussion.js';
import Reply from '../models/Reply.js'
import mongoose from 'mongoose';

export const index = async (req, res) => {
    try {
        const matchQuery = { $match: {} }
        if (req.query.discussion && mongoose.Types.ObjectId.isValid(req.query.discussion))
            matchQuery.$match.discussion = new mongoose.Types.ObjectId(req.query.discussion)
        else
            throw new Error('Discussion ID not found')

        if (req.query.parent && mongoose.Types.ObjectId.isValid(req.query.parent))
            matchQuery.$match.parent = new mongoose.Types.ObjectId(req.query.parent)
        else
            matchQuery.$match.parent = null

        const reply = await Reply.aggregate([
            matchQuery,
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    'user.password': 0
                }
            },
            {
                $sort: { like: 1 }
            }
        ])

        return res.status(200).json({ data: reply })
    } catch (error) {
        return res.status(404).json(error)
    }
}

export const show = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            throw new Error('Discussion ID not found')

        const id = new mongoose.Types.ObjectId(req.params.id);

        const reply = await Reply.aggregate([
            {
                $match: { _id: id }
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
                $unwind: '$user'
            },
            {
                $project: {
                    'user.password': 0
                }
            },
            {
                $sort: { like: 1 }
            }
        ])

        return res.status(200).json({ data: reply })
    } catch (error) {
        return res.status(404).json({ error })
    }
}

export const store = async (req, res) => {
    const { discussion_id, parent_id, content } = req.body
    try {
        const reply = await Reply.create({
            discussion: discussion_id,
            parent: parent_id ?? null,
            user: req.user._id,
            content: content
        })

        const discussion = await Discussion.updateOne({ _id: discussion_id }, { $inc: { replyCount: 1 } })

        return res.status(200).json({ message: 'Success', data: reply })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const update = async (req, res) => {

}

export const destroy = async (req, res) => {

}