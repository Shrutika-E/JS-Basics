// productsList.spec.js
const { sendRequest, navigateToUrl } = require('./common');

describe('Products List API', () => {
    it('API 1: GET All Products List', async () => {
        const url = navigateToUrl('/productsList');
        const response = await sendRequest({ method: 'GET', url });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('products');
    });

    it('API 2: POST To All Products List', async () => {
        const url = navigateToUrl('/productsList');
        const response = await sendRequest({ method: 'POST', url });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('This request method is not supported.');
    });
});
