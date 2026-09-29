
const KEY='shopora_v1';
const seedProducts=[
{id:'p1',name:'AeroSound Max Headphones',cat:'Audio',price:2499,mrp:3999,stock:28,icon:'◉',rating:4.8},
{id:'p2',name:'Nova X Smartwatch',cat:'Wearables',price:3199,mrp:4999,stock:17,icon:'◌',rating:4.7},
{id:'p3',name:'Arc Wireless Speaker',cat:'Audio',price:1899,mrp:2999,stock:34,icon:'◈',rating:4.6},
{id:'p4',name:'Pulse Mechanical Keyboard',cat:'Computing',price:2299,mrp:3499,stock:21,icon:'⌨',rating:4.8},
{id:'p5',name:'Orbit Travel Backpack',cat:'Lifestyle',price:1599,mrp:2499,stock:42,icon:'▣',rating:4.5},
{id:'p6',name:'Luma Desk Lamp',cat:'Home',price:999,mrp:1599,stock:52,icon:'◐',rating:4.4},
{id:'p7',name:'Volt USB-C Hub',cat:'Computing',price:1299,mrp:1999,stock:16,icon:'▦',rating:4.7},
{id:'p8',name:'Flex Fitness Band',cat:'Wearables',price:899,mrp:1499,stock:61,icon:'∞',rating:4.5}
];
function db(){let x=JSON.parse(localStorage.getItem(KEY)||'null');if(!x){x={products:seedProducts,cart:[{id:'p1',qty:1}],wishlist:[],orders:[],addresses:[],coupons:[{code:'SHOP10',type:'percent',value:10,min:500,active:true},{code:'SAVE150',type:'fixed',value:150,min:1000,active:true}],user:{name:'Riyaz',email:'riyaz@example.com',phone:''}};localStorage.setItem(KEY,JSON.stringify(x))}return x}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function money(n){return '₹'+Number(n||0).toLocaleString('en-IN')}
function qs(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}
function toast(msg){let t=qs('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function getProduct(id){return db().products.find(p=>p.id===id)}
function cartItems(){let d=db();return d.cart.map(c=>({...getProduct(c.id),qty:c.qty})).filter(Boolean)}
function cartTotals(){let items=cartItems(),subtotal=items.reduce((s,p)=>s+p.price*p.qty,0),mrp=items.reduce((s,p)=>s+p.mrp*p.qty,0);let coupon=JSON.parse(localStorage.getItem('shopora_coupon')||'null');let cd=0;if(coupon){cd=coupon.type==='percent'?subtotal*coupon.value/100:coupon.value;cd=Math.min(cd,subtotal)}let shipping=subtotal-cd>=999?0:79;return {items,subtotal,mrp,productDiscount:mrp-subtotal,couponDiscount:cd,shipping,total:subtotal-cd+shipping,savings:mrp-subtotal+cd}}
function productCard(p){let disc=Math.round((1-p.price/p.mrp)*100);return `<article class="product-card"><div class="product-art"><small>${disc}% OFF</small><span>${p.icon}</span></div><div class="product-body"><div class="muted">${p.cat} · ★ ${p.rating}</div><h3>${p.name}</h3><div><span class="price">${money(p.price)}</span><span class="old">${money(p.mrp)}</span></div><div class="product-actions"><button class="small-btn" onclick="addWish('${p.id}')">♡</button><button class="small-btn primary-sm" onclick="addCart('${p.id}')">Add to cart</button></div></div></article>`}
function addCart(id){let d=db(),x=d.cart.find(c=>c.id===id);if(x)x.qty++;else d.cart.push({id,qty:1});save(d);updateCartBadge();toast('Added to cart')}
function addWish(id){let d=db();if(!d.wishlist.includes(id))d.wishlist.push(id);save(d);toast('Added to wishlist')}
function updateCartBadge(){let n=db().cart.reduce((s,x)=>s+x.qty,0);qsa('[data-cart-count]').forEach(e=>e.textContent=n)}
function initCommon(){updateCartBadge();let input=qs('[data-search]');if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')location.href='../index.html?search='+encodeURIComponent(input.value)});qsa('[data-logout]').forEach(b=>b.onclick=()=>{localStorage.removeItem('shopora_admin');location.href='../admin-login.html'})}
function renderHome(){let list=qs('#product-grid');if(!list)return;let d=db(),term=new URLSearchParams(location.search).get('search')||'';let ps=d.products.filter(p=>(p.name+' '+p.cat).toLowerCase().includes(term.toLowerCase()));list.innerHTML=ps.map(productCard).join('');let cats=qs('#categories');if(cats){let cs=[...new Set(d.products.map(p=>p.cat))];cats.innerHTML=cs.map(c=>`<a class="feature-card" href="?search=${encodeURIComponent(c)}"><span>✦</span><b>${c}</b><p>Explore ${c} products</p></a>`).join('')}}
function initCart(){let box=qs('#cart-list');if(!box)return;function render(){let t=cartTotals();box.innerHTML=t.items.length?t.items.map(p=>`<div class="panel row"><div style="display:flex;gap:14px;align-items:center"><div class="product-art" style="width:82px;height:82px;border-radius:14px">${p.icon}</div><div><b>${p.name}</b><div class="muted">${p.cat} · ${money(p.price)}</div><div class="qty" style="margin-top:8px"><button onclick="cartQty('${p.id}',-1)">−</button><span>${p.qty}</span><button onclick="cartQty('${p.id}',1)">+</button></div></div></div><button class="ghost-btn" onclick="removeCart('${p.id}')">Remove</button></div>`).join(''):`<div class="panel"><h3>Your cart is empty</h3><a class="primary" href="index.html">Continue shopping</a></div>`;qs('#mrp').textContent=money(t.mrp);qs('#sub').textContent=money(t.subtotal);qs('#pd').textContent='−'+money(t.productDiscount);qs('#cd').textContent='−'+money(t.couponDiscount);qs('#ship').textContent=t.shipping?money(t.shipping):'FREE';qs('#total').textContent=money(t.total);qs('#save').textContent=money(t.savings);updateCartBadge()}window.cartQty=(id,n)=>{let d=db(),x=d.cart.find(c=>c.id===id);if(x){x.qty+=n;if(x.qty<1)d.cart=d.cart.filter(c=>c.id!==id);save(d);render()}};window.removeCart=id=>{let d=db();d.cart=d.cart.filter(c=>c.id!==id);save(d);render()};window.applyCoupon=()=>{let code=qs('#coupon').value.trim().toUpperCase(),d=db(),c=d.coupons.find(x=>x.code===code&&x.active);if(!c){toast('Invalid coupon');return}if(cartTotals().subtotal<c.min){toast('Minimum order is '+money(c.min));return}localStorage.setItem('shopora_coupon',JSON.stringify(c));toast('Coupon applied');render()};render()}
function initCheckout(){let form=qs('#checkout-form');if(!form)return;let d=db();let addresses=qs('#addresses');function renderA(){addresses.innerHTML=d.addresses.length?d.addresses.map((a,i)=>`<div class="address ${i===0?'selected':''}"><b>${a.type||'Address'}</b><div>${a.name} · ${a.phone}</div><div>${a.house}, ${a.area}, ${a.city}, ${a.state} - ${a.pin}</div></div>`).join(''):`<div class="notice">No saved address yet. Add one below.</div>`}renderA();qs('#pin')?.addEventListener('input',async e=>{let pin=e.target.value.replace(/\D/g,'');e.target.value=pin;if(pin.length===6){try{let r=await fetch('https://api.postalpincode.in/pincode/'+pin),j=await r.json();if(j[0]?.Status==='Success'){let x=j[0].PostOffice[0];qs('#city').value=x.District||'';qs('#state').value=x.State||'';toast('City and state filled automatically')}}catch(_){}}});qs('#loc')?.addEventListener('click',()=>{if(!navigator.geolocation){toast('Location unavailable');return}navigator.geolocation.getCurrentPosition(async pos=>{try{let r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`),j=await r.json(),a=j.address||{};qs('#area').value=a.suburb||a.neighbourhood||a.road||'';qs('#city').value=a.city||a.town||a.village||'';qs('#state').value=a.state||'';qs('#pin').value=a.postcode||'';toast('Current location filled')}catch(_){toast('Could not read address')}} ,()=>toast('Location permission denied'))});form.addEventListener('submit',e=>{e.preventDefault();let a={type:qs('#type').value,name:qs('#name').value,phone:qs('#phone').value,house:qs('#house').value,area:qs('#area').value,city:qs('#city').value,state:qs('#state').value,pin:qs('#pin').value};if(!a.name||!a.phone||!a.pin){toast('Fill required details');return}d.addresses=[a,...d.addresses];let t=cartTotals();let order={id:'ORD-'+Date.now().toString().slice(-7),date:new Date().toLocaleString('en-IN'),items:t.items,total:t.total,address:a,status:'Confirmed',payment:qs('input[name=pay]:checked')?.value||'COD'};d.orders.unshift(order);d.cart=[];save(d);localStorage.removeItem('shopora_coupon');location.href='account/orders.html'})}
function adminGuard(){if(localStorage.getItem('shopora_admin')!=='1')location.href='../admin-login.html'}
function initAdmin(){adminGuard();let d=db();let stats={products:d.products.length,orders:d.orders.length,customers:Math.max(1,new Set(d.orders.map(o=>o.address?.phone).filter(Boolean)).size),revenue:d.orders.reduce((s,o)=>s+o.total,0)};qsa('[data-kpi]').forEach(e=>e.textContent= e.dataset.kpi==='revenue'?money(stats.revenue):stats[e.dataset.kpi]);let t=qs('#admin-products');if(t)t.innerHTML=d.products.map(p=>`<tr><td>${p.name}</td><td>${p.cat}</td><td>${money(p.price)}</td><td>${money(p.mrp)}</td><td>${p.stock}</td><td><a class="small-btn" href="edit-product.html?id=${p.id}">Edit</a></td></tr>`).join('');let o=qs('#admin-orders');if(o)o.innerHTML=d.orders.slice(0,12).map(x=>`<tr><td>${x.id}</td><td>${x.address?.name||'Guest'}</td><td>${money(x.total)}</td><td><span class="status ok">${x.status}</span></td><td><a href="order-details.html?id=${x.id}">View</a></td></tr>`).join('')}
function initProductForm(){adminGuard();let d=db(),id=new URLSearchParams(location.search).get('id'),p=id?getProduct(id):null;if(p){qsa('[data-f]').forEach(e=>e.value=p[e.dataset.f]??'');qs('#form-title').textContent='Edit Product'}qs('#product-form')?.addEventListener('submit',e=>{e.preventDefault();let x={id:id||'p'+Date.now(),name:qs('[data-f=name]').value,cat:qs('[data-f=cat]').value,price:+qs('[data-f=price]').value,mrp:+qs('[data-f=mrp]').value,stock:+qs('[data-f=stock]').value,icon:qs('[data-f=icon]').value||'◈',rating:4.6};if(id)d.products=d.products.map(z=>z.id===id?{...z,...x}:z);else d.products.push(x);save(d);toast('Product saved');setTimeout(()=>location.href='products.html',400)})}
function renderOrders(){adminGuard();let d=db(),box=qs('#orders');if(box)box.innerHTML=d.orders.map(o=>`<tr><td>${o.id}</td><td>${o.address?.name||'Guest'}</td><td>${money(o.total)}</td><td>${o.payment}</td><td><span class="status ok">${o.status}</span></td><td><a href="order-details.html?id=${o.id}">Details</a></td></tr>`).join('')}
function renderOrderDetails(){adminGuard();let d=db(),id=new URLSearchParams(location.search).get('id'),o=d.orders.find(x=>x.id===id);if(!o)return;qs('#order-id').textContent=o.id;qs('#order-info').innerHTML=`<div class="stack"><div><b>Customer</b><br>${o.address.name} · ${o.address.phone}</div><div><b>Address</b><br>${o.address.house}, ${o.address.area}, ${o.address.city}, ${o.address.state} - ${o.address.pin}</div><div><b>Payment</b><br>${o.payment}</div><div><b>Total</b><br>${money(o.total)}</div></div>`;qs('#order-items').innerHTML=o.items.map(p=>`<tr><td>${p.name}</td><td>${p.qty}</td><td>${money(p.price)}</td><td>${money(p.price*p.qty)}</td></tr>`).join('');qs('#status').value=o.status;qs('#status-save').onclick=()=>{o.status=qs('#status').value;save(d);toast('Order status updated')};qs('#invoice').onclick=()=>printInvoice(o)}
function printInvoice(o){let w=window.open('','_blank');w.document.write(`<html><head><title>${o.id}</title><style>body{font-family:Arial;padding:40px}table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #ddd;text-align:left}</style></head><body><h1>SHOPORA</h1><p>Invoice: ${o.id}<br>${o.date}</p><h3>Bill to</h3><p>${o.address.name}<br>${o.address.house}, ${o.address.area}<br>${o.address.city}, ${o.address.state} - ${o.address.pin}<br>${o.address.phone}</p><table><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>${o.items.map(p=>`<tr><td>${p.name}</td><td>${p.qty}</td><td>${money(p.price)}</td><td>${money(p.price*p.qty)}</td></tr>`).join('')}</table><h2>Total: ${money(o.total)}</h2><button onclick="print()">Print / Save PDF</button></body></html>`);w.document.close()}
function renderAccount(){let d=db(),name=qs('#profile-name');if(name)name.textContent=d.user.name;let e=qs('#profile-email');if(e)e.textContent=d.user.email;let orders=qs('#my-orders');if(orders)orders.innerHTML=d.orders.map(o=>`<div class="panel row"><div><b>${o.id}</b><div class="muted">${o.date} · ${money(o.total)}</div></div><span class="status ok">${o.status}</span></div>`).join('')||'<div class="notice">No orders yet.</div>';let ad=qs('#my-addresses');if(ad)ad.innerHTML=d.addresses.map(a=>`<div class="address"><b>${a.type}</b><div>${a.name} · ${a.phone}</div><div>${a.house}, ${a.area}, ${a.city}, ${a.state} - ${a.pin}</div></div>`).join('')||'<div class="notice">No saved addresses.</div>'}
document.addEventListener('DOMContentLoaded',()=>{initCommon();renderHome();initCart();initCheckout();if(document.body.dataset.admin==='1')initAdmin();if(document.body.dataset.productform==='1')initProductForm();if(document.body.dataset.orders==='1')renderOrders();if(document.body.dataset.orderdetails==='1')renderOrderDetails();if(document.body.dataset.account==='1')renderAccount()});
/* =========================================
   MOBILE MENU + HEADER SCROLL
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- MOBILE MENU ---------- */

  const menuBtn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("mobileMenuClose");

  if (menuBtn && menu) {

    menuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      menu.classList.add("active");
      document.body.style.overflow = "hidden";
    });

  }

  if (closeBtn && menu) {

    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();

      menu.classList.remove("active");
      document.body.style.overflow = "";
    });

  }

  /* Close menu after selecting an option */

  if (menu) {

    const mobileLinks = menu.querySelectorAll(".mobile-nav a");

    mobileLinks.forEach(function (link) {

      link.addEventListener("click", function () {
        menu.classList.remove("active");
        document.body.style.overflow = "";
      });

    });

  }


  /* ---------- HEADER AUTO HIDE ---------- */

  const header = document.querySelector(".site-header");

  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", function () {

    const currentScrollY = window.scrollY;

    /* At very top */
    if (currentScrollY <= 10) {
      header.classList.remove("header-hidden");
      lastScrollY = currentScrollY;
      return;
    }

    /* Scrolling DOWN */
    if (currentScrollY > lastScrollY + 5) {
      header.classList.add("header-hidden");
    }

    /* Scrolling UP */
    else if (currentScrollY < lastScrollY - 5) {
      header.classList.remove("header-hidden");
    }

    lastScrollY = currentScrollY;

  });

});
