import Discussion from '../models/Discussion.js';
import Reply from '../models/Reply.js'
import mongoose from 'mongoose';
import ReplyScore from '../models/ReplyScore.js';
import { connection } from '../database/mongodb.js'

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
                $lookup: {
                    from: 'replyscores',
                    let: { reply_id: '$_id', user_id: new mongoose.Types.ObjectId(req.user._id) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$reply', '$$reply_id'] },
                                        { $eq: ['$user', '$$user_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'matchedScores'
                }
            },
            {
                $unwind: { path: '$matchedScores', preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    'score': {
                        $cond: {
                            if: { $ne: ['$matchedScores', {}] },
                            then: '$matchedScores.score',
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    'user.password': 0,
                    'matchedScores': 0
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
                $lookup: {
                    from: 'replyscores',
                    let: { reply_id: '$_id', user_id: new mongoose.Types.ObjectId(req.user._id) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$reply', '$$reply_id'] },
                                        { $eq: ['$user', '$$user_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'matchedScores'
                }
            },
            {
                $unwind: { path: '$matchedScores', preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    'score': {
                        $cond: {
                            if: { $ne: ['$matchedScores', {}] },
                            then: '$matchedScores.score',
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    'user.password': 0,
                    'matchedScores': 0
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
    const session = await mongoose.connection.startSession()
    try {
        session.startTransaction()
        const reply = await Reply.create({
            discussion: discussion_id,
            parent: parent_id ?? null,
            user: req.user._id,
            content: content,
            replyCount: 0,
            dislike: 0,
            like: 0
        }, { session })

        const discussion = await Discussion.updateOne({ _id: discussion_id }, { $inc: { replyCount: 1 } }, { session })
        const parentReply = await Reply.updateOne({ _id: parent_id }, { $inc: { replyCount: 1 } }, { session })

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json({ message: 'Success', data: reply })
    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json(error)
    }
}

export const update = async (req, res) => {

}

export const destroy = async (req, res) => {

}

export const score = async (req, res) => {
    const session = await mongoose.connection.startSession()
    try {
        session.startTransaction()
        const { id } = req.params
        const { score } = req.body

        await ReplyScore.updateOne(
            { reply: id, user: req.user._id },
            { $set: { score: score } },
            { upsert: true, session: session }
        )

        await session.commitTransaction()
        session.endSession()
        return res.sendStatus(204)
    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json(error)
    }
}