import NoteModel from './note.mongo.model.js';
import NoteService from '../../../application/use-cases/note.service.js';

import NoteMongoRepository from './note.mongo.repository.js';

const noteRepository = new NoteMongoRepository();
//const noteService = new NoteService(noteRepository);

const noteService = new NoteService(noteRepository);
const noteController = new NoteController(noteService);

const router = Router();

router.post('/notes', noteController.createNote);
router.get('/notes', noteController.getNotesbyUserId);

export default class NoteMongoRepository {
  async create(noteEntity) {
    const note = new NoteModel({
        constent: noteEntity.content,
        title: noteEntity.title,
        imageUrl: noteEntity.imageUrl,
        isPrivate: noteEntity.isPrivate,
        password: noteEntity.password,
        userid: noteEntity.userid,
    });
    const savedNote = await note.save();
    return  savedNote.toObject();
}
async findByUserId(userId) {
    return await NoteModel.find({ userId });
}
}