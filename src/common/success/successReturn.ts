export const SuccessReturn = (customMessage?: String) => {
    const message = "saved successfully"
    return {
        message: customMessage ? customMessage : message
    }
}