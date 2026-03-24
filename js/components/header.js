/**
 * header.js — Header Component
 * _header.html 로드 및 로그인 상태에 따른 네비게이션 렌더링을 담당합니다.
 * 의존성: js/api/auth.js (logout 함수)
 */
document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('header');
  if (!headerContainer) return;

  fetch('_header.html')
    .then(res => res.text())
    .then(html => {
      headerContainer.innerHTML = html;
      renderNavLinks();
    });

  function renderNavLinks() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user?.role === 'ADMIN') {
      navLinks.innerHTML = `
        <a href="admin-dashboard.html">관리자 페이지</a>
        <a href="#" id="logout-btn">로그아웃</a>
      `;
    } else if (user) {
      navLinks.innerHTML = `
        <span>${user.name}님</span>
        <a href="reservation.html">내 예약</a>
        <a href="mypage.html">마이페이지</a>
        <a href="#" id="logout-btn">로그아웃</a>
        <a href="index.html" class="nav-btn-reserve">예약하기</a>
      `;
    } else {
      navLinks.innerHTML = `
        <a href="login.html">로그인</a>
        <a href="signup.html">회원가입</a>
        <a href="index.html" class="nav-btn-reserve">예약하기</a>
      `;
    }

    bindLogout();
  }

  function bindLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (logoutBtn.dataset.pending === 'true') return;

      try {
        logoutBtn.dataset.pending = 'true';
        logoutBtn.style.pointerEvents = 'none';
        logoutBtn.style.opacity = '0.6';

        const response = await logout();
        if ((response.msg || 'SUCCESS') !== 'SUCCESS') throw new Error(response.msg);

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        window.location.href = '/';
      } catch {
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      } finally {
        logoutBtn.dataset.pending = 'false';
        logoutBtn.style.pointerEvents = '';
        logoutBtn.style.opacity = '';
      }
    });
  }
});