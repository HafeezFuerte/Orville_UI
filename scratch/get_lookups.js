const http = require('https');

function getAttachments(filterText1) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      typeId: 34,
      filterId: 0,
      filterText: 'workorder',
      filterText1: filterText1,
      userId: 1,
      clientId: '74BB6922',
      companyId: 1
    });

    const options = {
      hostname: 'orville.pulseadmin.in',
      path: '/api/Masters/_getMasters',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'clientID': '74BB6922',
        'source': 'web',
        'languageid': '1'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          filterText1,
          status: res.statusCode,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  try {
    const res1 = await getAttachments('FC4510D');
    console.log('--- Querying with FC4510D ---');
    console.log('Status:', res1.status);
    console.log('Result:', JSON.stringify(res1.body, null, 2));

    const res2 = await getAttachments('9');
    console.log('--- Querying with 9 ---');
    console.log('Status:', res2.status);
    console.log('Result:', JSON.stringify(res2.body, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
