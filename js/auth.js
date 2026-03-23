document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('header');

    // Load header content
    fetch('_header.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;
            updateHeader();
        });

    function updateHeader() {
        const navLinks = document.querySelector('.nav-links');
        // Mock user object - replace with actual session management
        const user = JSON.parse(sessionStorage.getItem('user')); 

        if (user) {
            if (user.role === 'ADMIN') {
                navLinks.innerHTML = `
                    <a href="admin-dashboard.html">관리자 페이지</a>
                    <a href="#" id="logout-btn">로그아웃</a>
                `;
            } else {
                navLinks.innerHTML = `
                    <span>${user.name}님</span>
                    <a href="mypage.html">마이페이지</a>
                    <a href="#" id="logout-btn">로그아웃</a>
                `;
            }
            document.getElementById('logout-btn').addEventListener('click', () => {
                sessionStorage.removeItem('user');
                window.location.href = '/';
            });
        } else {
            navLinks.innerHTML = `
                <a href="login.html">로그인</a>
                <a href="signup.html">회원가입</a>
            `;
        }
    }
});

function checkAdmin() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'ADMIN') {
        alert('접근 권한이 없습니다.');
        window.location.href = '/';
    }
}

function checkUser() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
    }
}