import NoteModel from "./note.model.js";

export default class NoteMongoRepository {
    async save(noteEntity) {
        const note = new NoteModel({
            title: noteEntity.title,
            content: noteEntity.content,
            imageUrl: noteEntity.imageUrl,
            isPrivate: noteEntity.isPrivate,
            password: noteEntity.password,
            userId: noteEntity.userId
        });
        const savedNote = await note.save();
        return savedNote.toObject();
    }

    async findByUserId(userId) {
        return await NoteModel.find({ userId });
    }

    async findById(id) {
        const note = await NoteModel.findById(id);
        return note ? note.toObject() : null;
    }

    async update(id, data) {
        const note = await NoteModel.findByIdAndUpdate(id, data, { new: true });
        return note ? note.toObject() : null;
    }

    async delete(id) {
        const note = await NoteModel.findByIdAndDelete(id);
        return note ? true : null;
    }
}