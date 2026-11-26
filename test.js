require('dotenv').config();
const assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
const base=process.env.TEST_URL||'http://localhost:3001';
async function request(path,method='GET',body,token,key){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(key?{'Idempotency-Key':key}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,data:await r.json()};}
async function ok(...args){const r=await request(...args);assert.ok(r.status>=200&&r.status<300,JSON.stringify(r));return r.data;}
async function main(){const admin=(await ok('/login','POST',{email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD})).token;const password='Test-pass-123!';async function customer(){const email=randomUUID()+'@example.test';await ok('/register','POST',{email,password});return (await ok('/login','POST',{email,password})).token;}
const a=await customer(),b=await customer();const p=await ok('/products','POST',{name:'Test item '+randomUUID(),price:1000,stock:2},admin);const q=await ok('/products','POST',{name:'Scarce item '+randomUUID(),price:900,stock:1},admin);
const stock=async id=>(await ok('/products','GET',undefined,admin)).find(x=>x._id===id).stock;
await ok('/cart/'+p._id,'PUT',{qty:1},a);const key=randomUUID();const [o,r]=await Promise.all([ok('/checkout','POST',{total:1},a,key),ok('/checkout','POST',{},a,key)]);assert.equal(o._id,r._id);assert.equal(o.subtotal,1000);assert.equal(o.shipping,1036);assert.equal(o.total,2036);assert.equal(await stock(p._id),1);assert.equal((await ok('/cart','GET',undefined,a)).items.length,0);console.log('PASS repeated key, server pricing, shipping 1036, cart cleared',o._id);
await ok('/cart/'+p._id,'PUT',{qty:1},a);await ok('/cart/'+q._id,'PUT',{qty:1},a);await ok('/cart/'+q._id,'PUT',{qty:1},b);await ok('/checkout','POST',{},b,randomUUID());const failed=await request('/checkout','POST',{},a,randomUUID());assert.equal(failed.status,409);assert.equal(await stock(p._id),1);console.log('PASS low stock rollback');
assert.equal((await request('/orders/'+o._id,'GET',undefined,b)).status,404);await Promise.all([ok('/orders/'+o._id+'/cancel','POST',{},a),ok('/orders/'+o._id+'/cancel','POST',{},a)]);assert.equal(await stock(p._id),2);console.log('PASS owner access and cancel exactly once');
await ok('/cart/'+q._id,'DELETE',undefined,a);await ok('/cart/'+p._id,'PUT',{qty:2},a);const free=await ok('/checkout','POST',{},a,randomUUID());assert.equal(free.shipping,0);assert.equal(free.total,2000);console.log('PASS free shipping threshold 1986');}
main().catch(e=>{console.error(e);process.exitCode=1;});

