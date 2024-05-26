document.getElementById('checkButton').addEventListener('click', checkDNS);

function checkDNS() {
    document.getElementById('results').innerHTML = '正在检测...';

    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            document.getElementById('results').innerHTML = `客户端IP地址: ${ip}<br>`;

            // 检测DNSSEC
            fetch(`https://dns.google/resolve?name=example.com&type=DNSKEY`)
                .then(response => response.json())
                .then(dnsData => {
                    const dnssecSupported = dnsData.AD === true;
                    document.getElementById('results').innerHTML += `DNSSEC支持: ${dnssecSupported ? '是' : '否'}<br>`;
                });

            // 检测EDNS
            fetch(`https://dns.google/resolve?name=example.com&type=A&edns_client_subnet=${ip}`)
                .then(response => response.json())
                .then(ednsData => {
                    const ednsSupported = ednsData.Question[0].name === 'example.com';
                    document.getElementById('results').innerHTML += `EDNS支持: ${ednsSupported ? '是' : '否'}<br>`;
                });

            // 检测IPv6
            fetch('https://api64.ipify.org?format=json')
                .then(response => response.json())
                .then(ipv6Data => {
                    const ipv6 = ipv6Data.ip;
                    const ipv6Supported = ipv6.includes(':');
                    document.getElementById('results').innerHTML += `IPv6支持: ${ipv6Supported ? '是' : '否'}<br>`;
                });

            // 显示解析上游地址
            fetch(`https://dns.google/resolve?name=example.com&type=A`)
                .then(response => response.json())
                .then(resolveData => {
                    const resolverIP = resolveData.Authority[0]?.data || '未知';
                    document.getElementById('results').innerHTML += `解析上游地址: ${resolverIP}<br>`;
                });
        })
        .catch(error => {
            document.getElementById('results').innerHTML = '检测失败: ' + error.message;
        });
