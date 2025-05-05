export const jwt = () => {
    if (!process.env.JWT_TOKEN) {
        throw new Error(
            "Jiddiy xatolik, JWT_TOKEN o'zgaruvchisi aniqlanmagan!",
        );
    }
};
