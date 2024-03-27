const express = require('express');
const HomeController = require('../controllers/HomeController');
const PlaylistController = require('../controllers/PlaylistController');
const TutorController = require('../controllers/TutorController');
const BookmarkController = require('../controllers/BookmarkController');
const auth = require('../middleware/auth');
const CommentController = require('../controllers/CommentController');
const LikeController = require('../controllers/LikeController');
const ContactController = require('../controllers/ContactController');
const router = express.Router();



//home page route
router.get('/', auth, HomeController.index)
router.get('/home',auth,  HomeController.index)
router.get('/about',auth,  HomeController.about)
router.get('/courses',auth,  HomeController.courses)
router.get('/search_course',auth,  PlaylistController.searchCourse)
// router.get('/search_tutor', auth,  TutorController.search)
router.get('/teachers', auth, HomeController.teachers)

router.get('/contact', auth,  ContactController.index)
router.post('/contact', auth,  ContactController.store)


router.get('/bookmark', auth ,  BookmarkController.index)

router.get('/likes', auth,  HomeController.like)
router.get('/likes/store', auth,  LikeController.store)
router.get('/likes/update/:video_id', auth,  LikeController.updateLike)

router.get('/comments', auth,  CommentController.index)
router.get('/comments/edit/:comment_id', auth,  CommentController.edit)
router.get('/comments/delete/:comment_id', auth,  CommentController.delete)
router.post('/comments/update', auth,  CommentController.update)
router.post('/comments/store', auth,  CommentController.store)

router.get('/watch/:video_id', auth,  PlaylistController.watchVideo)

router.get('/playlist/:playlist_id', auth,  PlaylistController.index)

router.post('/playlist/save', auth,  PlaylistController.savePlaylist)


router.get('/tutor-profile/:tutor_id', auth,  TutorController.profile)
router.get('/search_tutor', auth,  TutorController.search)



module.exports = router;