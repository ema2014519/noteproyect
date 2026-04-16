export default class NodeController {
    constructor(noteService) {
        this.noteService = noteService;
    }
    createNode = async (req, res) => {
        const noteData = req.body;
        if (req.file) noteData.imageurl = '/uploads/' + req.file.filename;
        noteData.userid = 'user_123';
        try {
            const newNote = await this.noteService.createNote(noteData);
            res.status(201).json(newNote);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    getNotesbyUserId = async (req, res) => {
        const userId = 'user_123';
        try {
            const notes = await this.noteService.getNoteByUser(userId);
            res.status(200).json(notes);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

