import mongoose from "mongoose"
import Assignment from "../models/Assignment.js"
import Subject from "../models/Subject.js"

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
                $addFields: {
                    'subject.student_count': { $size: '$subject.students' },
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

export const show = async (req, res) => {
    try {

    } catch (error) {

    }
}

export const store = async (req, res) => {
    try {
        const { subject_id, name, description, deadline } = req.body
        const subject = await Subject.findOne({ _id: subject_id })

        if (!subject)
            throw new Error('Subject ID not found!')

        if (subject.teacher != req.user._id)
            throw new Error('Forbidden')

        const assignment = new Assignment({
            subject: subject_id,
            name: name,
            description: description,
            deadline: deadline
        })

        await assignment.save()

        return res.status(200).json(assignment.toJSON())
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const update = async (req, res) => {

}

export const destroy = async (req, res) => {

}

export const getAsStudent = async (req, res) => {
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
                $unwind: '$subject.teacher'
            },
            {
                $match: {
                    $or: [
                        // { 'subject.teacher._id': new mongoose.Types.ObjectId(req.user._id) },
                        { 'subject.students': { $in: [new mongoose.Types.ObjectId(req.user._id)] } }
                    ]
                }
            },
            {
                $project: {
                    'subject.teacher.password': 0,
                    'subject.students': 0,
                }
            }
        ])

        return res.status(200).json({ data: assignment })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getAsTeacher = async (req, res) => {
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
                $addFields: {
                    'subject.student_count': { $size: '$subject.students' },
                    'submission_count': { $size: '$submissions' }
                }
            },
            {
                $match: {
                    $or: [
                        { 'subject.teacher._id': new mongoose.Types.ObjectId(req.user._id) },
                        // { 'subject.students': { $in: [new mongoose.Types.ObjectId(req.user._id)] } }
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