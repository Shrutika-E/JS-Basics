// searchProduct.spec.js
const { sendRequest, navigateToUrl } = require('./common');

describe('Search Product API', () => {
    it('API 5: POST To Search Product', async () => {
        const url = navigateToUrl('/searchProduct');
        const response = await sendRequest({ method: 'POST', url, data: { search_product: 'top' } });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Bad request, search_product parameter is missing in POST request.');
    });

    it('API 6: POST To Search Product without search_product parameter', async () => {
        const url = navigateToUrl('/searchProduct');
        const response = await sendRequest({ method: 'POST', url });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Bad request, search_product parameter is missing in POST request.');
    });
});
