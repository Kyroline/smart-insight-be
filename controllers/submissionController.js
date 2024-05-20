import mongoose from "mongoose"
import Assignment from "../models/Assignment.js"
import Submission from '../models/Submission.js'
import Subject from "../models/Subject.js"

export const index = async (req, res) => {
    try {
        const submission = Submission.aggregate([
            {
                $lookup: {
                    from: 'assignments',
                    localField: 'assignment',
                    foreignField: '_id',
                    as: 'assignment'
                }
            }
        ])
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const show = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(error)
    }
}

export const store = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(error)
    }
}

export const update = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(error)
    }
}

export const destroy = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json(error)
    }
}