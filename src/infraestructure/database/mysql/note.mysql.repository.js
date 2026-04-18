import NoteModel from './note.mysql.model.js';

export default class NoteMySQLRepository {
    async create(noteEntity) {
        const note = await NoteModel.create({
            title: noteEntity.title,
            content: noteEntity.content,
            imageUrl: noteEntity.imageUrl,
            isPrivate: noteEntity.isPrivate,
            password: noteEntity.password,
            userid: noteEntity.userid
        });

        return note.toJSON();
    }

    async findByUserId(userId) {
        return await NoteModel.findAll({ where: { userid: userId } });
    }
}