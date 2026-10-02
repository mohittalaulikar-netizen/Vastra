const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let cart=store.get("v_cart",[]),wish=store.get("v_wish",[]);
const find=id=>PRODUCTS.find(p=>p.id===id);
const logo=`<a class="logo" href="index.html" aria-label="VASTRA home">VASTRA</a>`;
document.body.insertAdjacentHTML("afterbegin",`
<header id="hdr"><nav class="l"><a href="shop.html?c=all">New Arrivals</a><a href="shop.html?c=shirts">Shirts</a><a href="shop.html?c=t-shirts">T-Shirts</a><a href="shop.html?c=all">Collections</a></nav>
<button class="burger" aria-label="Menu" id="menuBtn">Menu</button>${logo}
<div class="r"><button id="sBtn">Search</button><button id="wBtn">Wishlist <i id="wN"></i></button><button id="cBtn">Bag <i id="cN"></i></button></div></header>
<div id="menu" class="overlay"><button class="x" data-close>Close</button><a href="shop.html?c=all">New Arrivals</a><a href="shop.html?c=shirts">Shirts</a><a href="shop.html?c=t-shirts">T-Shirts</a><a href="shop.html?c=all">Collections</a></div>
<div id="search" class="overlay"><button class="x" data-close>Close</button><input id="q" placeholder="SEARCH VASTRA" aria-label="Search"><p class="pop">${["Shirts","T-Shirts","Oxford","Linen","New Arrivals","Bestsellers"].map(t=>`<button>${t}</button>`).join("")}</p><div id="res" class="grid g3"></div></div>
<aside id="cart" class="drawer"><div class="dh"><h3>Your bag</h3><button data-close>Close</button></div><div id="items"></div><div class="dh foot"><div class="sum"><span>Subtotal</span><b id="sub"></b></div><p class="note">Complimentary shipping on qualifying orders.</p><button class="btn dark" id="chk">Checkout</button></div></aside><div id="scrim"></div>`);
document.body.insertAdjacentHTML("beforeend",`<footer><div class="fg"><div><div class="logo">VASTRA</div><p>The art of everyday luxury.</p></div>
<div><h4>Shop</h4><a href="shop.html?c=all">New Arrivals</a><a href="shop.html?c=shirts">Shirts</a><a href="shop.html?c=t-shirts">T-Shirts</a><a href="shop.html?c=all">Bestsellers</a></div>
<div><h4>About</h4><a href="index.html#story">Our Story</a><a href="index.html#craft">Craftsmanship</a><a href="index.html#craft">Materials</a></div>
<div><h4>Customer care</h4><a href="#">Contact</a><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Size Guide</a><a href="#">FAQs</a></div>
<div><h4>Follow</h4><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Pinterest</a></div></div>
<p class="copy">© 2026 VASTRA. All rights reserved. <a href="#">Privacy</a> <a href="#">Terms</a> <a href="#">Cookies</a></p></footer>`);
const open=id=>{$$(".overlay.on,.drawer.on").forEach(e=>e.classList.remove("on"));$(id).classList.add("on");$("#scrim").classList.add("on");if(id==="#search")$("#q").focus()};
const closeAll=()=>{$$(".on").forEach(e=>e.classList.remove("on"))};
$("#menuBtn").onclick=()=>open("#menu");$("#sBtn").onclick=()=>open("#search");$("#cBtn").onclick=()=>{renderCart();open("#cart")};
$("#wBtn").onclick=()=>{location.href="shop.html?c=wish"};$("#scrim").onclick=closeAll;$$("[data-close]").forEach(b=>b.onclick=closeAll);
document.onkeydown=e=>{if(e.key==="Escape")closeAll()};
const hdr=$("#hdr"),solid=()=>hdr.classList.toggle("solid",scrollY>40||!document.body.classList.contains("home"));solid();addEventListener("scroll",solid,{passive:true});
function card(p){const w=wish.includes(p.id);return`<article class="pc"><a href="product.html?id=${p.id}" class="im"><img loading="lazy" src="img/${p.img}.webp" alt="${p.name}"></a><button class="wl ${w?"on":""}" data-w="${p.id}" aria-label="Wishlist">${w?"Saved":"Save"}</button><div class="pi"><h3><a href="product.html?id=${p.id}">${p.name}</a></h3><p>${p.desc}</p><p class="m">${inr(p.price)} &nbsp; ${p.colors.join(" / ")}</p><button class="qa" data-a="${p.id}">Quick add</button></div></article>`}
function bind(){$$("[data-w]").forEach(b=>b.onclick=()=>{const id=b.dataset.w;wish=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];store.set("v_wish",wish);b.classList.toggle("on");b.textContent=b.classList.contains("on")?"Saved":"Save";badge()});
$$("[data-a]").forEach(b=>b.onclick=()=>{add(b.dataset.a,find(b.dataset.a).colors[0],"M",1)})}
function add(id,color,size,qty){const l=cart.find(i=>i.id===id&&i.color===color&&i.size===size);l?l.qty+=qty:cart.push({id,color,size,qty});store.set("v_cart",cart);renderCart();open("#cart")}
function badge(){$("#cN").textContent=cart.reduce((a,i)=>a+i.qty,0)||"";$("#wN").textContent=wish.length||""}
function renderCart(){badge();$("#items").innerHTML=cart.length?cart.map((i,n)=>{const p=find(i.id);return`<div class="ci"><img src="img/${p.img}.webp" alt=""><div><h4>${p.name}</h4><p>${i.color} · ${i.size}</p><p><button data-q="${n}" data-d="-1">−</button> ${i.qty} <button data-q="${n}" data-d="1">+</button></p></div><div class="ra"><b>${inr(p.price*i.qty)}</b><button data-r="${n}">Remove</button></div></div>`}).join(""):`<p class="empty">Your bag is empty. <a href="shop.html?c=all">Explore the collection</a>.</p>`;
$("#sub").textContent=inr(cart.reduce((a,i)=>a+find(i.id).price*i.qty,0));
$$("[data-q]").forEach(b=>b.onclick=()=>{const i=cart[b.dataset.q];i.qty+=+b.dataset.d;if(i.qty<1)cart.splice(b.dataset.q,1);store.set("v_cart",cart);renderCart()});
$$("[data-r]").forEach(b=>b.onclick=()=>{cart.splice(b.dataset.r,1);store.set("v_cart",cart);renderCart()})}
$("#chk").onclick=()=>{if(!cart.length)return;alert("Checkout is a preview. Connect a payment provider to take orders.")};
const search=t=>{t=t.toLowerCase();const r=PRODUCTS.filter(p=>!t||(p.name+p.cat+p.fabric+p.desc).toLowerCase().includes(t.replace("new arrivals","").replace("bestsellers","").trim())||(t==="bestsellers"&&p.best));$("#res").innerHTML=r.length?r.map(card).join(""):`<p class="empty">No results. Try “shirts” or “linen”.</p>`;bind()};
$("#q").oninput=e=>search(e.target.value);$$(".pop button").forEach(b=>b.onclick=()=>{$("#q").value=b.textContent;search(b.textContent)});search("");
badge();renderCart();bind();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});$$(".rv").forEach(e=>io.observe(e));
window.VA={card,bind,add,wish:()=>wish};
