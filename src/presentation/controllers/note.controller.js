export default class NoteController {
    constructor(noteService) {
        this.noteService = noteService;
    }

    handleNoteError(res, error) {
        if (error.message === 'Note not found') {
            return res.status(404).json({ error: error.message });
        }

        if (error.message.startsWith('Forbidden:')) {
            return res.status(403).json({ error: error.message });
        }

        return res.status(400).json({ error: error.message });
    }

    createNote = async (req, res) => {
        const data = req.body;
        if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
        data.userId = req.user.id;
        try {
            const note = await this.noteService.createNote(data);
            res.status(201).json(note);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getNotesByUserId = async (req, res) => {
        const userId = req.user.id;
        try {
            const notes = await this.noteService.getNotesByUserId(userId);
            res.status(200).json(notes);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    getNoteById = async (req, res) => {
        const { id } = req.params;
        const { id: currentUserId, role: currentUserRole } = req.user;

        try {
            const note = await this.noteService.getNoteById(id, currentUserId, currentUserRole);
            res.status(200).json(note);
        } catch (error) {
            this.handleNoteError(res, error);
        }
    }

    updateNote = async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const { id: currentUserId, role: currentUserRole } = req.user;
        if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
        try {
            const note = await this.noteService.updateNote(id, data, currentUserId, currentUserRole);
            res.status(200).json(note);
        } catch (error) {
            this.handleNoteError(res, error);
        }
    }

    deleteNote = async (req, res) => {
        const { id } = req.params;
        const { id: currentUserId, role: currentUserRole } = req.user;
        try {
            const result = await this.noteService.deleteNote(id, currentUserId, currentUserRole);
            res.status(200).json(result);
        } catch (error) {
            this.handleNoteError(res, error);
        }
    }

    shareNote = async (req, res) => {
        const { id } = req.params;
        const { email } = req.body;
        const currentUserId = req.user.id;

        if (!email) return res.status(400).json({ error: "Target email is required" });

        try {
            const result = await this.noteService.shareNoteByEmail(id, email, currentUserId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
