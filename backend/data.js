import bcrypt from 'bcryptjs';


//"Statiskie" noklusējuma dati - pirms dinamisko datu izveides MongoDB datubāzē 
const data = {
    users:[
        {
        name: 'Rihards',
        email: 'rihards@gmail.com',
        password: bcrypt.hashSync('123456', 16),
        isAdmin: true,
        },
        {
            name: 'Jānis',
            email: 'janis@gmail.com',
            password: bcrypt.hashSync('123456', 16),
            isAdmin: false,
        },
    ],
    products:[
    {
        name: 'Huawei P40',
        category: 'Viedtālruņi',
        image: '/images/2.jpg',
        price: 949,
        brand: 'Huawei',
        rating: 4.8,
        numReviews: 15,
        countInStock: 0,
        description: 'testtesttesttesttesttesttesttest',
    },
    {
        name: 'Huawei P30',
        category: 'Televizori',
        image: '/images/2.jpg',
        price: 399,
        brand: 'Huawei',
        rating: 4.3,
        numReviews: 15,
        countInStock: 3,
        description: 'testtesttesttesttesttesttesttest',
    },
    {
        name: 'iPhone XR Pro',
        category: 'Veļasmašīnas',
        image: '/images/1.jpg',
        price: 1199,
        brand: 'Apple',
        rating: 3.2,
        numReviews: 15,
        countInStock: 10,
        description: 'testtesttesttesttesttesttesttest',
    },
    {
        name: 'iPhone XS',
        category: 'Viedtālruņi',
        image: '/images/1.jpg',
        price: 1199,
        brand: 'Apple',
        rating: 5,
        numReviews: 15,
        countInStock: 15,
        description: 'testtesttesttesttesttesttesttest',
    },
],
};
export default data;