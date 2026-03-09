// verifyLogin.spec.js
const { sendRequest, navigateToUrl } = require('./common');

describe('Verify Login API', () => {
    it('API 7: POST To Verify Login with valid details', async () => {
        const url = navigateToUrl('/verifyLogin');
        const response = await sendRequest({ method: 'POST', url, data: { email: 'valid@email.com', password: 'validpass' } });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    it('API 8: POST To Verify Login without email parameter', async () => {
        const url = navigateToUrl('/verifyLogin');
        const response = await sendRequest({ method: 'POST', url, data: { password: 'validpass' } });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    it('API 9: DELETE To Verify Login', async () => {
        const url = navigateToUrl('/verifyLogin');
        const response = await sendRequest({ method: 'DELETE', url });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('This request method is not supported.');
    });

    it('API 10: POST To Verify Login with invalid details', async () => {
        const url = navigateToUrl('/verifyLogin');
        const response = await sendRequest({ method: 'POST', url, data: { email: 'invalid@email.com', password: 'wrongpass' } });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });
});
