
import endpoints from '../data/apiEndpoints.js';

export async function get_benefitUser(request, authToken, platform) {

    const response = await request.get(endpoints[platform].fetch_user_benefit, {
        headers: {
            //'X-DID': '10:39:4E:A8:85:32',
            'Authorization': authToken
        }
    })
    return await response.json()
}

export async function package_screen(request, authToken, platform) {

    const response = await request.get(endpoints[platform].package, {  
        headers: {
            'Authorization': authToken
        }
    })
    return await response.json()
}