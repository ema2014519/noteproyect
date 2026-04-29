const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    next();
};

export const validateCreateNote = (req, res, next) => {
    const { title, content } = req.body;

    if (!isNonEmptyString(title) || !isNonEmptyString(content)) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    next();
};

export const validateShareNote = (req, res, next) => {
    const { email } = req.body;

    if (!isNonEmptyString(email)) {
        return res.status(400).json({ error: 'Target email is required' });
    }

    next();
};