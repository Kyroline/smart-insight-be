import mongoose from "mongoose"
import Assignment from "../models/Assignment.js"
import Submission from '../models/Submission.js'
import Subject from "../models/Subject.js"
import { ErrorResponse } from "../utils/errors.js"

export const index = async (req, res, next) => {
    try {
        user_id = new mongoose.Types.ObjectId(req.user._id)

        const submission = Submission.aggregate([
            {
                $lookup: {
                    from: 'assignments',
                    localField: 'assignment',
                    foreignField: '_id',
                    as: 'assignment'
                }
            },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'assignment.teacher',
                    foreignField: '_id',
                    as: 'assignment.subject'
                }
            },
            {
                $addFields: {
                    'teached_subject': {
                        $cond: {
                            if: { $match: { '$teacher': user_id } },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $match: {
                    $or: [
                        { 'student': { $in: [new mongoose.Types.ObjectId(req.user._id)] } },
                        // { 'teacher._id': new mongoose.Types.ObjectId(req.user._id) }
                    ]
                }
            }
        ])
    } catch (error) {
        next(error)
    }
}

export const show = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}

export const store = async (req, res, next) => {
    try {
        const { assignment_id, description, attachments } = req.body

        if (!mongoose.Types.ObjectId.isValid(assignment_id))
            throw new ErrorResponse(404, 'Assignment ID not found!')

        const assignment = await Assignment.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(assignment_id) }
            },
            {
                $lookup: {
                    from: 'subjects',
                    let: { subject_id: '$subject', user_id: new mongoose.Types.ObjectId(req.user._id) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$subject_id'] },
                                        { $in: ['$students', '$$user_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'subject',
                }
            },
            {
                $unwind: '$subject'
            }
        ])

        if (assignment.length < 1)
            throw new ErrorResponse(403, 'Unauthorized action!')

        const submission = await Submission.create([
            {
                assignment: assignment_id,
                description: description,
                attachments: attachments,
            }
        ])

        res.status(204).json({ status: 'success', data: submission[0].toJSON() })
    } catch (error) {
        next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const { assignment_id, description, attachments } = req.body
        const submission_id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(assignment_id))
            throw new ErrorResponse(404, 'Assignment ID not found!')

        const assignment = await Assignment.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(assignment_id) }
            },
            {
                $lookup: {
                    from: 'subjects',
                    let: { subject_id: '$subject', user_id: new mongoose.Types.ObjectId(req.user._id) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$subject_id'] },
                                        { $in: ['$students', '$$user_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'subject',
                }
            },
            {
                $unwind: '$subject'
            }
        ])

        if (assignment.length < 1)
            throw new ErrorResponse(403, 'Unauthorized action!')

        const submission = await Submission.findOneAndUpdate(
            { _id: submission_id },
            {
                assignment: assignment_id,
                description: description,
                attachments: attachments,
            }
        )
        if (!submission)
            throw new ErrorResponse(404, 'Submission ID not found!')

        res.status(201).json(null)
    } catch (error) {
        next(error)
    }
}

export const destroy = async (req, res, next) => {
    try {
        const submission = await Submission.deleteOne({ _id: req.params.id, student: req.user._id })

        if (submission.deletedCount == 0)
            throw new ErrorResponse(404, 'Submission ID not found!')

        return res.status(201).json(null)
    } catch (error) {
        next(error)
    }
}