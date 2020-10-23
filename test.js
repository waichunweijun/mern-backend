let DUMMY_USERS = [{
    id: 'u1',
    name: 'waichun',
    email: 'test@test.com',
    password: 'test',
}
]


let email = 'test@test.com';
let password = 'test';
const user = DUMMY_USERS.find(u => {
    return u.email === email;
});
console.log(user);


