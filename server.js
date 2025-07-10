const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const mysql = require('mysql2');

const publicDir = path.join(__dirname, 'public');
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'penyewaan'
});

db.connect((err) => {
    if (err) {
        console.log("koneksi database gagal");
        process.exit();
    }
    console.log("database terhubung!");
});

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const filePath = req.url === '/' ? '/index.html' : req.url;
        const fullPath = path.join(publicDir, filePath);

        fs.readFile(fullPath, (err, content) => {
            const ext = path.extname(fullPath);
            const contentType = ext === '.css' ? 'text/css' :
                                ext === '.js' ? 'text/javascript' :
                                ext === '.html' ? 'text/html' : 'text/plain';
            res.writeHead(200, { 'content-type': contentType });
            res.end(content);
        });

    } else if (req.method === 'POST' && req.url === '/contact') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            //proses di sini!
            const parsed = parse(body);
            const { name, email, item, duration, message } = parsed;
            const sql = 'insert into contacts (name, email, item, duration, message) values(?, ?, ?, ?, ?)';

            db.query(sql, [name, email, item, duration, message], (err) => {
                if (err) {
                    console.log("gagal simpan ke db");
                    res.writeHead(500, { 'content-type': 'text/plain' });
                    return res.end("gagal simpan ke db");
                }

                res.writeHead(200, { 'content-type': 'text/plain' });
                return res.end('berhasil simpan ke db');
            });
        });
    }
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));

// var http = require('http');
// const mysql = require('mysql2');
// const url = require('url');

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'penyewaan'
// });

// db.connect((err) => {
//     if (err) throw err;
//     console.log('MySQL connected!');
// });

// const server = http.createServer((req, res) => {
//     const parsedUrl = url.parse(req.url, true);

//     if (req.method === 'GET' && parsedUrl.pathname === '/contact') {
//         db.query('SELECT * FROM users', (err, results) => {
//             if (err) {
//                 res.writeHead(500);
//                 return res.end('Database error');
//             }
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(results));
//         });

//     } else if (req.method === 'POST' && parsedUrl.pathname === '/contact') {
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk;
//         });

//         req.on('end', () => {
//             try {
//                 const { name, email, item, duration, message } = JSON.parse(body);

//                 db.query('INSERT INTO users (name, email, item, duration, message) VALUES (?, ?, ?, ?, ?)', [name, email, item, duration, message], (err) => {
//                     if (err) {
//                         res.writeHead(500);
//                         return res.end('Insert failed');
//                     }
//                     res.writeHead(200);
//                     res.end('User added!');
//                 });
//             } catch (e) {
//                 res.writeHead(400);
//                 res.end('Invalid JSON');
//             }
//         });
//     } else {
//         res.writeHead(404);
//         res.end('Tambahkan /contact pada search bar');
//     }
// }).listen(8000);

// console.log('Server running on http://localhost:8000');

