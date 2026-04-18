import NoteModel from './note.model.js';

export default class NoteMongoRepository {
  async create(noteEntity) {
    const note = new NoteModel({
            content: noteEntity.content,
            title: noteEntity.title,
            imageUrl: noteEntity.imageUrl,
            isPrivate: noteEntity.isPrivate,
            password: noteEntity.password,
            userid: noteEntity.userid,
    });

    const savedNote = await note.save();
        return savedNote.toObject();
    }

    async findByUserId(userId) {
        return await NoteModel.find({ userid: userId });
    }
}