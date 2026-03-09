// brandsList.spec.js
const { sendRequest, navigateToUrl } = require('./common');

describe('Brands List API', () => {
    it('API 3: GET All Brands List', async () => {
        const url = navigateToUrl('/brandsList');
        const response = await sendRequest({ method: 'GET', url });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('brands');
    });

    it('API 4: PUT To All Brands List', async () => {
        const url = navigateToUrl('/brandsList');
        const response = await sendRequest({ method: 'PUT', url });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('This request method is not supported.');
    });
});
