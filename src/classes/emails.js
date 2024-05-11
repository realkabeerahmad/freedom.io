// Example function to retrieve email template from the database
async function getTemplateFromDB(templateId) {
    // Replace this with your actual database query to fetch the template content
    return {
        subject: 'Your Subject',
        html: '<p>Hello $user_name,</p><p>This is your promotional email content.</p>'
    };
}