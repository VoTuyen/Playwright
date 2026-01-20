// data/data.js
const testCases = [
    {
        phone: '0974303989',
        client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
        type: 'login_fpl',
        expectedStatus: '1',
        expectedMsg: "Success"
    },
    {
        phone: '0971234567',
        client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
        type: 'login_fpl',
        expectedStatus: '0',
        expectedMsg: "Failure" 
    },
    
];

export default testCases;