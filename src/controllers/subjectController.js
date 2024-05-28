import Subject from '../models/Subject.js'
import mongoose from 'mongoose'
import { ErrorResponse } from '../utils/errors.js'

export const index = async (req, res, next) => {
    try {
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
                $match: {
                    $or: [
                        { 'students': { $in: [new mongoose.Types.ObjectId(req.user._id)] } },
                        { 'teacher._id': new mongoose.Types.ObjectId(req.user._id) }
                    ]
                }
            },
            {
                $addFields: {
                    'teached_class': {
                        $cond: {
                            if: { $eq: [new mongoose.Types.ObjectId(req.user._id), '$teacher._id'] },
                            then: true,
                            else: false
                        }
                    },
                    'enrolled_class': {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(req.user._id), '$students'] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    'teacher.password': 0
                }
            }
        ])

        return res.json({ status: 'success', data: subjects })
    } catch (error) {
        next(error)
    }

}

export const show = async (req, res, next) => {
    try {
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
                    localField: 'teacher',
                    foreignField: '_id',
                    as: 'teacher'
                }
            },
            {
                $unwind: '$teacher'
            },
            {
                $match: {
                    $or: [
                        { 'students': { $in: [new mongoose.Types.ObjectId(req.user._id)] } },
                        { 'teacher._id': new mongoose.Types.ObjectId(req.user._id) }
                    ]
                }
            },
            {
                $addFields: {
                    'enrolled_class': {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(req.user._id), '$students'] },
                            then: true,
                            else: false
                        }
                    },
                    'teached_class': {
                        $cond: {
                            if: { $eq: [new mongoose.Types.ObjectId(req.user._id), '$teacher._id'] },
                            then: true,
                            else: false
                        }
                    }
                }
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
                $project: {
                    'teacher.password': 0,
                    'students.password': 0
                }
            }
        ])
        if (subject.length > 0)
            return res.json({ status: 'success', data: subject[0] })

        throw new ErrorResponse(404, 'Subject ID not found')
    } catch (error) {
        next(error)
    }
}

export const store = async (req, res, next) => {
    try {
        const name = req.body.name
        const subject = new Subject({
            name: name,
            teacher: req.user._id
        })

        await subject.save();
        return res.json({ status: 'success', data: subject })
    } catch (error) {
        next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const { name } = req.body
        const subject = await Subject.updateOne({ _id: req.params.id }, { $set: { name: name } })

        if (subject.matchedCount == 1)
            return res.status(201).json({ message: 'Record updated.' })
    } catch (error) {
        next(error)
    }
}

export const destroy = async (req, res) => {

}

export const enroll = async (req, res, next) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const id = req.params.id

        const subject = await Subject.findOneAndUpdate({ _id: id }, {
            $addToSet: {
                students: req.user._id
            },
            $inc: { student_count: 1 }
        }, { session: session })

        if (subject.teacher == req.user._id)
            throw new ErrorResponse(422, `You can't enroll to your own class!`)

        await session.commitTransaction()
        
        return res.status(204).json({ 'message': 'Accepted' })
    } catch (error) {
        await session.abortTransaction()
        next(error)
    } finally {
        session.endSession()
    }
}

export const unenroll = async (req, res, next) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const id = req.params.id

        const subject = await Subject.findOneAndUpdate({ _id: id }, {
            $pull: {
                students: req.user._id
            },
            $inc: { student_count: -1 }
        }, { session: session })

        if (subject.teacher == req.user._id)
            throw new ErrorResponse(422, `You can't enroll to your own class let alone removing yourself from your own class!`)

        await session.commitTransaction()

        return res.status(204).json({ 'message': 'Accepted' })
    } catch (error) {
        await session.abortTransaction()
        next(error)
    } finally {
        session.endSession()
    }
}

export const checkStatus = async (req, res, next) => {
    try {
        const subject_id = new mongoose.Types.ObjectId(req.params.id)
        const user_id = new mongoose.Types.ObjectId(req.user._id)

        const subject = await Subject.aggregate([
            {
                $match: {
                    _id: subject_id,
                    $or: [
                        { teacher: user_id },
                        { students: { $in: [user_id] } }
                    ]
                }
            },
            {
                $addFields: {
                    teached_class: {
                        $cond: {
                            if: { $eq: ['$teacher', user_id] },
                            then: true,
                            else: false
                        }
                    },
                    enrolled_class: {
                        $cond: {
                            if: { $in: [user_id, '$students'] },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        ]);

        if (subject.length < 1)
            throw new ErrorResponse(403, 'Unauthorized Action!')

        return res.status(200).json({ status: 'success', data: subject[0] })
    } catch (error) {
        next(error)
    }
}