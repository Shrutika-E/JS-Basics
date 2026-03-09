// createAccount.spec.js
const { sendRequest, navigateToUrl } = require('./common');

describe('Create/Register User Account API', () => {
    it('API 11: POST To Create/Register User Account', async () => {
        const url = navigateToUrl('/createAccount');
        const userData = {
            name: 'Test User',
            email: 'newuser@email.com',
            password: 'testpass',
            title: 'Mr',
            birth_date: '01',
            birth_month: '01',
            birth_year: '2000',
            firstname: 'Test',
            lastname: 'User',
            company: 'TestCo',
            address1: '123 Main St',
            address2: '',
            country: 'India',
            zipcode: '123456',
            state: 'State',
            city: 'City',
            mobile_number: '1234567890'
        };
        const response = await sendRequest({ method: 'POST', url, data: userData });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Bad request, name parameter is missing in POST request.');
    });
});
