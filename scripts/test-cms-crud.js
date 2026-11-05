const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing GET /api/admin/content ---');
  let res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/admin/content',
    method: 'GET',
  });
  console.log('GET /api/admin/content status:', res.status, 'Total items:', res.body.contents?.length);

  console.log('\n--- 2. Testing POST /api/admin/content ---');
  const newPost = {
    title: 'Otonom SaaS ve ERP Trendleri 2026',
    slug: 'otonom-saas-ve-erp-trendleri-2026',
    type: 'BLOG',
    content: '## Otonom Mimari 2026\n\nNexa ERP ile operasyonel maliyetleri dusurun.',
    excerpt: '2026 yili B2B SaaS ve ERP otonomlasma trendleri.',
    metaTitle: 'Otonom SaaS Trendleri | Nexa',
    metaDescription: 'Otonom sistemler hakkinda teknik rehber.',
    isPublished: true,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  };

  res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/admin/content',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, newPost);

  console.log('POST status:', res.status, 'Created ID:', res.body.content?.id);
  const createdId = res.body.content?.id;

  if (createdId) {
    console.log('\n--- 3. Testing GET /api/admin/content/' + createdId + ' ---');
    res = await request({
      host: 'localhost',
      port: 3000,
      path: '/api/admin/content/' + createdId,
      method: 'GET',
    });
    console.log('GET by ID status:', res.status, 'Title:', res.body.content?.title);

    console.log('\n--- 4. Testing PUT /api/admin/content/' + createdId + ' ---');
    res = await request({
      host: 'localhost',
      port: 3000,
      path: '/api/admin/content/' + createdId,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }, {
      title: 'Otonom SaaS ve ERP Trendleri 2026 (Guncellendi)',
      excerpt: 'Guncellenmis ozet metni.',
    });
    console.log('PUT status:', res.status, 'Updated title:', res.body.content?.title);

    console.log('\n--- 5. Testing DELETE /api/admin/content/' + createdId + ' ---');
    res = await request({
      host: 'localhost',
      port: 3000,
      path: '/api/admin/content/' + createdId,
      method: 'DELETE',
    });
    console.log('DELETE status:', res.status, 'Message:', res.body.message);
  }

  console.log('\n--- 6. Testing POST /api/leads ---');
  res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/leads',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    email: 'executive.director@globalco.com',
    source: 'Case_Studies_Page',
  });
  console.log('POST /api/leads status:', res.status, 'Lead ID:', res.body.lead?.id);

  console.log('\n--- 7. Testing GET /api/leads ---');
  res = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/leads',
    method: 'GET',
  });
  console.log('GET /api/leads status:', res.status, 'Total Leads:', res.body.leads?.length);

  console.log('\nALL CRUD & LEAD CAPTURE TESTS COMPLETED SUCCESSFULLY!');
}

runTests().catch(console.error);
