// deleteAccount.spec.js
const { sendRequest, navigateToUrl } = require('./common');

describe('Delete User Account API', () => {
    it('API 12: DELETE METHOD To Delete User Account', async () => {
        const url = navigateToUrl('/deleteAccount');
        const response = await sendRequest({ method: 'DELETE', url, data: { email: 'newuser@email.com', password: 'testpass' } });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Bad request, email parameter is missing in DELETE request.');
    });
});
