const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const DAYS_BEFORE_VALIDATION_WITHDRAWAL = 15;

const EMAIL = 'video.intervenciones.tfg@gmail.com';

const EMAIL_PASSWORD = 'videotfg'

module.exports = {
    REDIS_URL,
    DAYS_BEFORE_VALIDATION_WITHDRAWAL,
    EMAIL,
    EMAIL_PASSWORD
}