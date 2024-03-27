const db = require('../app/db');
const Bookmark = require('../model/Bookmark');
const Comment = require('../model/Comment');
const Content = require('../model/Content');
const Like = require('../model/Like');
const Playlist = require('../model/Playlist');
const Tutor = require('../model/Tutor');
const Controller = require('./Controller');

class HomeController extends Controller {

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async index(req, res) {

        const get_playlist = await Playlist.where('status', 'active')
            .orderBy('date')
            .limit(6)
            .get();

        const playlists = await Promise.all(get_playlist.map(async (list) => {
            const tutor = await Tutor.find(list.tutor_id)
            return {
                ...list,
                tutor
            }
        }))

        const user_id = res.locals?.user_id || '';
        const total_like = await Like.where('user_id', user_id).count();
        const total_comment = await Comment.where('user_id', user_id).count();
        const total_bookmarked = await Bookmark.where('user_id', user_id).count();

        res.render('home', { playlists, total_like, total_comment, total_bookmarked })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async about(req, res) {

        // const like = await Like.where('user_id', user_id).count();
        const getPlaylist = await Playlist.where('status', 'active')
            .orderBy('date')
            .limit(6)
            .get();


        const playlistPromise = getPlaylist.map(async function (row) {
            const tutor = await Tutor.where('id', row.tutor_id).first();
            return {
                ...row,
                tutor: tutor,
            }
        })

        const playlist = await Promise.all(playlistPromise);

        res.render('about', {
            playlist: playlist
        })
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async courses(req, res) {
        // const like = await Like.where('user_id', user_id).count();
        const getPlaylist = await Playlist.where('status', 'active')
            .orderBy('date')
            .limit(6)
            .get();


        const playlistPromise = getPlaylist.map(async function (row) {
            const tutor = await Tutor.where('id', row.tutor_id).first();
            return {
                ...row,
                tutor: tutor,
            }
        })

        const playlist = await Promise.all(playlistPromise);

        res.render('courses', { playlist })
    }


    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async teachers(req, res) {

        const get_tutors = await db.query('SELECT * FROM  tutors;');
        const tutors = get_tutors.rows;
        const teachers = await Promise.all(tutors.map(async (tutor) => {
            const total_playlists = await Playlist.where('tutor_id', tutor.id).count();
            const total_videos = await Content.where('tutor_id', tutor.id).count();
            const total_comments = await Comment.where('tutor_id', tutor.id).count();
            const total_likes = await Like.where('tutor_id', tutor.id).count();
            return {
                ...tutor,
                total_playlists,
                total_videos,
                total_comments,
                total_likes,
            }
        }))

        return res.render('teachers', { teachers })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async bookmark(req, res) {
        const user_id = res.locals?.user?.id || '';
        //get bookmark from database
        const allBookmark = await Bookmark.where('user_id', user_id).get();

        const bookmarksPromise = allBookmark.map(async function (row) {

            const allPlaylist = await Playlist.where({
                'id': row.playlist_id, status: 'active'
            }).orderBy('date').get();

            const playlistPromise = await allPlaylist.map(async function (item) {

                const tutor = Tutor.where('id', item.tutor_id).first();

                return {
                    ...item,
                    tutor: tutor,
                }
            })

            const playlists = await Promise.all(playlistPromise);

            return {
                ...row,
                playlists: playlists
            }
        });

        const bookmarks = await Promise.all(bookmarksPromise)

        res.render('bookmark', {
            bookmarks: bookmarks,
        })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async like(req, res) {
        const user_id = res.locals?.user?.id || '';

        const query = await Like.where('user_id', user_id).all();
        const likes = await Promise.all(query.map(async (item) => {
            const content = await Content.find(item.content_id);
            const tutor = await Tutor.find(item.tutor_id);
            return {
                ...item,
                content,
                tutor
            }
        }))
        return res.render('likes', {
            likes: likes,
        })
    }
}

module.exports = HomeController