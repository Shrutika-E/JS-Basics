// getUserDetailByEmail.spec.js
const { sendRequest, navigateToUrl } = require('./common');

describe('Get User Account Detail By Email API', () => {
    it('API 14: GET user account detail by email', async () => {
        const url = navigateToUrl('/getUserDetailByEmail');
        const response = await sendRequest({ method: 'GET', url, params: { email: 'newuser@email.com' } });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('user');
    });
});
