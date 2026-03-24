/**
 * auth.js — Route Guards
 * 페이지 접근 권한 검사만 담당합니다.
 * 헤더 렌더링은 js/components/header.js 를 참조하세요.
 */

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
    return false;
  }
  return true;
}
