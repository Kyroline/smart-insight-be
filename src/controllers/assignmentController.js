import mongoose from "mongoose"
import Assignment from "../models/Assignment.js"
import Subject from "../models/Subject.js"
import { ObjectId } from "mongodb"
import { ErrorResponse } from "../utils/errors.js"

export const index = async (req, res) => {
    try {
        const assignment = await Assignment.aggregate([
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            {
                $unwind: '$subject'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'subject.teacher',
                    foreignField: '_id',
                    as: 'subject.teacher'
                }
            },
            {
                $lookup: {
                    from: 'submissions',
                    localField: '_id',
                    foreignField: 'assignment',
                    as: 'submissions'
                }
            },
            {
                $unwind: '$subject.teacher'
            },
            {
                $lookup: {
                    from: 'submission',
                    let: { assignment_id: '$_id', user_id: new mongoose.Types.ObjectId(req.user._id) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$assignment', '$$assignment_id'] },
                                        { $eq: ['$user', '$$user_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'submission',
                }
            },
            {
                $unwind: { path: '$submission', preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    'submission_count': { $size: '$submissions' }
                }
            },
            {
                $match: {
                    $or: [
                        { 'subject.teacher._id': new mongoose.Types.ObjectId(req.user._id) },
                        { 'subject.students': { $in: [new mongoose.Types.ObjectId(req.user._id)] } }
                    ]
                }
            },
            {
                $project: {
                    'subject.teacher.password': 0,
                    'subject.students': 0,
                    'submissions': 0
                }
            }
        ])

        return res.status(200).json({ data: assignment })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const show = async (req, res, next) => {
    try {
        const assignment = await Assignment.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
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
                $unwind: '$subject'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'subject.teacher',
                    foreignField: '_id',
                    as: 'subject.teacher'
                }
            },
            {
                $lookup: {
                    from: 'submissions',
                    localField: '_id',
                    foreignField: 'assignment',
                    as: 'submissions'
                }
            },
            {
                $unwind: '$subject.teacher'
            },
            {
                $lookup: {
                    from: 'submission',
                    let: { assignment_id: '$_id', user_id: new mongoose.Types.ObjectId(req.user._id) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$assignment', '$$assignment_id'] },
                                        { $eq: ['$user', '$$user_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'submission',
                }
            },
            {
                $unwind: { path: '$submission', preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    'submission_count': { $size: '$submissions' }
                }
            },
            {
                $match: {
                    $or: [
                        { 'subject.teacher._id': new mongoose.Types.ObjectId(req.user._id) },
                        { 'subject.students': { $in: [new mongoose.Types.ObjectId(req.user._id)] } }
                    ]
                }
            },
            {
                $project: {
                    'subject.teacher.password': 0,
                    'subject.students': 0,
                    'submissions': 0
                }
            }
        ])

        return res.status(200).json({ data: assignment[0] })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const store = async (req, res) => {
    const session = await mongoose.connection.startSession()
    try {
        session.startTransaction()
        const { subject_id, name, description, deadline, attachments, max_score } = req.body
        const subject = await Subject.findOne({ _id: subject_id })

        if (!subject)
            throw new Error('Subject ID not found!')

        if (subject.teacher != req.user._id)
            throw new Error('Forbidden')

        const assignment = await Assignment.create([{
            subject: subject_id,
            name: name,
            description: description,
            deadline: deadline,
            attachments: attachments,
            max_score: max_score,
        }], { session: session })


        await Subject.updateOne({ _id: subject_id }, { $inc: { assignment_count: 1 } }, { session: session })
        
        await session.commitTransaction()
        await session.endSession()

        return res.status(200).json(assignment.toJSON())
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()

        return res.status(500).json(error)
    }
}

export const update = async (req, res) => {

}

export const destroy = async (req, res) => {

}

export const getAsStudent = async (req, res, next) => {
    try {
        const pipeline = []

        if (req.params.id) {
            pipeline.push({ $match: { _id: ObjectId.createFromHexString(req.params.id) } })
        }

        if (req.query.subject) {
            pipeline.push({ $match: { subject: ObjectId.createFromHexString(req.query.subject) } })
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            {
                $unwind: '$subject'
            },
            {
                $match: { 'subject.students': { $in: [new mongoose.Types.ObjectId(req.user._id)] } }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'subject.teacher',
                    foreignField: '_id',
                    as: 'subject.teacher'
                }
            },
            {
                $unwind: '$subject.teacher'
            },
            // {
            //     $lookup: {
            //         from: 'submissions',
            //         localField: '_id',
            //         foreignField: 'assignment',
            //         as: 'submission'
            //     }
            // },
            {
                $lookup: {
                    from: 'submissions',
                    let: { assignment_id: '$_id', user_id: new mongoose.Types.ObjectId(req.user._id) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$assignment', '$$assignment_id'] },
                                        { $eq: ['$student', '$$user_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'submission',
                }
            },
            {
                $unwind: { path: '$submission', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    'subject.teacher.password': 0,
                    'subject.students': 0,
                }
            }
        )

        const assignment = await Assignment.aggregate(pipeline)

        return res.status(200).json({ data: req.params.id ? assignment[0] : assignment })
        // return res.status(200).json({ data: assignment })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getAsTeacher = async (req, res, next) => {
    try {
        const pipeline = []

        if (req.params.id) {
            pipeline.push({ $match: { _id: ObjectId.createFromHexString(req.params.id) } })
        }

        if (req.query.subject) {
            pipeline.push({ $match: { subject: ObjectId.createFromHexString(req.query.subject) } })
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            {
                $unwind: '$subject'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'subject.teacher',
                    foreignField: '_id',
                    as: 'subject.teacher'
                }
            },
            {
                $unwind: '$subject.teacher'
            },
            {
                $lookup: {
                    from: 'submissions',
                    localField: '_id',
                    foreignField: 'assignment',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'student',
                                foreignField: '_id',
                                as: 'student'
                            }
                        },
                        {
                            $unwind: '$student'
                        },
                        {
                            $project: {
                                'student.password': 0
                            }
                        }
                    ],
                    as: 'submissions'
                }
            },
            {
                $addFields: {
                    'submission_count': { $size: '$submissions' }
                }
            },
            {
                $match: {
                    'subject.teacher._id': new ObjectId(req.user._id)
                }
            },
            {
                $project: {
                    'subject.teacher.password': 0,
                    'subject.students': 0,
                    'submissions.attachments': 0
                }
            }
        )

        const assignment = await Assignment.aggregate(pipeline)

        return res.status(200).json({ data: req.params.id ? assignment[0] : assignment })
    } catch (error) {
        console.log(error)
        next(error)
    }
}