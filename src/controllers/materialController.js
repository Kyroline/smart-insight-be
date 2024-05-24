import mongoose from 'mongoose'
import Material from '../models/Material.js'
import { ErrorResponse } from '../utils/errors.js'

export const index = async (req, res) => {
    try {
        const { subject } = req.query
        if (!subject || !mongoose.Types.ObjectId.isValid(subject))
            throw new ErrorResponse(400, 'Subject not found!')

        const subjectId = new mongoose.Types.ObjectId(subject)

        const material = await Material.aggregate([
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subject'
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
                $unwind: '$subject'
            },
            {
                $unwind: '$teacher'
            },
            {
                $match: { 'subject._id': subjectId }
            },
            {
                $project: {
                    'subject.students': 0,
                    'teacher.password': 0
                }
            }
        ])

        return res.status(200).json({ data: material })
    } catch (error) {
        next(error)
    }
}

export const show = async (req, res) => {
    try {

        if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id))
            throw new ErrorResponse(400, 'Subject not found!')

        const materialId = new mongoose.Types.ObjectId(req.params.id)

        const material = await Material.aggregate([
            {
                $match: { _id: materialId }
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
                $lookup: {
                    from: 'users',
                    localField: 'teacher',
                    foreignField: '_id',
                    as: 'teacher'
                }
            },
            {
                $unwind: '$subject'
            },
            {
                $unwind: '$teacher'
            },
            {
                $match: { 'subject._id': subjectId }
            },
            {
                $project: {
                    'subject.students': 0,
                    'teacher.password': 0
                }
            }
        ])

        if (material.length < 1)
            throw new ErrorResponse(404, 'Material not found!')

        return res.status(200).json({ data: material })
    } catch (error) {
        next(error)
    }
}

export const store = async (req, res) => {
    try {
        const { subject_id, name, description, attachments } = req.body

        await Material.create([{
            subject: subject_id,
            teacher: req.user._id,
            name: name,
            description: description,
            attachments: attachments
        }])

        return res.sendStatus(201)
    } catch (error) {
        next(error)
    }
}

export const update = async (req, res) => {

}

export const destroy = async (req, res) => {

}