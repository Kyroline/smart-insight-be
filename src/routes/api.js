import { Router } from 'express'

import * as Storage from '../controllers/storageController.js'

import * as Auth from '../controllers/authController.js'
import * as Assignment from '../controllers/assignmentController.js'
import * as Discussion from '../controllers/discussionController.js'
import * as Reply from '../controllers/replyController.js'
import * as Subject from '../controllers/subjectController.js'
import * as Submission from '../controllers/submissionController.js'
import * as Material from '../controllers/materialController.js'
import * as Attendance from '../controllers/attendanceController.js'

import * as Middleware from '../middlewares/index.js'

import multer from 'multer'

import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage })

const router = Router()

router.post('/upload', upload.single('file'), Storage.uploadFile)

router.post('/auth/login', Auth.login)
router.post('/auth/register', Auth.register)
router.get('/auth/validate', Middleware.authMiddleware, Auth.validate)

router.get('/assignments/students', Middleware.authMiddleware, Assignment.getAsStudent)
router.get('/assignments/teachers', Middleware.authMiddleware, Assignment.getAsTeacher)
router.get('/assignments/:id/students', Middleware.authMiddleware, Assignment.getAsStudent)
router.get('/assignments/:id/teachers', Middleware.authMiddleware, Assignment.getAsTeacher)
router.get('/assignments', Middleware.authMiddleware, Assignment.index)
router.get('/assignments/:id', Middleware.authMiddleware, Assignment.show)
router.post('/assignments', Middleware.authMiddleware, Assignment.store)
router.put('/assignments/:id', Middleware.authMiddleware, Assignment.update)
router.delete('/assignments/:id', Middleware.authMiddleware, Assignment.destroy)

router.post('/discussions/:id/score', Middleware.authMiddleware, Discussion.score)
router.delete('/discussions/:id/score', Middleware.authMiddleware, Discussion.deleteScore)
router.get('/discussions', Middleware.authMiddleware, Discussion.index)
router.get('/discussions/:id', Middleware.authMiddleware, Discussion.show)
router.post('/discussions', Middleware.authMiddleware, Discussion.store)
router.put('/discussions/:id', Middleware.authMiddleware, Discussion.update)
router.delete('/discussions/:id', Middleware.authMiddleware, Discussion.destroy)

router.post('/replies/:id/score', Middleware.authMiddleware, Reply.score)
router.delete('/replies/:id/score', Middleware.authMiddleware, Reply.deleteScore)
router.get('/replies', Middleware.authMiddleware, Reply.index)
router.get('/replies/:id', Middleware.authMiddleware, Reply.show)
router.post('/replies', Middleware.authMiddleware, Reply.store)
router.put('/replies/:id', Middleware.authMiddleware, Reply.update)
router.delete('/replies/:id', Middleware.authMiddleware, Reply.destroy)

router.get('/subjects', Middleware.authMiddleware, Subject.index)
router.get('/subjects/:id', Middleware.authMiddleware, Subject.show)
router.post('/subjects', Middleware.authMiddleware, Subject.store)
router.put('/subjects/:id', Middleware.authMiddleware, Subject.update)
router.delete('/subjects/:id', Middleware.authMiddleware, Subject.destroy)
router.post('/subjects/:id/enroll', Middleware.authMiddleware, Subject.enroll)
router.post('/subjects/:id/unenroll', Middleware.authMiddleware, Subject.unenroll)
router.get('/subjects/:id/check_status', Middleware.authMiddleware, Subject.checkStatus)

router.get('/submissions', Middleware.authMiddleware, Submission.index)
router.get('/submissions/:id', Middleware.authMiddleware, Submission.show)
router.post('/submissions', Middleware.authMiddleware, Submission.store)
router.put('/submissions/:id', Middleware.authMiddleware, Submission.update)
router.delete('/submissions/:id', Middleware.authMiddleware, Submission.destroy)

router.get('/materials', Middleware.authMiddleware, Material.index)
router.get('/materials/:id', Middleware.authMiddleware, Material.show)
router.post('/materials', Middleware.authMiddleware, Material.store)
router.put('/materials/:id', Middleware.authMiddleware, Material.update)
router.delete('/materials/:id', Middleware.authMiddleware, Material.destroy)

router.get('/attendances', Middleware.authMiddleware, Attendance.index)
router.get('/attendances/:id', Middleware.authMiddleware, Attendance.show)
router.post('/attendances', Middleware.authMiddleware, Attendance.store)
router.put('/attendances/:id', Middleware.authMiddleware, Attendance.update)
router.delete('/attendances/:id', Middleware.authMiddleware, Attendance.destroy)
router.post('/attendances/:id/present', Middleware.authMiddleware, Attendance.recordPresent)

export default router