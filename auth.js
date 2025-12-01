// @ts-nocheck
/* ========== AUTH (localStorage) ========== */
const AUTH_KEY = 'adoptard_user'; // { email, role: 'refugio'|'admin' }  // Visitante = null

function setUser(u){ localStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
function getUser(){ try{ return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch { return null; } }
function logout(){ localStorage.removeItem(AUTH_KEY); location.href='index.html'; }

/* ========== UI según rol (visitante por defecto) ========== */
function initAuthUI(){
  const u = getUser();

  // Marcar link activo
  const here = (location.pathname.split('/').pop() || 'index.html');
  const menuLinks = document.querySelectorAll('nav.menu a');
  menuLinks.forEach(a=>{
    if(a.getAttribute('href') === here){
      a.style.color = '#2F7D5C';
      a.style.fontWeight = '700';
    }
  });

  // Referencias de menú
  const linkAdmin = document.querySelector('a[href="panel-admin.html"]');
  const linkRef   = document.querySelector('a[href="panel-refugio.html"]');
  const linkLogin = document.querySelector('a[href="login.html"]');

  // VISITANTE (no logueado): NO ve paneles
  if(!u){
    if(linkAdmin) linkAdmin.style.display = 'none';
    if(linkRef)   linkRef.style.display   = 'none';

    // Asegurar "Ingresar"
    if(linkLogin){
      linkLogin.textContent = 'Ingresar';
      linkLogin.setAttribute('href','login.html');
      linkLogin.onclick = null;
    }
    return;
  }

  // REFUGIO logueado: ve todo menos Admin
  if(u.role === 'refugio'){
    if(linkAdmin) linkAdmin.style.display = 'none';
    if(linkRef)   linkRef.style.display   = 'inline';
  }

  // ADMIN logueado: ve todo menos Refugio
  if(u.role === 'admin'){
    if(linkRef)   linkRef.style.display   = 'none';
    if(linkAdmin) linkAdmin.style.display = 'inline';
  }

  // Cambiar "Ingresar" por "Salir"
  if(linkLogin){
    linkLogin.textContent = 'Salir';
    linkLogin.setAttribute('href', '#');
    linkLogin.onclick = function(e){ e.preventDefault(); logout(); };
  }
}

/* ========== Guards de ruta ========== */
// Requiere que esté logueado con un rol específico
function requireRole(role){
  const u = getUser();
  if(!u || u.role !== role){
    alert('Acceso restringido: inicia sesión con el rol adecuado.');
    location.href = 'login.html';
  }
}

// Prohíbe ciertos roles (si coincide, redirige)
function forbidRoles(roles){
  const u = getUser();
  if(u && roles.includes(u.role)){
    alert('No tienes permisos para esta sección.');
    location.href = 'index.html';
  }
}
