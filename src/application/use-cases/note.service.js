//Altrabajar con nuestros archivos devemos anñadir al final.js
import NoteEntity from "../../domain/entities/note.entity";


export default class NoteService {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }
async createNote(data) {
    if (!noteData.title || !noteData.content) {
      throw new Error('Title and content are required');
    }
    const note = new NoteEntity(data);
    return await this.noteRepository.create(note);
  }
  async getNoteByUser(userId) {
    return await this.noteRepository.findByUserId(userId);
}
}