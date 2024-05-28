import mongoose from 'mongoose'
import Attendance from '../models/Attendance.js'
import Subject from '../models/Subject.js'
import { ErrorResponse } from '../utils/errors.js'

export const index = async (req, res, next) => {
    try {
        const attendance = await Attendance.aggregate([
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
                $match: {
                    $or: [
                        { 'subject.students': { $in: [new mongoose.Types.ObjectId(req.user._id)] } },
                        { 'subject.teacher': new mongoose.Types.ObjectId(req.user._id) }
                    ]
                }
            },
            {
                $addFields: {
                    'user_present': {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(req.user._id), '$present_students'] },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        ])

        return res.json({ data: attendance })
    } catch (error) {
        next(error)
    }
}

export const show = async (req, res, next) => {

}

export const store = async (req, res, next) => {
    const session = await mongoose.connection.startSession()
    try {
        session.startTransaction()
        const { subject_id, name, deadline } = req.body

        const subject = await Subject.findOne({ _id: subject_id }, {}, { session: session })

        if (!subject)
            throw new ErrorResponse(404, 'Subject ID not found!')

        if (subject.teacher != req.user._id)
            throw new ErrorResponse(403, 'Unauthorized!')

        const attendance = await Attendance.create([{
            subject: subject_id,
            teacher: req.user._id,
            name: name,
            deadline: deadline,
            present_students: []
        }], { session: session })

        await session.commitTransaction()

        return res.status(200).json({ message: 'Record created!' })
    } catch (error) {
        console.log(error)
        await session.abortTransaction()
        next(error)
    } finally {
        session.endSession()
    }
}

export const update = async (req, res, next) => {
    const session = await mongoose.connection.startSession()
    try {
        session.startTransaction()
        const { id } = req.params.id
        const { name, deadline } = req.body

        const attendance = await Attendance.findOneAndUpdate(
            { _id: id },
            { name: name, deadline: deadline },
            { session: session }
        )

        if (!attendance)
            throw new ErrorResponse(404, 'Subject ID not found!')

        if (attendance.value.teacher != req.user._id)
            throw new ErrorResponse(403, 'Unauthorized!')

        await session.commitTransaction()

        return res.status(200).json({ message: 'Record created!' })
    } catch (error) {
        await session.abortTransaction()
        next(error)
    } finally {
        session.endSession()
    }
}

export const destroy = async (req, res, next) => {
    const session = await mongoose.connection.startSession()
    try {
        session.startTransaction()
        const { id } = req.params.id

        const attendance = await Attendance.findOneAndDelete(
            { _id: id },
            { session: session }
        )

        if (!attendance)
            throw new ErrorResponse(404, 'Subject ID not found!')

        if (attendance.value.teacher != req.user._id)
            throw new ErrorResponse(403, 'Unauthorized action!')

        await session.commitTransaction()

        return res.status(200).json({ message: 'Record created!' })
    } catch (error) {
        await session.abortTransaction()
        next(error)
    } finally {
        session.endSession()
    }
}

export const recordPresent = async (req, res, next) => {
    const session = await mongoose.connection.startSession()
    try {
        session.startTransaction()
        const { id } = req.params
        const userObjectId = new mongoose.Types.ObjectId(req.user._id)
        const attendance = await Attendance.findOne({ _id: id }, {}, { session: session })
        if (!attendance)
            return new ErrorResponse(404, 'Attendance not found')

        const subject = await Subject.aggregate([
            {
                $match: {
                    $and: [
                        { 'students': { $in: [userObjectId] } },
                        { _id: attendance.subject }
                    ]
                }
            }
        ], { session: session })
        if (subject.length == 0)
            throw new ErrorResponse(403, 'Unauthorized action!')

        await Attendance.updateOne({ _id: id }, { $addToSet: { present_students: req.user._id } }, { session: session })

        await session.commitTransaction()

        return res.status(204).json({ message: 'Accepted' })

    } catch (error) {
        await session.abortTransaction()
        next(error)
    } finally {
        session.endSession()
    }
}