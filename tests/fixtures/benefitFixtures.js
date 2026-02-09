import endpoints from "../data/apiEndpoints";

export async function fetch_user_benefit(request, authToken, headers) {
    const response = await request.get(endpoints.fetch_user_benefit, {
        headers
    })
    return response.json()
}


export const test = base.extend({
    async headers_with_token({}, use) {
        const header = {
            'X-DID': '10:39:4E:A8:85:32',
            'Authorization': token
        };

        await use(header); // Sử dụng fixture
    }
});

export { expect };