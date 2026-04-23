import NoteModel from './note.mysql.model.js';

export default class NoteMySQLRepository {
    async save(noteEntity) {
        const note = await NoteModel.create({
            title: noteEntity.title,
            content: noteEntity.content,
            imageUrl: noteEntity.imageUrl,
            isPrivate: noteEntity.isPrivate,
            password: noteEntity.password,
            userId: noteEntity.userId
        });
        return note.toJSON();
    }

    async findByUserId(userId) {
        return await NoteModel.findAll({ where: { userId } });
    }

    async findById(id) {
        const note = await NoteModel.findByPk(id);
        return note ? note.toJSON() : null;
    }

    async update(id, data) {
        const note = await NoteModel.findByPk(id);
        if (!note) return null;
        await note.update(data);
        return note.toJSON();
    }

    async delete(id) {
        const note = await NoteModel.findByPk(id);
        if (!note) return null;
        await note.destroy();
        return true;
    }
}